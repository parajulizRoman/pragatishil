-- ==========================================
-- FIX: Members Table RLS Policies
-- ==========================================

-- The table has RLS enabled, but no policies were added for users to see their own data.
-- This caused "No Membership Record Found" even after linking.

-- 1. VIEW OWN DATA
DROP POLICY IF EXISTS "Users can view own member data" ON public.members;
CREATE POLICY "Users can view own member data" ON public.members
    FOR SELECT TO authenticated
    USING (auth_user_id = auth.uid());

-- 2. UPDATE OWN DATA (For Settings Page)
DROP POLICY IF EXISTS "Users can update own member data" ON public.members;
CREATE POLICY "Users can update own member data" ON public.members
    FOR UPDATE TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());
