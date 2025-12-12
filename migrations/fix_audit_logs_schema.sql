-- ==========================================
-- FIX: AUDIT LOGS TABLE SCHEMA & CACHE
-- ==========================================

-- It appears the 'audit_logs' table might have existed previously with a different schema.
-- 'CREATE TABLE IF NOT EXISTS' does NOT add missing columns to an existing table.
-- We must explicitly add them.

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS new_data jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS old_data jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS actor_id uuid REFERENCES auth.users(id);
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS table_name text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS record_id uuid;

-- Fix RLS Policies just in case
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System/Server can insert logs" ON public.audit_logs;
CREATE POLICY "System/Server can insert logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('admin_tech', 'admin')
    );

-- Finally, force the API cache to reload
NOTIFY pgrst, 'reload schema';
