'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function restorePost(postId: string) {
    const supabase = await createClient();

    // 1. Check Auth & Role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    // Check if user is admin or central committee
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['admin_party', 'yantrik', 'central_committee', 'chief_board'].includes(profile.role)) {
        throw new Error('Insufficient permissions to restore posts');
    }

    // 2. Perform Restore
    const { error } = await supabase
        .from('discussion_posts')
        .update({ buried_at: null })
        .eq('id', postId);

    if (error) {
        console.error('Error restoring post:', error);
        throw new Error('Failed to restore post');
    }

    // 3. Log Audit
    await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action_type: 'RESTORE_POST',
        target_type: 'post',
        target_id: postId,
        ip_address: 'unknown',
        user_agent: 'server-action'
    });

    revalidatePath('/admin/graveyard');
    revalidatePath(`/commune`); // Ideally refresh the thread too if we knew it
}
