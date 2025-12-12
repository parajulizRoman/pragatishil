-- ==========================================
-- MIGRATION: ADD IDENTITY COLUMNS TO MEMBERS
-- ==========================================

-- 1. Add Gender & Identity Columns
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender_code text; 
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender_label_ne text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender_label_en text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender_raw text; 

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS inclusion_groups text[]; 
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS inclusion_groups_ne jsonb; 
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS inclusion_groups_en jsonb; 
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS inclusion_raw text; 

-- 2. Add Last Verified At (for audit tracking)
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

-- 3. Ensure Audit Logs Table Exists & Has RLS
DO $$ BEGIN
    CREATE TYPE public.audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VETO_ROTATE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- Simplified from enum to text to avoid casting issues in older clients, or use cast
    actor_id UUID REFERENCES auth.users(id),
    old_data JSONB,
    new_data JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert logs (for self-actions)
DROP POLICY IF EXISTS "System/Server can insert logs" ON public.audit_logs;
CREATE POLICY "System/Server can insert logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow Admins to View
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('admin_tech', 'admin')
    );
