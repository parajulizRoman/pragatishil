-- ================================================
-- Database-Driven Role Management
-- Tables for role_levels and messaging_permissions
-- ================================================

-- 1. Create role_levels table
CREATE TABLE IF NOT EXISTS public.role_levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    level INT NOT NULL,
    name_en TEXT NOT NULL,
    name_ne TEXT,
    can_reply BOOLEAN DEFAULT FALSE,
    has_full_history BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT TRUE, -- Cannot be deleted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sorting by level
CREATE INDEX IF NOT EXISTS idx_role_levels_level ON public.role_levels(level);

-- 2. Create messaging_permissions table
CREATE TABLE IF NOT EXISTS public.messaging_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_role TEXT NOT NULL REFERENCES public.role_levels(key) ON DELETE CASCADE,
    recipient_role TEXT NOT NULL REFERENCES public.role_levels(key) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicates
    UNIQUE(sender_role, recipient_role)
);

CREATE INDEX IF NOT EXISTS idx_messaging_permissions_sender ON public.messaging_permissions(sender_role);

-- 3. Enable RLS
ALTER TABLE public.role_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messaging_permissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- role_levels: Anyone can read, only admin can write
DROP POLICY IF EXISTS "Role levels readable by all authenticated" ON public.role_levels;
CREATE POLICY "Role levels readable by all authenticated" ON public.role_levels
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage role levels" ON public.role_levels;
CREATE POLICY "Admin can manage role levels" ON public.role_levels
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- messaging_permissions: Anyone can read, only admin can write
DROP POLICY IF EXISTS "Messaging permissions readable by all authenticated" ON public.messaging_permissions;
CREATE POLICY "Messaging permissions readable by all authenticated" ON public.messaging_permissions
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage messaging permissions" ON public.messaging_permissions;
CREATE POLICY "Admin can manage messaging permissions" ON public.messaging_permissions
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'yantrik'))
    );

-- 5. Seed default role levels
INSERT INTO public.role_levels (key, level, name_en, name_ne, can_reply, has_full_history, is_system) VALUES
    ('guest', 0, 'Guest', 'अतिथि', false, false, true),
    ('supporter', 1, 'Supporter', 'समर्थक', false, false, true),
    ('ward_committee', 2, 'Ward Committee', 'वडा समिति', true, false, true),
    ('palika_committee', 3, 'Palika Committee', 'पालिका समिति', true, false, true),
    ('district_committee', 4, 'District Committee', 'जिल्ला समिति', true, false, true),
    ('state_committee', 5, 'State Committee', 'प्रदेश समिति', true, false, true),
    ('central_committee', 6, 'Central Committee', 'केन्द्रीय समिति', true, true, true),
    ('department', 7, 'Department', 'विभाग', true, true, true),
    ('admin_panel', 8, 'Admin Panel', 'प्रशासन', true, true, true),
    ('advisor_board', 9, 'Advisor Board', 'सल्लाहकार बोर्ड', true, true, true),
    ('yantrik', 10, 'Technical Admin', 'यान्त्रिक', true, true, true),
    ('admin', 11, 'Root Admin', 'मूल प्रशासक', true, true, true)
ON CONFLICT (key) DO UPDATE SET
    level = EXCLUDED.level,
    name_en = EXCLUDED.name_en,
    name_ne = EXCLUDED.name_ne,
    can_reply = EXCLUDED.can_reply,
    has_full_history = EXCLUDED.has_full_history;

-- 6. Seed messaging permissions
INSERT INTO public.messaging_permissions (sender_role, recipient_role) VALUES
    ('ward_committee', 'palika_committee'),
    ('palika_committee', 'district_committee'),
    ('district_committee', 'state_committee'),
    ('state_committee', 'central_committee'),
    ('central_committee', 'department'),
    ('central_committee', 'admin_panel'),
    ('department', 'central_committee'),
    ('department', 'admin_panel'),
    ('admin_panel', 'central_committee'),
    ('admin_panel', 'advisor_board'),
    ('admin_panel', 'admin'),
    ('advisor_board', 'admin_panel'),
    ('advisor_board', 'central_committee'),
    ('yantrik', 'admin')
ON CONFLICT (sender_role, recipient_role) DO NOTHING;

-- 7. Add updated_at trigger
CREATE OR REPLACE FUNCTION update_role_levels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_role_levels_updated_at ON public.role_levels;
CREATE TRIGGER trigger_role_levels_updated_at
    BEFORE UPDATE ON public.role_levels
    FOR EACH ROW
    EXECUTE FUNCTION update_role_levels_updated_at();

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
