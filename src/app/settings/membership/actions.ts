"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateMembership(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // 1. Extract All Fields

    // Personal
    const full_name_ne = formData.get("full_name_ne") as string;
    const full_name_en = formData.get("full_name_en") as string;

    // Identity
    const gender_code = formData.get("genderCode") as string;
    const gender_raw = formData.get("genderRaw") as string;
    const gender = (["male", "female", "lgbtqi_plus", "prefer_not_to_say", "other"].includes(gender_code) ? gender_code : "other");

    // Inclusion (Comma separated keys from form)
    const inclusion_groups_raw = formData.get("inclusionGroups") as string; // "dalit,women"
    const inclusion_groups = inclusion_groups_raw ? inclusion_groups_raw.split(",").filter(Boolean) : [];
    const inclusion_raw = formData.get("inclusionRaw") as string;

    // Contact
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    // Address (Geo)
    const province_id = formData.get("provinceId") as string;
    const district_id = formData.get("districtId") as string;
    const local_level_id = formData.get("localLevelId") as string;
    const ward = formData.get("ward") as string;
    const tole_ne = formData.get("toleNe") as string; // Manual Tole

    // Address Text Names (from hidden fields or derived if client sends them, 
    // but better to trust the IDs? For now client sends text names too for simplicity)
    const province_ne = formData.get("provinceNe") as string;
    const district_ne = formData.get("districtNe") as string;
    const local_level_ne = formData.get("localLevelNe") as string;

    // Combined Address
    const address_ne = `${local_level_ne || ''} - ${ward}, ${tole_ne || ''}`;

    // Party Details
    const motivation_text_ne = formData.get("motivationTextNe") as string;
    const skills_text = formData.get("skillsText") as string;
    const past_affiliations = formData.get("pastAffiliations") as string;


    // 2. Fetch Current Data to Diff
    const { data: currentMember, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

    if (fetchError || !currentMember) {
        throw new Error("Could not fetch member record.");
    }

    // 3. Prepare Update Payload
    // We update columns directly. For JSON fields (meta, inclusion_groups_ne/en), we might skip full label generation here 
    // unless we fetch the dictionaries. For simplicity, we save the keys/codes mostly, 
    // consistent with how 'createMembership' works but simpler. 
    // Note: createMembership generates labels. 
    // We will save `inclusion_groups` array column which is valid for Postgres array.

    // Merge Meta
    const currentMeta = currentMember.meta || {};
    const newMeta = {
        ...currentMeta,
        ward: ward,
        geoProvinceId: province_id,
        geoDistrictId: district_id,
        geoLocalLevelId: local_level_id,
        updatedBy: "user_settings"
    };

    const newValues: Record<string, any> = {
        full_name_ne,
        full_name_en,
        phone,
        email,

        // Gender
        gender,
        gender_code,
        gender_raw: gender_raw || null,

        // Inclusion
        inclusion_groups, // Postgres TEXT[]
        inclusion_raw: inclusion_raw || null,

        // Address
        province_ne,
        district_ne,
        local_level_ne,
        address_ne,

        // Party
        motivation_text_ne,
        skills_text: skills_text || null,
        past_affiliations: past_affiliations || null,

        // Meta
        meta: newMeta
    };

    // 4. Calculate Diff
    const changes: Record<string, { old: any, new: any }> = {};
    const dbUpdates: Record<string, any> = {};
    let hasChanges = false;

    for (const key of Object.keys(newValues)) {
        const newVal = newValues[key];
        const oldVal = currentMember[key];

        // Deep diff for JSON objects? Simple ref check for now, or JSON stringify
        const nStr = typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal || "");
        const oStr = typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal || "");

        // Determine if changed (Loose equality for null vs empty string)
        const isDiff = nStr !== oStr && !(!newVal && !oldVal); // ignore both falsey

        if (isDiff) {
            changes[key] = { old: oldVal, new: newVal };
            dbUpdates[key] = newVal;
            hasChanges = true;
        }
    }

    if (!hasChanges) {
        return { success: true, message: "No changes detected." };
    }

    // 5. Audit Log
    const oldDataSnapshot = Object.keys(changes).reduce((acc, k) => ({ ...acc, [k]: changes[k].old }), {});
    const newDataSnapshot = Object.keys(changes).reduce((acc, k) => ({ ...acc, [k]: changes[k].new }), {});

    console.log("Attempting Audit Log Insert:", { changes: Object.keys(changes) });

    const { error: auditError } = await supabase
        .from("audit_logs")
        .insert({
            table_name: "members",
            record_id: currentMember.id,
            action: "UPDATE",
            actor_id: user.id,
            old_data: oldDataSnapshot,
            new_data: newDataSnapshot,
            reason: "User self-update via Settings (Full Form)",
        });

    if (auditError) {
        console.error("Audit log failed DETAILS:", auditError);
        throw new Error(`Security Audit Failed: ${auditError.message}`);
    }

    // 6. Execute Update
    const { error: updateError } = await supabase
        .from("members")
        .update({
            ...dbUpdates,
            last_verified_at: new Date().toISOString()
        })
        .eq("id", currentMember.id);

    if (updateError) {
        console.error("Member update failed DETAILS:", updateError);
        throw new Error(`Failed to update membership record: ${updateError.message}`);
    }

    revalidatePath("/members");
    revalidatePath("/settings/membership");

    return { success: true };
}
