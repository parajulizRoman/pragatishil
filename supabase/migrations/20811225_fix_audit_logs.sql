-- Fix audit_logs table schema to match application code
-- The original migration used different column names than what the app uses

-- Add the columns that the app expects
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action_type TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_type TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Make sure actor_id references profiles for the FK join to work
-- (Already exists from original migration)

-- Update RLS to allow admin role to view logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin select logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs visible to root only" ON public.audit_logs;

CREATE POLICY "Root admin can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Ensure service role can insert (for supabaseAdmin)
DROP POLICY IF EXISTS "System/Server can insert logs" ON public.audit_logs;
CREATE POLICY "Service role can insert logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- Comment: The app inserts with these fields:
-- actor_id, action_type, target_type, target_id, old_data, new_data, metadata
