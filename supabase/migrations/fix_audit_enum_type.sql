-- ==========================================
-- FIX: CONVERT AUDIT ACTION TO TEXT
-- ==========================================

-- The error "invalid input value for enum action_type" means the column is 
-- strictly typed to an ENUM that doesn't accept "UPDATE" (maybe it wants "update"?).
-- To prevent these constant schema conflicts, we will convert the column to simple TEXT.
-- This allows any value ('UPDATE', 'Update', 'CREATE', etc.) without error.

DO $$
BEGIN
    -- 1. Try to convert 'action' column to TEXT
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action') THEN
        ALTER TABLE public.audit_logs ALTER COLUMN action TYPE text USING action::text;
    END IF;

    -- 2. Fallback: If 'action_type' still exists (rename failed?), convert it too
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action_type') THEN
        ALTER TABLE public.audit_logs ALTER COLUMN action_type TYPE text USING action_type::text;
        -- And try to rename it again to be consistent
        ALTER TABLE public.audit_logs RENAME COLUMN action_type TO action;
    END IF;

    -- 3. Reload cache
    NOTIFY pgrst, 'reload schema';
END $$;
