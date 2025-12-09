/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppMode = 'VOTER_ID' | 'CHAT' | 'IMAGE_STUDIO' | 'LIVE' | 'AUDIO' | 'DASHBOARD';

// -- Supabase Tables --

/*
Supabase table: members
columns:
  id: uuid, primary key, default gen_random_uuid()
  capacity: text, not null -- 'party_member' | 'volunteer' | 'other'
  full_name_ne: text, not null
  full_name_en: text, nullable
  gender: text, nullable -- 'male' | 'female' | 'diverse' | 'prefer_not_to_say' | 'other'
  
  date_of_birth: date, nullable -- canonical AD date
  dob_original: text, not null -- as provided
  dob_calendar: text, not null -- 'AD' | 'BS' | 'unknown'
  
  province_ne: text, nullable
  district_ne: text, nullable
  local_level_ne: text, nullable
  address_ne: text, nullable
  
  province_en: text, nullable
  district_en: text, nullable
  local_level_en: text, nullable
  address_en: text, nullable
  
  phone: text, not null
  email: text, not null
  
  photo_url: text, nullable
  
  citizenship_number: text, not null
  inspired_by: text, nullable
  confidentiality: text, nullable -- 'confidential' | 'public_ok'
  
  skills_text: text, nullable
  past_affiliations: text, nullable
  motivation_text_ne: text, nullable
  motivation_text_en: text, nullable
  
  status: text, not null default 'pending' -- 'pending' | 'approved' | 'rejected'
  meta: jsonb, nullable
  created_at: timestamptz, default now()
  updated_at: timestamptz, default now()
*/
export interface Member {
    id: string;
    capacity: 'party_member' | 'volunteer' | 'other';
    full_name_ne: string;
    full_name_en?: string | null;
    gender?: 'male' | 'female' | 'diverse' | 'prefer_not_to_say' | 'other' | null;

    date_of_birth?: string | null; // ISO Date "YYYY-MM-DD"
    dob_original: string;
    dob_calendar: 'AD' | 'BS' | 'unknown';

    province_ne?: string | null;
    district_ne?: string | null;
    local_level_ne?: string | null;
    address_ne?: string | null;

    province_en?: string | null;
    district_en?: string | null;
    local_level_en?: string | null;
    address_en?: string | null;

    phone: string;
    email: string;

    photo_url?: string | null;

    citizenship_number: string;
    inspired_by?: string | null;
    confidentiality?: 'confidential' | 'public_ok' | null;

    skills_text?: string | null;
    past_affiliations?: string | null;
    motivation_text_ne?: string | null;
    motivation_text_en?: string | null;

    status: 'pending' | 'approved' | 'rejected';
    meta?: any | null;
    created_at?: string;
    updated_at?: string;
}

/*
Supabase table: departments
columns:
  id: uuid, pk, default gen_random_uuid()
  slug: text, unique, not null
  name_ne: text, not null
  name_en: text, not null
  is_active: boolean, default true
  sort_order: integer, default 0
  created_at: timestamptz, default now()
*/
export interface Department {
    id: string;
    slug: string;
    name_ne: string;
    name_en: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
}

/*
Supabase table: member_departments
columns:
  member_id: uuid, not null, fk -> members.id
  department_id: uuid, not null, fk -> departments.id
  created_at: timestamptz, default now()
  primary key (member_id, department_id)
*/
export interface MemberDepartment {
    member_id: string;
    department_id: string;
    created_at?: string;
}

/*
Supabase table: member_documents
columns:
  id: uuid, pk, default gen_random_uuid()
  member_id: uuid, not null, fk -> members.id
  doc_type: text, not null -- 'citizenship' | 'voter_id' | 'other'
  image_url: text, not null -- storage path
  extracted_json: jsonb, nullable
  extracted_name_raw: text, nullable
  extracted_address_raw: text, nullable
  created_at: timestamptz, default now()
*/
export interface MemberDocument {
    id: string;
    member_id: string;
    doc_type: 'citizenship' | 'voter_id' | 'other';
    image_url: string;
    extracted_json?: any | null;
    extracted_name_raw?: string | null;
    extracted_address_raw?: string | null;
    created_at?: string;
}


// -- API Payloads --

export interface MembershipRequestPayload {
    id?: string;
    personal: {
        capacity?: "party_member" | "volunteer" | "other" | null;
        fullNameNe: string;
        fullNameEn?: string | null;

        gender?: "male" | "female" | "diverse" | "prefer_not-to-say" | "other" | null;

        dobOriginal: string;
        dobCalendar: "AD" | "BS" | "unknown";
        dobCanonicalAd?: string | null; // ISO date string if already converted

        provinceNe?: string | null;
        districtNe?: string | null;
        localLevelNe?: string | null;
        addressNe?: string | null;

        provinceEn?: string | null;
        districtEn?: string | null;
        localLevelEn?: string | null;
        addressEn?: string | null;
    };

    contact: {
        phone: string;
        email: string;
    };

    party: {
        skillsText?: string | null;
        pastAffiliations?: string | null;
        motivationTextNe: string;
        motivationTextEn?: string | null;

        departmentIds: string[]; // uuid[]

        inspiredBy?: string | null;
        confidentiality: "confidential" | "public_ok";
    };

    documents: {
        idDocument?: {
            docType: "citizenship" | "voter_id" | "other";
            imageUrl: string;
            extracted?: {
                rawText?: string | null;
                fullNameRaw?: string | null;
                addressRaw?: string | null;
                dateOfBirthRaw?: string | null;
                citizenshipNumberRaw?: string | null;
                voterIdNumberRaw?: string | null;
                provinceNe?: string | null;
                districtNe?: string | null;
                localLevelNe?: string | null;
                wardRaw?: string | null;
            } | null;
            aiModel?: string | null;
            aiRunId?: string | null;
        };
        profilePhoto?: {
            imageUrl: string;
        };
    };

    meta?: {
        source?: string | null;
        locale?: string | null;
        userAgent?: string | null;
        referrer?: string | null;
        aiUsedForPrefill?: boolean | null;
        ward?: string | number | null;
        authUserId?: string | null;
    } | null;
}
