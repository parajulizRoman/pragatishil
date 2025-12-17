-- Create categories table
CREATE TABLE discussion_categories (
    name text PRIMARY KEY,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Seed with initial defaults if empty
INSERT INTO discussion_categories (name) VALUES 
('General'), ('Announcements'), ('Local Issues'), ('Policy')
ON CONFLICT DO NOTHING;

-- Ensure existing channels have valid categories (migrating existing text data)
INSERT INTO discussion_categories (name)
SELECT DISTINCT category FROM discussion_channels
WHERE category IS NOT NULL
ON CONFLICT DO NOTHING;

-- Now link them (add FK constraint)
-- We already have 'category' text column in channels.
-- We just add the constraint.
ALTER TABLE discussion_channels
ADD CONSTRAINT fk_channel_category
FOREIGN KEY (category) 
REFERENCES discussion_categories (name)
ON UPDATE CASCADE
ON DELETE RESTRICT;
