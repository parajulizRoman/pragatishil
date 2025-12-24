"use server";

import { createClient } from "@/lib/supabase/server";
import { OrgIssue, OrgCommitteeMember, IssueStatus, IssuePriority, ESCALATION_PATH, OrgLevelKey } from "@/types/org";
import { revalidatePath } from "next/cache";

/**
 * Get committees the current user is a member of
 */
export async function getUserCommittees(): Promise<OrgCommitteeMember[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("org_committee_members")
        .select(`
            id,
            committee_id,
            profile_id,
            is_information_officer,
            position_title_en,
            position_title_ne,
            created_at,
            committee:org_committees(id, level_key, name, name_ne, area_code)
        `)
        .eq("profile_id", user.id);

    if (error) {
        console.error("Error fetching user committees:", error);
        return [];
    }

    return data as unknown as OrgCommitteeMember[];
}

/**
 * List issues for a specific committee
 */
export async function listIssuesForCommittee(
    committeeId: string,
    statusFilter?: IssueStatus
): Promise<OrgIssue[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
        .from("org_issues")
        .select(`
            id,
            created_by,
            origin_committee_id,
            current_committee_id,
            subject,
            body,
            status,
            priority,
            parent_issue_id,
            resolved_by,
            resolved_at,
            escalated_at,
            created_at,
            updated_at,
            creator:profiles!org_issues_created_by_fkey(id, full_name, avatar_url),
            current_committee:org_committees!org_issues_current_committee_id_fkey(id, level_key, name, name_ne)
        `)
        .eq("current_committee_id", committeeId)
        .order("created_at", { ascending: false });

    if (statusFilter) {
        query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching issues:", error);
        return [];
    }

    return data as unknown as OrgIssue[];
}

/**
 * Create a new issue
 */
export async function createIssue(input: {
    committeeId: string;
    subject: string;
    body?: string;
    priority?: IssuePriority;
}): Promise<{ success: boolean; error?: string; issue?: OrgIssue }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
        .from("org_issues")
        .insert({
            created_by: user.id,
            origin_committee_id: input.committeeId,
            current_committee_id: input.committeeId,
            subject: input.subject,
            body: input.body,
            priority: input.priority || 'medium'
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating issue:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/committee/inbox");
    return { success: true, issue: data };
}

/**
 * Update issue status
 */
export async function updateIssueStatus(
    issueId: string,
    status: IssueStatus
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const updateData: Record<string, unknown> = { status };

    if (status === 'resolved') {
        updateData.resolved_by = user.id;
        updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from("org_issues")
        .update(updateData)
        .eq("id", issueId);

    if (error) {
        console.error("Error updating issue:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/committee/inbox");
    return { success: true };
}

/**
 * Escalate issue to next committee level
 */
export async function escalateIssue(
    issueId: string,
    reason?: string
): Promise<{ success: boolean; error?: string; newCommitteeId?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Get current issue
    const { data: issue } = await supabase
        .from("org_issues")
        .select(`
            id,
            current_committee_id,
            current_committee:org_committees!org_issues_current_committee_id_fkey(id, level_key)
        `)
        .eq("id", issueId)
        .single();

    if (!issue) return { success: false, error: "Issue not found" };

    // @ts-expect-error - joined data typing
    const currentLevelKey = issue.current_committee?.level_key as OrgLevelKey;
    const nextLevelKey = ESCALATION_PATH[currentLevelKey];

    if (!nextLevelKey) {
        return { success: false, error: "Cannot escalate further - already at top level" };
    }

    // Find a committee at the next level
    // In a real system, you'd have logic to pick the right parent committee
    const { data: nextCommittee } = await supabase
        .from("org_committees")
        .select("id")
        .eq("level_key", nextLevelKey)
        .limit(1)
        .single();

    if (!nextCommittee) {
        return { success: false, error: `No ${nextLevelKey} committee found` };
    }

    // Update the issue
    const { error } = await supabase
        .from("org_issues")
        .update({
            current_committee_id: nextCommittee.id,
            status: 'escalated',
            escalated_at: new Date().toISOString()
        })
        .eq("id", issueId);

    if (error) {
        console.error("Error escalating issue:", error);
        return { success: false, error: error.message };
    }

    // Add escalation comment if reason provided
    if (reason) {
        await supabase
            .from("org_issue_comments")
            .insert({
                issue_id: issueId,
                author_id: user.id,
                content: `Escalated to ${nextLevelKey}: ${reason}`,
                is_internal: true
            });
    }

    revalidatePath("/committee/inbox");
    return { success: true, newCommitteeId: nextCommittee.id };
}

/**
 * Add comment to issue
 */
export async function addIssueComment(
    issueId: string,
    content: string,
    isInternal: boolean = false
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("org_issue_comments")
        .insert({
            issue_id: issueId,
            author_id: user.id,
            content,
            is_internal: isInternal
        });

    if (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/committee/inbox");
    return { success: true };
}

/**
 * Get comments for an issue
 */
export async function getIssueComments(issueId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("org_issue_comments")
        .select(`
            id,
            issue_id,
            author_id,
            content,
            is_internal,
            created_at,
            author:profiles!org_issue_comments_author_id_fkey(id, full_name, avatar_url)
        `)
        .eq("issue_id", issueId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    return data;
}
