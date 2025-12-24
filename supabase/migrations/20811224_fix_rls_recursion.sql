-- Fix: RLS Recursion Bug in conversation_participants
-- Run this in Supabase SQL Editor

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "ConvParticipants: Participants see" ON conversation_participants;

-- Simple policy: Users can see rows where they are a participant
CREATE POLICY "ConvParticipants: Users see own" ON conversation_participants
    FOR SELECT USING (user_id = auth.uid());

-- Allow participants to see other participants in same conversation
-- Using a different approach: allow all authenticated users to read
-- (actual filtering happens in app logic via conversation_id)
DROP POLICY IF EXISTS "ConvParticipants: Users see own" ON conversation_participants;
CREATE POLICY "ConvParticipants: Authenticated can read" ON conversation_participants
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow inserting participants (controlled by app)
DROP POLICY IF EXISTS "ConvParticipants: System insert" ON conversation_participants;
CREATE POLICY "ConvParticipants: Authenticated insert" ON conversation_participants
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow updating own participation (e.g., last_read_at)
DROP POLICY IF EXISTS "ConvParticipants: Update own" ON conversation_participants;
CREATE POLICY "ConvParticipants: Update own" ON conversation_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Also fix conversations policy to avoid recursion
DROP POLICY IF EXISTS "Conversations: Participants only" ON conversations;
CREATE POLICY "Conversations: Authenticated can read" ON conversations
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow inserting conversations (controlled by app)
DROP POLICY IF EXISTS "Conversations: Authenticated insert" ON conversations;
CREATE POLICY "Conversations: Authenticated insert" ON conversations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
