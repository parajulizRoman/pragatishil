-- Drop view first to allow column changes
DROP VIEW IF EXISTS thread_overviews;

-- Recreate view with Author Name included
CREATE OR REPLACE VIEW thread_overviews AS
SELECT 
    t.id,
    t.channel_id,
    t.title,
    t.created_at,
    t.created_by,
    t.is_anonymous,
    t.buried_at,
    t.summary,
    t.meta,
    t.updated_at,
    -- Join Profile Name directly
    p.full_name as author_name,
    p.avatar_url as author_avatar,
    
    -- Count of all posts
    (SELECT count(*) FROM discussion_posts p WHERE p.thread_id = t.id) as total_posts,
    -- First Post ID
    (SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_post_id,
     -- First Post Content (Truncated if needed, but here full content for frontend to truncate)
    (SELECT content FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_post_content,
    -- Upvotes of the FIRST post
    (
        SELECT count(*)
        FROM discussion_votes v
        WHERE v.post_id = (
            SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1
        ) AND v.vote_type = 1
    ) as upvotes,
    -- Downvotes of the FIRST post
    (
        SELECT count(*)
        FROM discussion_votes v
        WHERE v.post_id = (
            SELECT id FROM discussion_posts p2 WHERE p2.thread_id = t.id ORDER BY created_at ASC LIMIT 1
        ) AND v.vote_type = -1
    ) as downvotes
FROM discussion_threads t
LEFT JOIN profiles p ON t.created_by = p.id
WHERE t.deleted_at IS NULL;

-- Grant permissions re-apply
GRANT SELECT ON thread_overviews TO authenticated;
GRANT SELECT ON thread_overviews TO anon;
