-- ==========================================
-- AUDIT LOGS & MEMBERSHIP EDITING MIGRATION
-- ==========================================

-- 1. Create Audit Action Enum (if not exists)
DO $$ BEGIN
    CREATE TYPE public.audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VETO_ROTATE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action public.audit_action NOT NULL,
    
    -- Who did it?
    actor_id UUID REFERENCES auth.users(id),
    
    -- What changed?
    old_data JSONB,
    new_data JSONB,
    diff JSONB, -- Optional: pre-calculated diff
    
    reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Only Admins can read. System can insert.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        -- RESTRICTION: Only Technical Admins can view raw audit logs
        public.get_user_role(auth.uid()) IN ('admin_tech')
    );
    
-- Insert Policy: Authenticated users can insert logs for their own actions (e.g. self-edit)
-- Or better: Use a function or Service Role to insert logs to prevent tampering.
-- For simplicity in Phase 1: Allow authenticated insert, but we'll trust the server actions.
DROP POLICY IF EXISTS "System/Server can insert logs" ON public.audit_logs;
CREATE POLICY "System/Server can insert logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (
        true -- We allow insertion, validation happens in app logic or via trigger ideally.
    );


-- 3. Add 'last_verified_at' to Members to track when they last checked their data
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
