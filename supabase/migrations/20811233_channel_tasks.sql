-- Channel Tasks / Kanban Board
-- Task tracking within each channel for projects

-- Create channel_tasks table
CREATE TABLE IF NOT EXISTS channel_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES discussion_channels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    position INTEGER DEFAULT 0, -- For ordering within a column
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_channel_tasks_channel ON channel_tasks(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_tasks_status ON channel_tasks(channel_id, status);
CREATE INDEX IF NOT EXISTS idx_channel_tasks_assigned ON channel_tasks(assigned_to);

-- Enable RLS
ALTER TABLE channel_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- View: All authenticated users who are members of the channel
CREATE POLICY "channel_tasks_select" ON channel_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM channel_members cm
            WHERE cm.channel_id = channel_tasks.channel_id
            AND cm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'yantrik', 'loktantrik_president', 'loktantrik_incharge')
        )
    );

-- Insert: Moderators, incharge, admin, yantrik only
CREATE POLICY "channel_tasks_insert" ON channel_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM channel_members cm
            WHERE cm.channel_id = channel_tasks.channel_id
            AND cm.user_id = auth.uid()
            AND cm.role IN ('moderator', 'incharge')
        )
        OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'yantrik')
        )
    );

-- Update: Moderators, incharge, admin, yantrik only
CREATE POLICY "channel_tasks_update" ON channel_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM channel_members cm
            WHERE cm.channel_id = channel_tasks.channel_id
            AND cm.user_id = auth.uid()
            AND cm.role IN ('moderator', 'incharge')
        )
        OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'yantrik')
        )
    );

-- Delete: Admin and yantrik only
CREATE POLICY "channel_tasks_delete" ON channel_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'yantrik')
        )
    );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_channel_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_channel_tasks_updated_at
    BEFORE UPDATE ON channel_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_channel_tasks_updated_at();

-- Comments
COMMENT ON TABLE channel_tasks IS 'Kanban board tasks for channels';
COMMENT ON COLUMN channel_tasks.status IS 'Task status: todo, in_progress, review, done';
COMMENT ON COLUMN channel_tasks.priority IS 'Task priority: low, medium, high, urgent';
COMMENT ON COLUMN channel_tasks.position IS 'Order within status column for drag-drop';
