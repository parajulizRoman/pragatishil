-- ==========================================
-- FIX: REMOVE LEGACY TARGET_TYPE
-- ==========================================

-- The error "null value in column 'target_type'" specifically blocks us.
-- Our new code uses 'table_name' (which definitely exists now).
-- 'target_type' is likely a legacy column from an old schema version.

-- We simply remove it to allow the insert to proceed.

ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS target_type;

-- Reload cache
NOTIFY pgrst, 'reload schema';
