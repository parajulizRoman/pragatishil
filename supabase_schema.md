# Supabase Schema

Run the following SQL in the **SQL Editor** of your Supabase dashboard to create the required tables and relationships.

```sql
-- 1. Enable UUID extension (usually enabled by default, but good to ensure)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Departments Table
CREATE TABLE public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_ne TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert some default departments (optional example)
INSERT INTO public.departments (slug, name_ne, name_en, sort_order) VALUES
('organization', 'संगठन विभाग', 'Organization Department', 10),
('finance', 'आर्थिक विभाग', 'Finance Department', 20),
('it', 'सूचना तथा प्रविधि', 'IT Department', 30)
ON CONFLICT (slug) DO NOTHING;


-- 3. Create Members Table
CREATE TABLE public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Capacity/Role
    capacity TEXT NOT NULL CHECK (capacity IN ('party_member', 'volunteer', 'other')),
    
    -- Personal Details
    full_name_ne TEXT NOT NULL,
    full_name_en TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'diverse', 'prefer_not_to_say', 'other')),
    
    -- Date of Birth info
    date_of_birth DATE, -- Canonical AD date
    dob_original TEXT NOT NULL, -- As provided by user
    dob_calendar TEXT NOT NULL CHECK (dob_calendar IN ('AD', 'BS', 'unknown')),
    
    -- Address (Nepali)
    province_ne TEXT,
    district_ne TEXT,
    local_level_ne TEXT,
    address_ne TEXT,
    
    -- Address (English)
    province_en TEXT,
    district_en TEXT,
    local_level_en TEXT,
    address_en TEXT,
    
    -- Contact
    phone TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Auth
    auth_user_id UUID DEFAULT NULL, -- Linked Supabase Auth User ID
    
    -- Identity & Profile
    photo_url TEXT,
    citizenship_number TEXT NOT NULL,
    
    -- Party Details
    inspired_by TEXT,
    confidentiality TEXT DEFAULT 'public_ok',
    skills_text TEXT,
    past_affiliations TEXT,
    motivation_text_ne TEXT,
    motivation_text_en TEXT,
    
    -- System Fields
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Member Departments (Join Table)
CREATE TABLE public.member_departments (
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (member_id, department_id)
);

-- 5. Create Member Documents Table
CREATE TABLE public.member_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    
    doc_type TEXT NOT NULL CHECK (doc_type IN ('citizenship', 'voter_id', 'other')),
    image_url TEXT NOT NULL,
    
    -- AI Extracted Data
    extracted_json JSONB,
    extracted_name_raw TEXT,
    extracted_address_raw TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable Row Level Security (RLS)
-- Best practice: Enable RLS on all tables.
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies (Basic)
-- Allow public read access to active departments
CREATE POLICY "Public departments are viewable" ON public.departments
  FOR SELECT USING (is_active = true);

-- Allow Service Role (Server Backend) full access implies bypassing RLS, 
-- but if you want specific authenticated user policies, add them here.
-- For now, our Membership API uses the Service Role Key, which bypasses these policies automatically.

```
