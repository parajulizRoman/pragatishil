-- 01_normalize_user_role_enum.sql
-- Phase 1: Canonical Role Enum Maintenance
-- Goal: Ensure the user_role enum exists and has all canonical values.
-- Run this and COMMIT before running Phase 2.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'guest',
      'member',
      'party_member',
      'volunteer',
      'team_member',
      'central_committee',
      'board',
      'admin_party',
      'yantrik',
      'admin'
    );
  ELSE
    -- 1. RENAMES (If legacy labels exist)
    IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
               WHERE t.typname = 'user_role' AND e.enumlabel = 'supporter') THEN
      ALTER TYPE user_role RENAME VALUE 'supporter' TO 'member';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
               WHERE t.typname = 'user_role' AND e.enumlabel = 'anonymous_visitor') THEN
      ALTER TYPE user_role RENAME VALUE 'anonymous_visitor' TO 'guest';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
               WHERE t.typname = 'user_role' AND e.enumlabel = 'admin_tech') THEN
      ALTER TYPE user_role RENAME VALUE 'admin_tech' TO 'yantrik';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
               WHERE t.typname = 'user_role' AND e.enumlabel = 'chief_board') THEN
      ALTER TYPE user_role RENAME VALUE 'chief_board' TO 'board';
    END IF;

    -- 2. ADD MISSING VALUES
    BEGIN ALTER TYPE user_role ADD VALUE 'guest'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'member'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'party_member'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'volunteer'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'team_member'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'central_committee'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'board'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'admin_party'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'yantrik'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'admin'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;
