-- ==========================================
-- FIX: RENAME action_type TO action
-- ==========================================

-- The error "null value in column 'action_type'" reveals the database 
-- uses 'action_type' as the required column, but our code sends 'action'.
-- We also likely added 'action' (nullable) in the previous step.

-- We typically want to use 'action' to match our codebase and schema assumptions.
-- So we will rename 'action_type' -> 'action'.

DO $$
BEGIN
    -- 1. Check if we have a conflict (both 'action_type' and a newly added 'action' column exist)
    IF 
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action_type') 
        AND 
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action') 
    THEN
        -- Drop the redundant (likely empty/nullable) 'action' column we just added, 
        -- so we can rename the real column 'action_type' to 'action'.
        ALTER TABLE public.audit_logs DROP COLUMN action;
    END IF;

    -- 2. Rename the column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action_type') THEN
        ALTER TABLE public.audit_logs RENAME COLUMN action_type TO action;
    END IF;

    -- 3. Reload cache
    NOTIFY pgrst, 'reload schema';
END $$;
