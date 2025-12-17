-- FIX ENUM VALUES & MISSING COLUMNS
-- Run this to resolve "invalid input value for enum" and "missing updated_at" errors.

BEGIN;

--------------------------------------------------------------------------------
-- 1. FIX ENUM VALUES (channel_visibility)
--------------------------------------------------------------------------------
-- Postgres doesn't support "ADD VALUE IF NOT EXISTS" elegantly in older versions, 
-- but we can use a DO block to check first.

DO $$
BEGIN
    -- Add 'central_committee' if missing
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'central_committee' AND enumtypid = 'public.channel_visibility'::regtype) THEN
        ALTER TYPE public.channel_visibility ADD VALUE 'central_committee';
    END IF;

    -- Add 'leadership' if missing
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'leadership' AND enumtypid = 'public.channel_visibility'::regtype) THEN
        ALTER TYPE public.channel_visibility ADD VALUE 'leadership';
    END IF;

    -- Add 'internal' if missing
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'internal' AND enumtypid = 'public.channel_visibility'::regtype) THEN
        ALTER TYPE public.channel_visibility ADD VALUE 'internal';
    END IF;
    
     -- Add 'board_only' if missing (seen in code)
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'board_only' AND enumtypid = 'public.channel_visibility'::regtype) THEN
        ALTER TYPE public.channel_visibility ADD VALUE 'board_only';
    END IF;
END$$;

--------------------------------------------------------------------------------
-- 2. FIX PROFILE COLUMNS (updated_at)
--------------------------------------------------------------------------------
DO $$ 
BEGIN 
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(); 
EXCEPTION 
    WHEN OTHERS THEN NULL; 
END $$;

COMMIT;
