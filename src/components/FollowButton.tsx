"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
    userId: string;
    className?: string;
    size?: "default" | "sm" | "lg";
    showCounts?: boolean;
}

export default function FollowButton({ userId, className, size = "default", showCounts = false }: FollowButtonProps) {
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // Fetch initial follow status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/users/follow?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setFollowing(data.following);
                    setFollowerCount(data.followerCount);
                    setFollowingCount(data.followingCount);
                }
            } catch (e) {
                console.error("Failed to fetch follow status:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [userId]);

    const handleToggleFollow = async () => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/users/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    action: following ? "unfollow" : "follow"
                })
            });

            if (res.ok) {
                const data = await res.json();
                setFollowing(data.following);
                // Update counts
                if (data.following) {
                    setFollowerCount(prev => prev + 1);
                } else {
                    setFollowerCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (e) {
            console.error("Follow action failed:", e);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Button variant="outline" size={size} disabled className={className}>
                <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Button
                variant={following ? "outline" : "default"}
                size={size}
                onClick={handleToggleFollow}
                disabled={actionLoading}
                className={cn(
                    "transition-all",
                    following
                        ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : "bg-brand-blue hover:bg-blue-600 text-white"
                )}
            >
                {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : following ? (
                    <UserMinus className="w-4 h-4 mr-2" />
                ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                )}
                {following ? "Following" : "Follow"}
            </Button>

            {showCounts && (
                <div className="flex gap-4 text-sm text-slate-600">
                    <span>
                        <strong className="text-slate-800">{followerCount}</strong> followers
                    </span>
                    <span>
                        <strong className="text-slate-800">{followingCount}</strong> following
                    </span>
                </div>
            )}
        </div>
    );
}
