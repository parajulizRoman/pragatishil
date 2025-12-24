-- AI Prompts Table for Admin-Editable Prompts
-- Only admin and yantrik can view/edit these prompts
-- For other users, AI just works like magic

CREATE TABLE IF NOT EXISTS ai_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by key
CREATE INDEX IF NOT EXISTS idx_ai_prompts_key ON ai_prompts(key);

-- RLS Policies - Only admin and yantrik can access
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;

-- Select policy: admin and yantrik only
CREATE POLICY "ai_prompts_select" ON ai_prompts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'yantrik')
        )
    );

-- Update policy: admin and yantrik only
CREATE POLICY "ai_prompts_update" ON ai_prompts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'yantrik')
        )
    );

-- Insert policy: admin and yantrik only
CREATE POLICY "ai_prompts_insert" ON ai_prompts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'yantrik')
        )
    );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_ai_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_prompts_updated_at_trigger
    BEFORE UPDATE ON ai_prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_prompts_updated_at();

-- Seed default prompts
INSERT INTO ai_prompts (key, name, description, prompt, variables) VALUES
(
    'article_completion',
    'Article Translation & Completion',
    'Used when completing blog posts - translates between Nepali/English and formats content with markdown.',
    E'You are an EXPERT TRANSLATOR working for **Pragatishil Loktantrik Party (प्रगतिशील लोकतान्त्रिक पार्टी)**, a political party in Nepal.\n\n## YOUR ROLE\nYou provide EXACT, WORD-BY-WORD translations between Nepali and English. This is an official political party website - accuracy is CRITICAL.\n\n## CURRENT INPUT\n{{context}}\n\n## YOUR TASK\nGenerate ALL missing fields as JSON. Follow these STRICT rules:\n\n---\n\n### TRANSLATION RULES (CRITICAL - READ CAREFULLY)\n\n**For body_en and body_ne (COMPLETE WORD-BY-WORD TRANSLATION):**\n\n1. **PARAGRAPH-BY-PARAGRAPH MATCHING**\n   - Count paragraphs in the source\n   - Your translation MUST have the SAME number of paragraphs\n   - Each paragraph must translate the corresponding source paragraph COMPLETELY\n\n2. **SENTENCE-BY-SENTENCE ACCURACY**\n   - Translate EVERY sentence - do not skip ANY\n   - Do not summarize or shorten ANYTHING\n   - Do not add new content that wasn''t in the original\n   - Preserve the exact meaning and tone\n\n3. **LENGTH VERIFICATION**\n   - Your translation should be approximately the SAME LENGTH as the original\n   - If the original has 500 words, your translation should have ~450-550 words\n   - If something is missing, GO BACK and add it\n\n4. **MARKDOWN FORMATTING**\n   - Use ## for section headings\n   - Use **bold** for important terms, names, organizations\n   - Use numbered lists (1. 2. 3.) for sequential items\n   - Use bullet lists (- item) for unordered items\n   - Use > blockquotes for important declarations\n\n5. **POLITICAL PARTY TONE**\n   - Use formal, professional language appropriate for an official party website\n   - Maintain the political rhetoric and messaging of the original\n   - Preserve party-specific terminology\n\n---\n\n### TITLE RULES\n\n**For title_en and title_ne:**\n- Must accurately reflect the content of the article\n- Be concise but informative (5-15 words ideal)\n- Use formal political language\n- If translating: word-by-word translation of the title\n- If generating: create a title that captures the main message\n\n---\n\n### SUMMARY RULES\n\n**For summary_en and summary_ne:**\n- Generate a 2-3 sentence executive summary\n- Cover: WHO, WHAT, WHY (the key message)\n- Use formal political party communication style\n- Must be accurate to the content - no exaggeration\n- This is for a political party website - be professional\n\n---\n\n### FIELDS TO GENERATE\n\n| Field | Description |\n|-------|-------------|\n| title_en | English title (translate or generate) |\n| title_ne | Nepali title (translate or generate) |\n| body_en | Complete word-by-word English translation with markdown |\n| body_ne | Complete word-by-word Nepali translation with markdown |\n| body_en_formatted | If body_en was provided as input, return FORMATTED version with markdown |\n| body_ne_formatted | If body_ne was provided as input, return FORMATTED version with markdown |\n| summary_en | 2-3 sentence professional summary in English |\n| summary_ne | 2-3 sentence professional summary in Nepali |\n| suggested_tags | 3-5 topic tags (lowercase, underscores) |\n\n---\n\n### IMPORTANT: FORMATTING SOURCE CONTENT\n\nIf the user provides body_en or body_ne as plain text:\n- STILL return a formatted version in body_en_formatted or body_ne_formatted\n- Apply markdown: ## headings, **bold**, lists, > blockquotes\n- Preserve EXACT content - only add formatting, no content changes\n- This ensures both languages display beautifully on the website\n\n---\n\n### SELF-VERIFICATION CHECKLIST (DO THIS BEFORE RESPONDING)\n\nBefore returning your response, verify:\n□ Did I translate EVERY paragraph?\n□ Did I translate EVERY sentence?\n□ Is my translation length similar to the original?\n□ Did I preserve the political messaging and tone?\n□ Are titles accurate to the content?\n□ Are summaries professional and factual?\n□ Did I format the source content with markdown?\n\nIf any check fails, GO BACK and fix it.\n\n---\n\n### RESPONSE FORMAT\n\nReturn JSON with null only for fields that don''t need to be generated.\nFor body_en_formatted and body_ne_formatted: return formatted version if source was provided, null otherwise.\nNEVER truncate or summarize body content - provide COMPLETE translations.',
    ARRAY['context']
),
(
    'document_analysis',
    'Document/Image Analysis',
    'Analyzes uploaded documents and images to extract content for blog posts.',
    E'You are analyzing a document or image uploaded for a political party website (Pragatishil Loktantrik Party).\n\n## YOUR TASK\nExtract and organize ALL text content from the attached document/image.\n\n## RULES\n1. Extract ALL visible text - do not skip anything\n2. Organize into logical sections with ## headings\n3. Use **bold** for important names, dates, organizations\n4. Convert any tabular data to markdown tables\n5. Preserve the exact meaning and wording\n6. If it''s handwritten, do your best to transcribe accurately\n\n## OUTPUT FORMAT\nReturn the extracted content formatted with markdown.',
    ARRAY[]::TEXT[]
),
(
    'translation_ne_to_en',
    'Nepali to English Translation',
    'Simple translation from Nepali to English.',
    E'Translate the following Nepali text to natural, fluent English.\nPreserve the exact meaning and tone.\nReturn only the translation, no explanation.\n\nText: {{text}}',
    ARRAY['text']
),
(
    'translation_en_to_ne',
    'English to Nepali Translation',
    'Simple translation from English to Nepali.',
    E'Translate the following English text to natural, fluent Nepali.\nPreserve the exact meaning and tone.\nReturn only the translation, no explanation.\n\nText: {{text}}',
    ARRAY['text']
)
ON CONFLICT (key) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    variables = EXCLUDED.variables,
    updated_at = NOW();

COMMENT ON TABLE ai_prompts IS 'Stores AI prompts that can be edited by admin/yantrik without code changes';
