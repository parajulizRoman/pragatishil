-- ==========================================
-- FIX: REMOVE LEGACY TARGET_ID
-- ==========================================

-- The error "null value in column 'target_id'" confirms another legacy column 
-- is blocking our insert (which uses 'record_id').

-- We remove 'target_id' to resolve the conflict.

ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS target_id;

-- Reload cache
NOTIFY pgrst, 'reload schema';
