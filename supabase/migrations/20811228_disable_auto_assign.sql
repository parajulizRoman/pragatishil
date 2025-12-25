-- Disable auto-assignment trigger
-- Members should be assigned by admin only, not automatically on profile update
DROP TRIGGER IF EXISTS trg_assign_geographic_channels ON profiles;

-- The function remains available for manual use if needed
-- DROP FUNCTION IF EXISTS assign_user_to_geographic_channels();
