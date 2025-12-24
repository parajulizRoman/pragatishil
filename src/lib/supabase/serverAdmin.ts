import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Note: standard client is in @/lib/supabase/server.ts using SSR package
// This file uses the plain JS SDK for Admin/Service Role operations
// because we don't need cookie handling here, we need raw DB access.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazy initialization - create client on first access
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        }
        _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }
    return _supabaseAdmin;
}

/**
 * Server-only Supabase client with Service Role privileges.
 * WARNING: Do not expose this client to the browser.
 * It bypasses Row Level Security (RLS).
 * 
 * Uses a getter to allow module loading even when env vars are missing
 * (error only thrown when actually accessed)
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        return getSupabaseAdmin()[prop as keyof SupabaseClient];
    }
});
