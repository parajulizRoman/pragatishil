-- Announcements Migration
-- Created: 2081-12-24 (2024-12-24)
-- Feature: Bulk announcements/broadcast to all or specific role groups

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    target_roles TEXT[], -- NULL = all members, or specific roles like ['party_member', 'team_member']
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can view announcements (filtered by target_roles in app logic)
DROP POLICY IF EXISTS "Announcements: All can view" ON announcements;
CREATE POLICY "Announcements: All can view" ON announcements
    FOR SELECT USING (true);

-- Only admin/board/central_committee can insert
DROP POLICY IF EXISTS "Announcements: Admins can create" ON announcements;
CREATE POLICY "Announcements: Admins can create" ON announcements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'yantrik', 'admin_party', 'board', 'central_committee')
        )
    );

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT ALL ON announcements TO authenticated;
