-- Add missing enum values to flag_reason to match frontend UI
ALTER TYPE flag_reason ADD VALUE IF NOT EXISTS 'hate';
ALTER TYPE flag_reason ADD VALUE IF NOT EXISTS 'no_logic';
