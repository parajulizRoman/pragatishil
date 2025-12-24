-- Enhanced Messaging: Add conversation status and tracking
-- Enables 5-minute inactivity auto-close for lower-rank members

-- 1. Add columns to conversations table
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
-- Status: 'open', 'closed', 'archived'

ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS initiator_id UUID REFERENCES profiles(id);
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS initiator_role TEXT;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- 2. Update existing conversations to have last_message_at from their latest message
UPDATE public.conversations c
SET last_message_at = (
    SELECT MAX(dm.created_at) 
    FROM direct_messages dm 
    WHERE dm.conversation_id = c.id
)
WHERE c.last_message_at IS NULL;

-- 3. Create index for efficient inactivity queries
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at 
ON public.conversations(last_message_at);

CREATE INDEX IF NOT EXISTS idx_conversations_status 
ON public.conversations(status);

-- 4. Comment: Inactivity logic will be handled in the API
-- A conversation is considered "closed for lower roles" if:
-- NOW() - last_message_at > INTERVAL '5 minutes'
-- AND user role NOT IN ('central_committee', 'board', 'admin_party', 'yantrik', 'admin')
