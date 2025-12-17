-- Rename Enum Value 'admin_tech' to 'yantrik'
-- This will automatically update all columns (profiles.role, discussion_channels.min_role_*, etc.) 
-- that use the 'user_role' enum type.

ALTER TYPE user_role RENAME VALUE 'admin_tech' TO 'yantrik';
