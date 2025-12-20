"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { revalidatePath } from "next/cache";
import { hasRole, UserRole } from "@/types";

export async function rotateVeto(currentHolderId: string, newHolderMemberId: string) {
    const supabase = await createClient();

    // 1. Authorization Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check if actor is an Admin (Party or Tech)
    const { data: actorProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!hasRole(actorProfile?.role as UserRole, 'admin_party')) {
        throw new Error("Insufficient Permissions to rotate veto.");
    }

    // 2. Transactional Rotation (Supabase RPC is best for transactions, but we'll try sequential update with minimal race risk or use an SQL function if strict)
    // For now, sequential:
    // a. Set old holder false
    // b. Set new holder true
    // c. Log audit

    await supabase
        .from("admin_council_members")
        .update({ is_veto_holder: false })
        .eq("is_veto_holder", true);

    // Don't throw on resetError if it was just "no rows found" (e.g. first veto assignment), but PostgreSQL update returns success even if 0 rows.

    const { error: setError } = await supabase
        .from("admin_council_members")
        .update({ is_veto_holder: true })
        .eq("id", newHolderMemberId);

    if (setError) {
        // Rollback? Complicated without RPC. Warning: This is a critical section.
        // Ideally we use a stored procedure `rotate_veto(new_member_id)`.
        console.error("Veto Rotation Failed", setError);
        throw new Error("Failed to assign new veto holder.");
    }

    // 3. Log Audit
    await supabaseAdmin.from("audit_logs").insert({
        actor_id: user.id,
        action_type: "ROTATE_VETO",
        target_type: "admin_council_member",
        target_id: newHolderMemberId,
        metadata: { previous_holder: currentHolderId }
    });

    revalidatePath("/admin/council");
    return { success: true };
}
