-- Fix: RLS Recursion Bug in conversation_participants
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "ConvParticipants: Participants see" ON conversation_participants;
DROP POLICY IF EXISTS "ConvParticipants: Users see own" ON conversation_participants;
DROP POLICY IF EXISTS "ConvParticipants: Authenticated can read" ON conversation_participants;
DROP POLICY IF EXISTS "ConvParticipants: System insert" ON conversation_participants;
DROP POLICY IF EXISTS "ConvParticipants: Authenticated insert" ON conversation_participants;
DROP POLICY IF EXISTS "ConvParticipants: Update own" ON conversation_participants;

DROP POLICY IF EXISTS "Conversations: Participants only" ON conversations;
DROP POLICY IF EXISTS "Conversations: Authenticated can read" ON conversations;
DROP POLICY IF EXISTS "Conversations: Authenticated insert" ON conversations;

-- Create clean policies for conversation_participants
CREATE POLICY "ConvParticipants: Authenticated can read" ON conversation_participants
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "ConvParticipants: Authenticated insert" ON conversation_participants
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "ConvParticipants: Update own" ON conversation_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Create clean policies for conversations
CREATE POLICY "Conversations: Authenticated can read" ON conversations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Conversations: Authenticated insert" ON conversations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
