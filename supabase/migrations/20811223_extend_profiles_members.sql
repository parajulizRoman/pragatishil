-- Members Management Feature - Extend Profiles Table
-- Adds @handle system, location hierarchy, profession info, and privacy controls

-- =============================================================================
-- 1. ADD @HANDLE SYSTEM
-- =============================================================================

-- Add handle column for Twitter-style mentions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS handle VARCHAR(30);

-- Add unique constraint on handle
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle_unique 
ON public.profiles(handle) WHERE handle IS NOT NULL;

-- Create lowercase version for case-insensitive lookups
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS handle_lower VARCHAR(30);

-- Create function to auto-update handle_lower
CREATE OR REPLACE FUNCTION update_handle_lower()
RETURNS TRIGGER AS $$
BEGIN
    NEW.handle_lower = LOWER(NEW.handle);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Create trigger to auto-update handle_lower
DROP TRIGGER IF EXISTS trigger_update_handle_lower ON public.profiles;
CREATE TRIGGER trigger_update_handle_lower
    BEFORE INSERT OR UPDATE OF handle ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_handle_lower();

-- Index for fast handle lookups
CREATE INDEX IF NOT EXISTS idx_profiles_handle_lower 
ON public.profiles(handle_lower) WHERE handle_lower IS NOT NULL;

-- =============================================================================
-- 2. ADD LOCATION HIERARCHY
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS province_id INTEGER REFERENCES geo_provinces(id),
ADD COLUMN IF NOT EXISTS district_id INTEGER REFERENCES geo_districts(id),
ADD COLUMN IF NOT EXISTS local_level_id INTEGER REFERENCES geo_local_levels(id);

-- Indexes for location-based filtering
CREATE INDEX IF NOT EXISTS idx_profiles_province ON public.profiles(province_id);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district_id);
CREATE INDEX IF NOT EXISTS idx_profiles_local_level ON public.profiles(local_level_id);

-- =============================================================================
-- 3. ADD PROFESSION INFO
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profession VARCHAR(100),
ADD COLUMN IF NOT EXISTS profession_category VARCHAR(50),
ADD COLUMN IF NOT EXISTS organization VARCHAR(255),
ADD COLUMN IF NOT EXISTS position_title VARCHAR(100);

-- Index for profession filtering
CREATE INDEX IF NOT EXISTS idx_profiles_profession_category 
ON public.profiles(profession_category) WHERE profession_category IS NOT NULL;

-- =============================================================================
-- 4. ADD PRIVACY CONTROLS
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_contact_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_contact_phone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT true;

-- =============================================================================
-- 5. ADD SOCIAL LINKS (Optional)
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);

-- =============================================================================
-- 6. ADD VERIFICATION & METADATA
-- =============================================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS member_since DATE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Index for verified members
CREATE INDEX IF NOT EXISTS idx_profiles_verified 
ON public.profiles(verified_at) WHERE verified_at IS NOT NULL;

-- =============================================================================
-- 7. CREATE PROFESSION CATEGORIES LOOKUP TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS profession_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(50) NOT NULL UNIQUE,
    name_ne VARCHAR(100),
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0
);

-- Insert default profession categories
INSERT INTO profession_categories (name_en, name_ne, icon, sort_order) VALUES
('Healthcare', 'स्वास्थ्य', 'stethoscope', 1),
('Legal', 'कानून', 'scale', 2),
('Technology', 'प्रविधि', 'laptop', 3),
('Engineering', 'इन्जिनियरिङ', 'wrench', 4),
('Business', 'व्यापार', 'briefcase', 5),
('Agriculture', 'कृषि', 'leaf', 6),
('Education', 'शिक्षा', 'graduation-cap', 7),
('Finance', 'वित्त', 'banknote', 8),
('Manufacturing', 'उत्पादन', 'factory', 9),
('Retail', 'खुद्रा', 'store', 10),
('Media', 'सञ्चार', 'newspaper', 11),
('Arts', 'कला', 'palette', 12),
('Consultancy', 'परामर्श', 'users', 13),
('Other', 'अन्य', 'user', 99)
ON CONFLICT (name_en) DO NOTHING;

-- Enable RLS on profession_categories
ALTER TABLE public.profession_categories ENABLE ROW LEVEL SECURITY;

-- Public read, admin write for profession_categories
CREATE POLICY "profession_categories_select" ON public.profession_categories
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "profession_categories_insert" ON public.profession_categories
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = (SELECT auth.uid())
            AND p.role IN ('admin_party', 'yantrik', 'board', 'admin')
        )
    );

-- =============================================================================
-- 8. FORCE SCHEMA CACHE RELOAD
-- =============================================================================

NOTIFY pgrst, 'reload schema';
