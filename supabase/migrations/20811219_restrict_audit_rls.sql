-- Restrict audit_logs SELECT to admin only
DROP POLICY IF EXISTS "Enable read access for authorized users" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow read access for admin and higher" ON public.audit_logs;

CREATE POLICY "Enable read access for admin only"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Ensure Insert is still open for system/actions (usually wide open for authenticated or service role, 
-- but we only insert via Service Role usually? 
-- Actually actions use supabaseAdmin (Service Role) often, but some might use client.
-- Let's check INSERT policy. Currently typically "Enable insert for authenticated users" is fine 
-- as long as they can't spoof actor_id.
-- But for reading, we definitely want STRICT ADMIN.
