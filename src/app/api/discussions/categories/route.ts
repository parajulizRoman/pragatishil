/* eslint-disable */
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { NextResponse } from "next/server";
import { canManageChannels } from "@/lib/permissions";

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("discussion_categories")
        .select("*")
        .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ categories: data });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;
        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

        // Admin check (using supabaseAdmin directly for simplicity, assuming middleware protects or we add check)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Proper Role Check
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (!canManageChannels(profile?.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data, error } = await supabaseAdmin
            .from("discussion_categories")
            .insert({ name })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ category: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    // Rename
    try {
        const body = await request.json();
        const { oldName, newName } = body;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (!['admin', 'admin_party', 'yantrik', 'board'].includes(profile?.role || '')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data, error } = await supabaseAdmin
            .from("discussion_categories")
            .update({ name: newName })
            .eq("name", oldName) // This triggers ON UPDATE CASCADE
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ category: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (!['admin', 'admin_party', 'yantrik', 'board'].includes(profile?.role || '')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from("discussion_categories")
            .delete()
            .eq("name", name); // This triggers ON DELETE RESTRICT

        // Error code 23503 is foreign_key_violation
        if (error) {
            if (error.code === '23503') {
                return NextResponse.json({ error: "Cannot delete: Category is in use." }, { status: 409 });
            }
            throw error;
        }
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
