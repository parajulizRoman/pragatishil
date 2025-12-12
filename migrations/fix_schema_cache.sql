-- ==========================================
-- FIX: RELOAD POSTGREST SCHEMA CACHE
-- ==========================================

-- The error "Could not find the 'action' column ... in the schema cache" 
-- occurs when specific database changes (like new columns) haven't been 
-- propagated to the API layer yet.

-- 1. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';

-- 2. (Optional Safety) Ensure the column definitely exists if the table creation was skipped
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action TEXT;

-- Note: If 'action' exists as an ENUM from a previous migration, the above line does nothing 
-- and that is fine, as 'UPDATE' string casts to ENUM automatically.
