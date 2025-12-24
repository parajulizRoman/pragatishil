"use client";

import React from "react";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { Shield } from "lucide-react";

interface ProfileActionsProps {
    targetUserId: string;
    isOwner: boolean;
    canManageUsers: boolean;
    canManageCms: boolean;
}

/**
 * Client component for profile action buttons (Follow, Edit, Admin)
 */
export default function ProfileActions({
    targetUserId,
    isOwner,
    canManageUsers,
    canManageCms
}: ProfileActionsProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {/* Follow Button - only show if not owner */}
            {!isOwner && (
                <FollowButton userId={targetUserId} showCounts />
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
