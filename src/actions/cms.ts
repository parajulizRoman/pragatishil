"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { revalidatePath } from "next/cache";
import { canManageCms } from "@/lib/cms-utils";

// --- Helpers ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getActor(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!canManageCms(profile?.role)) {
        throw new Error("Forbidden: Insufficient permissions to manage CMS");
    }

    return { ...user, role: profile?.role };
}

// --- Site Settings ---

import {
    HeroSettingsSchema,
    VisionSettingsSchema,
    AboutSettingsSchema,
    GlobalSettingsSchema
} from "@/schemas/cms";

// --- Site Settings ---

export async function updateSiteSettings(key: string, content: unknown) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    // STICT GUARD: Site Settings are restricted to high-level admins (no central_committee)
    // Central Committee can only manage News and Media.
    const canEditSiteSettings = ['admin', 'admin_party', 'yantrik', 'board'].includes(user.role);

    if (!canEditSiteSettings) {
        throw new Error("Forbidden: Central Committee cannot edit site settings.");
    }

    // Validate Content based on Key
    let validatedContent = content;
    try {
        if (key === 'hero') validatedContent = HeroSettingsSchema.parse(content);
        else if (key === 'vision') validatedContent = VisionSettingsSchema.parse(content);
        else if (key === 'about') validatedContent = AboutSettingsSchema.parse(content);
        else if (key === 'global') validatedContent = GlobalSettingsSchema.parse(content);
        // Add more keys as strict schemas are defined
    } catch (e: unknown) {
        // Return structured Zod error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        console.error("Zod Validation Failed:", err.formErrors || err.errors);
        return { success: false, error: err.errors || err.message, type: 'validation' };
    }

    // Fetch old data
    const { data: oldData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();

    const { data: newData, error } = await supabase
        .from('site_settings')
        .upsert({
            key,
            content: validatedContent,
            updated_at: new Date().toISOString(),
            updated_by: user.id
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Audit Log
    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'UPDATE_SITE_CONTENT',
        target_type: 'site_settings',
        target_id: key,
        old_data: oldData,
        new_data: newData,
        metadata: { source: 'cms_admin' }
    });

    revalidatePath("/", "layout");
    return { success: true };
}

// --- News Items ---

import { slugify, generateUniqueSlug } from "@/lib/slugify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertNewsItem(item: any) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    // Determine content type (default to 'official' for backwards compatibility)
    const contentType = item.content_type || 'official';
    const isOfficial = contentType === 'official';
    const isArticle = contentType === 'article';

    // Permission validation
    const officialRoles = ['admin', 'yantrik', 'admin_party'];
    const articleRoles = ['party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'yantrik', 'admin'];

    if (isOfficial && !officialRoles.includes(user.role)) {
        throw new Error("Forbidden: Only admin, yantrik, or admin_party can create official news.");
    }

    if (isArticle && !articleRoles.includes(user.role)) {
        throw new Error("Forbidden: You do not have permission to create articles.");
    }

    // Fetch old data for edit permission checks
    let oldData = null;
    if (item.id) {
        const { data } = await supabase.from('news_items').select('*').eq('id', item.id).single();
        oldData = data;

        // If editing an article, check ownership or admin privilege
        if (oldData && oldData.content_type === 'article') {
            const isOwner = oldData.author_id === user.id;
            const canEditOthers = ['admin', 'yantrik'].includes(user.role);
            if (!isOwner && !canEditOthers) {
                throw new Error("Forbidden: You can only edit your own articles.");
            }
        }
    }

    // Content type rules
    let author_id = null;
    let visibility = 'public';

    if (isArticle) {
        // Articles: author_id is always the current user (forced)
        author_id = user.id;
        // Visibility can be set by user
        visibility = item.visibility || 'party';
    } else {
        // Official: no author, always public
        author_id = null;
        visibility = 'public';
    }

    // Publishing restrictions: Only certain roles can publish directly
    const canPublish = ['admin', 'yantrik', 'admin_party', 'board'].includes(user.role);
    let finalStatus = item.status;

    if (item.status === 'published' && !canPublish) {
        // Force to draft - CC and party_member cannot publish directly
        finalStatus = 'draft';
        console.log(`[CMS] User ${user.id} (${user.role}) cannot publish directly. Forced to draft.`);
    }

    // Lifecycle: Update published_at if moving to published
    if (finalStatus === 'published' && !item.published_at) {
        item.published_at = new Date().toISOString();
    }

    // Generate slug for new items or if title changed
    let slug = item.slug;
    if (!slug || (oldData && oldData.title !== item.title)) {
        const baseSlug = slugify(item.title);
        slug = await generateUniqueSlug(baseSlug, async (testSlug) => {
            const { data } = await supabase
                .from('news_items')
                .select('id')
                .eq('slug', testSlug)
                .neq('id', item.id || 0)
                .single();
            return !!data;
        });
    }

    const payload = {
        title: item.title,
        title_ne: item.title_ne ?? null,
        summary_en: item.summary_en ?? null,
        summary_ne: item.summary_ne ?? null,
        source: item.source,
        date: item.date,
        date_bs: item.date_bs ?? null,
        type: item.type,
        link: item.link ?? null,
        image_url: item.image_url ?? null,
        status: finalStatus,
        author_name: item.author_name ?? null,
        body_en: item.body_en ?? null,
        body_ne: item.body_ne ?? null,
        references: item.references ?? [],
        attachments: item.attachments ?? [],
        slug: slug,
        content_type: contentType,
        author_id: author_id,
        visibility: visibility,
        updated_by: user.id,
        pending_reviewer_id: item.pending_reviewer_id ?? null
    };

    const { data: newData, error } = await supabase
        .from('news_items')
        .upsert(item.id ? { ...payload, id: item.id } : payload)
        .select()
        .single();

    if (error) throw new Error(error.message);

    // --- NOTIFICATION FOR REVIEW REQUESTS ---
    // If status is 'submitted', notify the assigned reviewer OR all admins
    if (finalStatus === 'submitted') {
        try {
            // Get author's name for the notification
            const { data: authorProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            const authorName = authorProfile?.full_name || 'A member';
            const savedReviewerId = newData.pending_reviewer_id;

            // If a specific reviewer was assigned, notify only them
            if (savedReviewerId) {
                const { error: notifError } = await supabaseAdmin.from('notifications').insert({
                    user_id: savedReviewerId,
                    type: 'review_request',
                    title: 'New Blog Post for Review',
                    body: `${authorName} submitted "${item.title.slice(0, 50)}${item.title.length > 50 ? '...' : ''}" for your review`,
                    link: `/blogs/${newData.slug}`,
                    actor_id: user.id
                });

                if (notifError) {
                    console.error("[CMS] Failed to create review notification:", notifError);
                } else {
                    console.log(`[CMS] Review notification sent to ${savedReviewerId}`);
                }
            } else {
                // No specific reviewer assigned - notify all admin-level users
                const { data: admins } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .in('role', ['admin', 'yantrik', 'admin_party', 'board']);

                if (admins && admins.length > 0) {
                    const notifications = admins.map(admin => ({
                        user_id: admin.id,
                        type: 'review_request',
                        title: 'New Blog Post Submitted',
                        body: `${authorName} submitted "${item.title.slice(0, 50)}${item.title.length > 50 ? '...' : ''}" for review`,
                        link: `/blogs/${newData.slug}`,
                        actor_id: user.id
                    }));

                    const { error: notifError } = await supabaseAdmin.from('notifications').insert(notifications);
                    if (notifError) {
                        console.error("[CMS] Failed to notify admins:", notifError);
                    } else {
                        console.log(`[CMS] Review notifications sent to ${admins.length} admins`);
                    }
                }
            }
        } catch (notifErr) {
            console.error("[CMS] Notification creation exception:", notifErr);
            // Non-blocking: don't fail the save if notification fails
        }
    }

    // Audit Log
    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'MANAGE_NEWS',
        target_type: 'news_items',
        target_id: String(newData.id),
        old_data: oldData,
        new_data: newData,
        metadata: { source: 'cms_admin' }
    });

    // --- AUTO-THREAD CREATION LOGIC ---
    // If published AND tread_id is missing, create a thread in 'news-comments' channel.
    if (newData.status === 'published' && !newData.thread_id) {
        try {
            // 1. Fetch 'news-comments' channel ID
            const { data: channelData } = await supabaseAdmin
                .from('discussion_channels')
                .select('id')
                .eq('slug', 'news-comments')
                .single();

            if (channelData) {
                // 2. Create Thread (System Action, bypassing user RLS if needed, but keeping creator as user)
                const { data: threadData, error: threadError } = await supabaseAdmin
                    .from('discussion_threads')
                    .insert({
                        channel_id: channelData.id,
                        title: newData.title,
                        created_by: user.id, // The admin publishing it owns the thread
                        meta: { news_item_id: newData.id },
                        is_anonymous: false
                    })
                    .select()
                    .single();

                if (!threadError && threadData) {
                    // 3. Link Thread back to News Item
                    await supabaseAdmin
                        .from('news_items')
                        .update({ thread_id: threadData.id })
                        .eq('id', newData.id);

                    console.log(`Auto-created thread ${threadData.id} for news ${newData.id}`);
                } else {
                    console.error("Failed to create auto-thread:", threadError);
                }
            } else {
                console.warn("Channel 'news-comments' not found. Skipping thread creation.");
            }
        } catch (err) {
            console.error("Auto-thread creation exception:", err);
            // Non-blocking: don't fail the whole save if thread creation fails
        }
    }
    // ----------------------------------

    revalidatePath("/news");
    revalidatePath("/");
    return { success: true, id: newData.id, slug: newData.slug };
}

export async function deleteNewsItem(id: number, reason?: string) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    const { data: oldData } = await supabase.from('news_items').select('*').eq('id', id).single();
    const { error } = await supabase.from('news_items').delete().eq('id', id);

    if (error) throw new Error(error.message);

    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'MANAGE_NEWS',
        target_type: 'news_items',
        target_id: String(id),
        old_data: oldData,
        new_data: null,
        reason: reason,
        metadata: { source: 'cms_admin', action: 'delete' }
    });

    revalidatePath("/news");
    revalidatePath("/");
    return { success: true };
}

// --- Media Gallery ---

import { parseVideoUrl } from "@/lib/videoEmbed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertMediaItem(item: any) {
    console.log("[CMS:upsertMediaItem] Starting upsert with item:", JSON.stringify(item, null, 2));

    const supabase = await createClient();
    const user = await getActor(supabase);
    console.log("[CMS:upsertMediaItem] Actor/User ID:", user.id, "Role:", user.role);

    // Normalize Video URL using multi-platform parser
    if (item.media_type === 'video' || item.type === 'video') {
        console.log("[CMS:upsertMediaItem] Processing video URL:", item.url);
        const videoInfo = parseVideoUrl(item.url || '');
        console.log("[CMS:upsertMediaItem] Parsed video info:", JSON.stringify(videoInfo, null, 2));

        if (videoInfo.canEmbed && videoInfo.embedUrl) {
            item.embed_url = videoInfo.embedUrl;
            console.log("[CMS:upsertMediaItem] Set embed_url to:", item.embed_url);
        } else {
            // Keep original URL if not embeddable
            item.embed_url = item.url;
            console.log("[CMS:upsertMediaItem] Video not embeddable, using original URL as embed_url");
        }
    }

    let oldData = null;
    if (item.id) {
        const { data } = await supabase.from('media_gallery').select('*').eq('id', item.id).single();
        oldData = data;
        console.log("[CMS:upsertMediaItem] Existing item found for update:", oldData?.id);
    }

    // Build the payload to insert/update
    // Note: DB has both 'type' (legacy, NOT NULL, only 'image'|'video') and 'media_type' (new, allows 'document')
    // Map 'document' to 'image' for legacy column to satisfy CHECK constraint
    const legacyType = (item.media_type === 'video' || item.type === 'video') ? 'video' : 'image';
    const payload = {
        ...item,
        type: legacyType,  // Legacy column only accepts 'image' or 'video'
        updated_by: user.id
    };
    console.log("[CMS:upsertMediaItem] Upserting payload:", JSON.stringify(payload, null, 2));

    const { data: newData, error } = await supabase
        .from('media_gallery')
        .upsert(payload)
        .select()
        .single();

    if (error) {
        console.error("[CMS:upsertMediaItem] SUPABASE ERROR:", error.message, error.details, error.hint);
        throw new Error(error.message);
    }

    console.log("[CMS:upsertMediaItem] SUCCESS! Inserted/Updated item:", JSON.stringify(newData, null, 2));

    // Audit Log
    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'MANAGE_MEDIA',
        target_type: 'media_gallery',
        target_id: String(newData.id),
        old_data: oldData,
        new_data: newData,
        metadata: { source: 'cms_admin' }
    });

    revalidatePath("/media");
    revalidatePath("/");
    return { success: true, item: newData };
}

export async function deleteMediaItem(id: number, reason?: string) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    // Only admin and admin_party can delete media
    const canDelete = ['admin', 'admin_party'].includes(user.role);
    if (!canDelete) {
        throw new Error("Forbidden: Only admins can delete media items.");
    }

    const { data: oldData } = await supabase.from('media_gallery').select('*').eq('id', id).single();
    const { error } = await supabase.from('media_gallery').delete().eq('id', id);

    if (error) throw new Error(error.message);

    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'MANAGE_MEDIA',
        target_type: 'media_gallery',
        target_id: String(id),
        old_data: oldData,
        new_data: null,
        reason: reason,
        metadata: { source: 'cms_admin', action: 'delete' }
    });

    revalidatePath("/media");
    return { success: true };
}

// --- Album Actions ---

export async function getAlbums() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('media_albums')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAlbum(album: any) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    const { data, error } = await supabase
        .from('media_albums')
        .insert({
            name: album.name,
            name_ne: album.name_ne || null,
            description: album.description || null,
            cover_image_url: album.cover_image_url || null,
            created_by: user.id
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'CREATE_ALBUM',
        target_type: 'media_albums',
        target_id: String(data.id),
        new_data: data,
        metadata: { source: 'cms_admin' }
    });

    revalidatePath("/media");
    return { success: true, album: data };
}

export async function mergeAlbums(sourceAlbumId: number, targetAlbumId: number, reason?: string) {
    const supabase = await createClient();
    const user = await getActor(supabase);

    // Only admin and yantrik can merge albums
    const canMerge = ['admin', 'yantrik'].includes(user.role);
    if (!canMerge) {
        throw new Error("Forbidden: Only admins can merge albums.");
    }

    // Move all media from source to target album
    const { error: updateError } = await supabase
        .from('media_gallery')
        .update({ album_id: targetAlbumId })
        .eq('album_id', sourceAlbumId);

    if (updateError) throw new Error(updateError.message);

    // Delete the source album
    const { data: oldAlbum } = await supabase.from('media_albums').select('*').eq('id', sourceAlbumId).single();
    const { error: deleteError } = await supabase.from('media_albums').delete().eq('id', sourceAlbumId);

    if (deleteError) throw new Error(deleteError.message);

    await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'MERGE_ALBUMS',
        target_type: 'media_albums',
        target_id: String(sourceAlbumId),
        old_data: oldAlbum,
        new_data: { merged_into: targetAlbumId },
        reason: reason,
        metadata: { source: 'cms_admin', action: 'merge' }
    });

    revalidatePath("/media");
    return { success: true };
}
