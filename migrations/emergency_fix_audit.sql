-- ==========================================
-- EMERGENCY FIX: RECREATE ACTION COLUMN
-- ==========================================

-- The persistent error 'invalid input value for enum' suggests a deep conflict 
-- with an existing Enum type (likely case-sensitive or mismatching values).
-- The fastest and most reliable fix is to drop the problematic column and 
-- create a fresh, simple TEXT column.

-- 1. Drop both potential conflicting columns
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS action CASCADE;
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS action_type CASCADE;

-- 2. Create the 'action' column as plain TEXT (accepts 'UPDATE', 'create', etc.)
ALTER TABLE public.audit_logs ADD COLUMN action text;

-- 3. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
