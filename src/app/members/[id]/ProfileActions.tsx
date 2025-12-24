"use client";

import React, { useState, useEffect } from "react";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { Shield, MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// Roles that can use messaging
const MESSAGING_ROLES = ['party_member', 'team_member', 'central_committee', 'board', 'admin_party', 'admin', 'yantrik'];

interface ProfileActionsProps {
    targetUserId: string;
    isOwner: boolean;
    canManageUsers: boolean;
    canManageCms: boolean;
}

/**
 * Client component for profile action buttons (Follow, Message, Edit, Admin)
 */
export default function ProfileActions({
    targetUserId,
    isOwner,
    canManageUsers,
    canManageCms
}: ProfileActionsProps) {
    const router = useRouter();
    const [viewerRole, setViewerRole] = useState<string | null>(null);
    const [viewerLoaded, setViewerLoaded] = useState(false);
    const [messaging, setMessaging] = useState(false);

    // Get viewer's role
    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        supabase.auth.getUser().then(async ({ data }) => {
            if (data.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();
                setViewerRole(profile?.role || null);
            }
            setViewerLoaded(true);
        });
    }, []);

    // Check messaging eligibility - only sender needs party_member+ role
    // All members can RECEIVE messages, only party_member+ can SEND
    const viewerCanMessage = viewerRole && MESSAGING_ROLES.includes(viewerRole);

    const handleMessage = async () => {
        setMessaging(true);
        try {
            const res = await fetch("/api/messages/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: targetUserId })
            });
            if (res.ok) {
                const data = await res.json();
                router.push(`/messages/${data.conversationId}`);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to start conversation");
            }
        } catch (e) {
            console.error("Start conversation error:", e);
            alert("Failed to start conversation");
        } finally {
            setMessaging(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {/* Follow Button - only show if not owner */}
            {!isOwner && (
                <FollowButton userId={targetUserId} showCounts />
            )}

            {/* Message Button - show for party_member+ viewers (all members can receive) */}
            {!isOwner && viewerLoaded && viewerCanMessage && (
                <button
                    onClick={handleMessage}
                    disabled={messaging}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border shadow-sm bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                    title="Send a message"
                >
                    {messaging ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <MessageSquare size={16} />
                    )}
                    Message
                </button>
            )}

            {/* Admin Button */}
            {(canManageUsers || canManageCms) && (
                <Link
                    href="/admin"
                    className="px-4 py-2 bg-brand-navy text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Shield size={16} />
                    CMS Admin
                </Link>
            )}

            {/* Edit Profile Button */}
            {isOwner && (
                <Link
                    href="/settings/profile"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                >
                    Edit Profile
                </Link>
            )}
        </div>
    );
}

