-- Social Features Migration
-- Created: 2081-12-24 (2024-12-24)
-- Features: Follow System, Notifications, Direct Messaging

-- ============================================
-- 1. FOLLOW SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON user_follows(following_id);

-- RLS for follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows: Anyone can view" ON user_follows;
CREATE POLICY "Follows: Anyone can view" ON user_follows
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Follows: Users manage own" ON user_follows;
CREATE POLICY "Follows: Users manage own" ON user_follows
    FOR ALL USING (auth.uid() = follower_id);


-- ============================================
-- 2. NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('mention', 'follow', 'comment', 'like', 'new_post', 'new_article', 'thread_reply', 'dm')),
    title TEXT NOT NULL,
    body TEXT,
    link TEXT,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reference_id TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_actor ON notifications(actor_id);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications: Users see own" ON notifications;
CREATE POLICY "Notifications: Users see own" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Notifications: Users update own" ON notifications;
CREATE POLICY "Notifications: Users update own" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Notifications: System can insert" ON notifications;
CREATE POLICY "Notifications: System can insert" ON notifications
    FOR INSERT WITH CHECK (true); -- Controlled via server actions


-- ============================================
-- 3. DIRECT MESSAGING
-- ============================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    last_read_at TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants(user_id);

-- Direct Messages
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_dm_conversation ON direct_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dm_sender ON direct_messages(sender_id);

-- RLS for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Conversations: Participants only" ON conversations;
CREATE POLICY "Conversations: Participants only" ON conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = conversations.id
            AND user_id = auth.uid()
        )
    );

-- RLS for conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ConvParticipants: Participants see" ON conversation_participants;
CREATE POLICY "ConvParticipants: Participants see" ON conversation_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants cp
            WHERE cp.conversation_id = conversation_participants.conversation_id
            AND cp.user_id = auth.uid()
        )
    );

-- RLS for direct_messages
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "DM: Participants only" ON direct_messages;
CREATE POLICY "DM: Participants only" ON direct_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = direct_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "DM: Sender can insert" ON direct_messages;
CREATE POLICY "DM: Sender can insert" ON direct_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = direct_messages.conversation_id
            AND user_id = auth.uid()
        )
    );


-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to update conversation updated_at when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON direct_messages;
CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON direct_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Function to find existing 1:1 conversation between two users
CREATE OR REPLACE FUNCTION find_existing_conversation(user_a UUID, user_b UUID)
RETURNS TABLE(conversation_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT cp1.conversation_id
    FROM conversation_participants cp1
    INNER JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    WHERE cp1.user_id = user_a AND cp2.user_id = user_b
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 5. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON user_follows TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON conversation_participants TO authenticated;
GRANT ALL ON direct_messages TO authenticated;
