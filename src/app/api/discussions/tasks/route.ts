import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// GET /api/discussions/tasks?channel_id=xxx
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get("channel_id");

        if (!channelId) {
            return NextResponse.json({ error: "channel_id required" }, { status: 400 });
        }

        const { data: tasks, error } = await supabase
            .from("channel_tasks")
            .select(`
                *,
                assigned_user:profiles!channel_tasks_assigned_to_fkey(id, full_name, avatar_url),
                created_by_user:profiles!channel_tasks_created_by_fkey(id, full_name)
            `)
            .eq("channel_id", channelId)
            .order("position", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ tasks: tasks || [] });
    } catch (error) {
        console.error("GET tasks error:", error);
        return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
    }
}

// POST /api/discussions/tasks
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { channel_id, title, description, status, priority, assigned_to, due_date } = body;

        if (!channel_id || !title) {
            return NextResponse.json({ error: "channel_id and title required" }, { status: 400 });
        }

        // Get max position for this status
        const { data: maxPos } = await supabase
            .from("channel_tasks")
            .select("position")
            .eq("channel_id", channel_id)
            .eq("status", status || "todo")
            .order("position", { ascending: false })
            .limit(1)
            .single();

        const position = (maxPos?.position || 0) + 1;

        const { data: task, error } = await supabase
            .from("channel_tasks")
            .insert({
                channel_id,
                title,
                description: description || null,
                status: status || "todo",
                priority: priority || "medium",
                assigned_to: assigned_to || null,
                due_date: due_date || null,
                position,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ task });
    } catch (error) {
        console.error("POST task error:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// PUT /api/discussions/tasks
export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Task id required" }, { status: 400 });
        }

        const { data: task, error } = await supabase
            .from("channel_tasks")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ task });
    } catch (error) {
        console.error("PUT task error:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

// DELETE /api/discussions/tasks?id=xxx
export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Task id required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("channel_tasks")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE task error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
