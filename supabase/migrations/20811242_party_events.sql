-- Create party_events table for calendar system
CREATE TABLE IF NOT EXISTS party_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'training', 'rally', 'conference', 'webinar', 'other')),
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ,
    location TEXT,
    location_type TEXT CHECK (location_type IN ('physical', 'online', 'hybrid')),
    meeting_link TEXT,
    recording_url TEXT,
    is_live BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'council_only', 'admin_only')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    channel_id UUID REFERENCES discussion_channels(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES party_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON party_events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_status ON party_events(status);
CREATE INDEX IF NOT EXISTS idx_events_visibility ON party_events(visibility);
CREATE INDEX IF NOT EXISTS idx_events_channel ON party_events(channel_id);
CREATE INDEX IF NOT EXISTS idx_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_user ON event_attendees(user_id);

-- Enable RLS
ALTER TABLE party_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for party_events
-- Public events are visible to everyone
CREATE POLICY "Public events are viewable by everyone"
    ON party_events FOR SELECT
    USING (visibility = 'public');

-- Members can view members_only events
CREATE POLICY "Members can view members_only events"
    ON party_events FOR SELECT
    USING (
        visibility = 'members_only' 
        AND auth.uid() IN (SELECT id FROM profiles WHERE role != 'guest')
    );

-- Council members can view council_only events
CREATE POLICY "Council can view council_only events"
    ON party_events FOR SELECT
    USING (
        visibility = 'council_only' 
        AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik', 'incharge', 'moderator'))
    );

-- Admins can view all events
CREATE POLICY "Admins can view all events"
    ON party_events FOR SELECT
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
    );

-- Admins and yantrik can create events
CREATE POLICY "Admins can create events"
    ON party_events FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik', 'incharge'))
    );

-- Admins and event creators can update events
CREATE POLICY "Admins and creators can update events"
    ON party_events FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
        OR created_by = auth.uid()
    );

-- Admins can delete events
CREATE POLICY "Admins can delete events"
    ON party_events FOR DELETE
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
    );

-- RLS Policies for event_attendees
-- Users can view their own registrations
CREATE POLICY "Users can view their registrations"
    ON event_attendees FOR SELECT
    USING (user_id = auth.uid());

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
    ON event_attendees FOR SELECT
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
    );

-- Authenticated users can register for events
CREATE POLICY "Users can register for events"
    ON event_attendees FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND auth.uid() IS NOT NULL
    );

-- Users can update their own registration status
CREATE POLICY "Users can update their registration"
    ON event_attendees FOR UPDATE
    USING (user_id = auth.uid());

-- Users can cancel their registration
CREATE POLICY "Users can cancel registration"
    ON event_attendees FOR DELETE
    USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_party_events_updated_at
    BEFORE UPDATE ON party_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
