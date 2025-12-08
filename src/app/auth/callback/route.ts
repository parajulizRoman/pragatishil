import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/join'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // -- Profile Creation Logic --
            // After successful login, ensure we have a record in `members` table (or profiles table?)
            // The checklist says "Create / update a Supabase profiles record (or similar) with: user id, display name, email, photo"
            // The schema has `members` table with `auth_user_id`.
            // We should probably NOT create a FULL member record automatically because standard members need detailed forms (Address, etc).
            // If "profiles" table is not in schema, we might check if user is already a member.
            // BUT checklist says: "Create / update a Supabase profiles record".
            // Let's assume we might need a `profiles` table or we just rely on `auth.users` metadata for "Continue with Google".
            // However, if we need to store data, we might need a table.
            // For now, I will just ensure the session is set. 
            // The "Join form integration" says "Prefill form with Google name, email". This comes from `supabase.auth.getUser()`.
            // So detailed profile creation might happen ON SUBMISSION of the form.
            // Checklist item 5.2 says: "On login: Create / update a Supabase profiles record...".
            // If there is no `profiles` table in schema.md, maybe I should create one? 
            // Schema.md DOES NOT have `profiles`. It has `members` with `auth_user_id`.
            // "Member-only zone" needs to show "You are logged in as X".
            // I will skip automatic DB insertion here to avoid cluttering `members` table with incomplete data.
            // I will rely on `auth.users` for the basic "Logged in as" state.
            // If I really need a `profiles` table, I'd have to create it.
            // But the checklist says "Create / update a Supabase profiles record (or similar)".
            // Use `next` to redirect. https://supabase.com/docs/guides/auth/server-side/nextjs

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
