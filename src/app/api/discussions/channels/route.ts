import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { DiscussionChannel } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");

        const supabase = await createClient();

        let query = supabase
            .from("discussion_channels")
            .select("*");

        if (id) {
            query = query.eq("id", id);
        }
        if (slug) {
            query = query.eq("slug", slug);
        }

        const { data: channels, error } = await query.order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching channels:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ channels: channels as DiscussionChannel[] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Body
        const body = await request.json();
        const {
            slug,
            name,
            name_ne,
            description,
            description_en,
            description_ne,
            guidelines_en,
            guidelines_ne,
            visibility,
            allow_anonymous_posts,
            min_role_to_post,
            min_role_to_create_threads
        } = body;

        // 3. Validation
        if (!slug || !name || !visibility) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 4. Insert (RLS will enforce 'High command create' policy)
        const { data, error } = await supabase
            .from("discussion_channels")
            .insert({
                slug,
                name,
                name_ne,
                description, // Legacy field or English fallback
                description_en,
                description_ne,
                guidelines_en,
                guidelines_ne,
                visibility,
                allow_anonymous_posts: allow_anonymous_posts ?? false,
                min_role_to_post: min_role_to_post ?? 'member',
                min_role_to_create_threads: min_role_to_create_threads ?? 'member',
                created_by: user.id
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating channel:", error);
            // Handle RLS violation explicitly if possible, or generic error
            if (error.code === '42501') { // RLS violation
                return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
            }
            if (error.code === '23505') { // Unique violation (slug)
                return NextResponse.json({ error: "Channel slug already exists" }, { status: 409 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ channel: data as DiscussionChannel });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
