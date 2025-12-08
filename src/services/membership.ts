
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { MembershipRequestPayload } from "@/types";

/**
 * Creates a new membership application in the database.
 * Inserts into `members`, `member_departments`, and `member_documents`.
 */
export async function createMembershipApplication(payload: MembershipRequestPayload): Promise<{ memberId: string }> {
    validatePayload(payload);

    const { personal, contact, party, documents, meta } = payload;

    // 1. Prepare Members Data
    const citizenshipNumber =
        documents.idDocument?.extracted?.citizenshipNumberRaw ||
        documents.idDocument?.extracted?.voterIdNumberRaw ||
        "PENDING";

    // -- Uniqueness Check --
    // Check if phone or email already exists to provide a friendly error
    const { data: existing } = await supabaseAdmin
        .from('members')
        .select('id, phone, email')
        .or(`phone.eq.${contact.phone},email.eq.${contact.email}`)
        .maybeSingle();

    if (existing) {
        if (existing.phone === contact.phone) throw new Error("A member with this phone number already exists.");
        if (existing.email === contact.email) throw new Error("A member with this email address already exists.");
    }

    // -- Normalization Helpers --
    const names = normalizeNames({
        fullNameNe: personal.fullNameNe,
        fullNameEn: personal.fullNameEn
    });

    const dob = normalizeDob(personal.dobOriginal, personal.dobCalendar);

    // Address & Ward Logic
    // Ensure meta.ward is present if possible (frontend currently sends it)
    // Append Ward to address_ne if needed and not present
    let addressNe = personal.addressNe || null;
    const ward = meta?.ward || null;

    if (addressNe && ward) {
        // pattern check: "ward", "w-", "wno", "w no" (case insensitive)
        const hasWardMention = /w(ard|d)?[-\s.:]?\d+/i.test(addressNe);
        if (!hasWardMention) {
            addressNe = `${addressNe}, Ward-${ward}`;
        }
    }

    // Ensure meta is an object
    const finalMeta = meta || {};
    if (ward) {
        finalMeta.ward = ward;
    }

    const memberData = {
        capacity: personal.capacity || 'party_member',

        full_name_ne: names.full_name_ne,
        full_name_en: names.full_name_en, // Normalized

        gender: personal.gender || null,

        date_of_birth: dob.dateOfBirth, // Normalized AD or null
        dob_original: dob.dobOriginal,
        dob_calendar: dob.dobCalendar,

        province_ne: personal.provinceNe || null,
        district_ne: personal.districtNe || null,
        local_level_ne: personal.localLevelNe || null,
        address_ne: addressNe,

        province_en: personal.provinceEn || null,
        district_en: personal.districtEn || null,
        local_level_en: personal.localLevelEn || null,
        address_en: personal.addressEn || null,

        phone: contact.phone,
        email: contact.email,

        photo_url: documents.profilePhoto?.imageUrl || null,

        citizenship_number: citizenshipNumber,
        inspired_by: party.inspiredBy || null,
        confidentiality: party.confidentiality || 'public_ok',

        skills_text: party.skillsText || null,
        past_affiliations: party.pastAffiliations || null,
        motivation_text_ne: party.motivationTextNe,
        motivation_text_en: party.motivationTextEn || null,

        status: 'approved',
        meta: finalMeta,
        auth_user_id: finalMeta.authUserId || null,
    };

    // 2. Insert into Members Table
    const { data: member, error: memberError } = await supabaseAdmin
        .from('members')
        .insert(memberData)
        .select('id')
        .single();

    if (memberError) {
        console.error("Error inserting member:", memberError);
        throw new Error(`Failed to create member: ${memberError.message}`);
    }

    const memberId = member.id;

    // 3. Insert Departments (Parallel)
    if (party.departmentIds && party.departmentIds.length > 0) {
        // Fetch department UUIDs for the provided slugs
        const { data: departments } = await supabaseAdmin
            .from('departments')
            .select('id, slug')
            .in('slug', party.departmentIds);

        if (departments && departments.length > 0) {
            const deptInserts = departments.map(d => ({
                member_id: memberId,
                department_id: d.id
            }));

            const { error: deptError } = await supabaseAdmin
                .from('member_departments')
                .insert(deptInserts);

            if (deptError) {
                console.error("Error linking departments:", deptError);
            }
        }
    }

    // 4. Insert ID Document (if present)
    if (documents.idDocument) {
        const docData = {
            member_id: memberId,
            doc_type: documents.idDocument.docType,
            image_url: documents.idDocument.imageUrl,
            extracted_json: documents.idDocument.extracted || null,
            extracted_name_raw: documents.idDocument.extracted?.fullNameRaw || null,
            extracted_address_raw: documents.idDocument.extracted?.addressRaw || null
        };

        const { error: docError } = await supabaseAdmin
            .from('member_documents')
            .insert(docData);

        if (docError) {
            console.error("Error inserting document:", docError);
        }
    }

    return { memberId };
}

function validatePayload(payload: MembershipRequestPayload) {
    if (!payload.personal.fullNameNe) throw new Error("Full Name (Nepali) is required");
    if (!payload.contact.phone) throw new Error("Phone number is required");
    if (!payload.contact.email) throw new Error("Email is required");
    if (!payload.party.motivationTextNe) throw new Error("Motivation text is required");
    if (!payload.personal.dobOriginal) throw new Error("Date of Birth is required");
    if (!payload.documents.idDocument) throw new Error("ID Document is required for verification");
}

// -- Helpers --

function normalizeNames(input: { fullNameNe: string; fullNameEn?: string | null }) {
    const full_name_ne = input.fullNameNe;
    let full_name_en = input.fullNameEn || null;

    // Check if fullNameEn is missing but fullNameNe looks like Latin (A-Z, a-z, spaces, dots)
    if (!full_name_en && /^[A-Za-z\s.]+$/.test(full_name_ne)) {
        // Treat as English provided in Nepali field
        full_name_en = full_name_ne;
    }

    return { full_name_ne, full_name_en };
}

function normalizeDob(dobOriginal: string, dobCalendar: "AD" | "BS" | "unknown"): { dateOfBirth: string | null, dobOriginal: string, dobCalendar: string } {
    let dateOfBirth: string | null = null;
    const calendar = dobCalendar;

    if (calendar === "AD" && dobOriginal) {
        // Attempt parse to YYYY-MM-DD
        const parsed = new Date(dobOriginal);
        if (!isNaN(parsed.getTime())) {
            dateOfBirth = parsed.toISOString().split('T')[0];
        }
    }

    // TODO: Implementation for BS -> AD conversion

    return { dateOfBirth, dobOriginal, dobCalendar: calendar };
}
