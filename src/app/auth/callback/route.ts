import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/serverAdmin'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get the user data from the session we just established
            const { data: { user } = {} } = await supabase.auth.getUser();

            if (user) {
                try {
                    console.log(`[Auth Callback] Processing user: ${user.id}`);
                    const meta = user.user_metadata;
                    const fullName = meta.full_name || meta.name || 'Anonymous';
                    const avatarUrl = meta.avatar_url || meta.picture || null;

                    console.log(`[Auth Callback] Upserting profile for ${fullName}`);

                    const { error: upsertError } = await supabaseAdmin
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            full_name: fullName,
                            avatar_url: avatarUrl,
                            // Default to supporter if not checking specific emails
                            role: 'member',
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'id' });

                    if (upsertError) {
                        console.error('[Auth Callback] Profile upsert error:', upsertError);
                    } else {
                        console.log('[Auth Callback] Profile synced successfully');
                    }
                } catch (err) {
                    console.error('[Auth Callback] Unexpected error syncing profile:', err);
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
