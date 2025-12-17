-- 1) Rename 'admin_tech' to 'yantrik' in 'user_role' or 'user_role_enum' types
DO $$
BEGIN
  -- user_role enum
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role'
      AND e.enumlabel = 'admin_tech'
  ) THEN
    ALTER TYPE user_role RENAME VALUE 'admin_tech' TO 'yantrik';
  END IF;

  -- user_role_enum (alternative name)
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role_enum'
      AND e.enumlabel = 'admin_tech'
  ) THEN
    ALTER TYPE user_role_enum RENAME VALUE 'admin_tech' TO 'yantrik';
  END IF;
END$$;

-- 2) Update TEXT columns only (profiles.role, user_roles.role)
-- We guard these to ensure we don't accidentally run UPDATE on an enum column which should have been handled by step 1.

DO $$
BEGIN
  -- profiles.role as TEXT?
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'role'
      AND data_type    = 'text'
  ) THEN
    UPDATE public.profiles
    SET role = 'yantrik'
    WHERE role = 'admin_tech';
  END IF;

  -- user_roles.role as TEXT?
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'user_roles'
      AND column_name  = 'role'
      AND data_type    = 'text'
  ) THEN
    UPDATE public.user_roles
    SET role = 'yantrik'
    WHERE role = 'admin_tech';
  END IF;
END$$;

-- Note: We do NOT need to update discussion_channels or other tables if they use the ENUM type.
-- The ALTER TYPE RENAME VALUE statement automatically updates the data on disk for enum columns.
