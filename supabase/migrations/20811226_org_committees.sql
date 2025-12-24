-- ================================================
-- Committee Inbox & Issue Escalation System
-- ADDITIVE MIGRATION - Does not modify existing tables
-- ================================================

-- 1. Create org_committees table
CREATE TABLE IF NOT EXISTS public.org_committees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level_key TEXT NOT NULL, -- e.g. 'ward_committee', 'palika_committee'
    name TEXT NOT NULL,
    name_ne TEXT,
    area_code TEXT, -- Geographic identifier
    parent_committee_id UUID REFERENCES public.org_committees(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries by level
CREATE INDEX IF NOT EXISTS idx_org_committees_level_key ON public.org_committees(level_key);
CREATE INDEX IF NOT EXISTS idx_org_committees_parent ON public.org_committees(parent_committee_id);

-- 2. Create org_committee_members table
CREATE TABLE IF NOT EXISTS public.org_committee_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id UUID NOT NULL REFERENCES public.org_committees(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_information_officer BOOLEAN DEFAULT FALSE,
    position_title_en TEXT,
    position_title_ne TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique membership per committee
    UNIQUE(committee_id, profile_id)
);

-- Ensure only ONE information_officer per committee
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_info_officer_per_committee 
ON public.org_committee_members(committee_id) 
WHERE is_information_officer = TRUE;

CREATE INDEX IF NOT EXISTS idx_org_committee_members_profile ON public.org_committee_members(profile_id);

-- 3. Create org_issues table
CREATE TABLE IF NOT EXISTS public.org_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    origin_committee_id UUID REFERENCES public.org_committees(id),
    current_committee_id UUID NOT NULL REFERENCES public.org_committees(id),
    subject TEXT NOT NULL,
    body TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    parent_issue_id UUID REFERENCES public.org_issues(id), -- For escalation tracking
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    escalated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_issues_current_committee ON public.org_issues(current_committee_id);
CREATE INDEX IF NOT EXISTS idx_org_issues_status ON public.org_issues(status);
CREATE INDEX IF NOT EXISTS idx_org_issues_created_by ON public.org_issues(created_by);

-- 4. Create org_issue_comments table
CREATE TABLE IF NOT EXISTS public.org_issue_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    issue_id UUID NOT NULL REFERENCES public.org_issues(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal notes visible only to committee
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_issue_comments_issue ON public.org_issue_comments(issue_id);

-- 5. Enable RLS
ALTER TABLE public.org_committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_issue_comments ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- org_committees: Public read, admin write
DROP POLICY IF EXISTS "Committees viewable by all authenticated" ON public.org_committees;
CREATE POLICY "Committees viewable by all authenticated" ON public.org_committees
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage committees" ON public.org_committees;
CREATE POLICY "Admin can manage committees" ON public.org_committees
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- org_committee_members: Public read, admin write
DROP POLICY IF EXISTS "Committee members viewable by all authenticated" ON public.org_committee_members;
CREATE POLICY "Committee members viewable by all authenticated" ON public.org_committee_members
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage committee members" ON public.org_committee_members;
CREATE POLICY "Admin can manage committee members" ON public.org_committee_members
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- org_issues: Committee members can see their issues, admin sees all
DROP POLICY IF EXISTS "Users can create issues" ON public.org_issues;
CREATE POLICY "Users can create issues" ON public.org_issues
    FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Committee members can view their issues" ON public.org_issues;
CREATE POLICY "Committee members can view their issues" ON public.org_issues
    FOR SELECT TO authenticated USING (
        -- User is member of current committee
        EXISTS (
            SELECT 1 FROM org_committee_members 
            WHERE committee_id = current_committee_id 
            AND profile_id = auth.uid()
        )
        OR
        -- User created the issue
        created_by = auth.uid()
        OR
        -- Admin/yantrik can see all
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

DROP POLICY IF EXISTS "Committee members can update their issues" ON public.org_issues;
CREATE POLICY "Committee members can update their issues" ON public.org_issues
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM org_committee_members 
            WHERE committee_id = current_committee_id 
            AND profile_id = auth.uid()
        )
        OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- org_issue_comments: Similar to issues
DROP POLICY IF EXISTS "Users can comment on issues" ON public.org_issue_comments;
CREATE POLICY "Users can comment on issues" ON public.org_issue_comments
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Comments viewable by issue participants" ON public.org_issue_comments;
CREATE POLICY "Comments viewable by issue participants" ON public.org_issue_comments
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM org_issues i
            JOIN org_committee_members m ON m.committee_id = i.current_committee_id
            WHERE i.id = issue_id AND m.profile_id = auth.uid()
        )
        OR
        EXISTS (SELECT 1 FROM org_issues WHERE id = issue_id AND created_by = auth.uid())
        OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- 7. Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_org_issues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_org_issues_updated_at ON public.org_issues;
CREATE TRIGGER trigger_org_issues_updated_at
    BEFORE UPDATE ON public.org_issues
    FOR EACH ROW
    EXECUTE FUNCTION update_org_issues_updated_at();

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
