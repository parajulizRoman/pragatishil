"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PenLine } from "lucide-react";

// Only admin, yantrik, admin_party can contribute news/press
const CONTRIBUTOR_ROLES = ["admin_party", "yantrik", "admin"];

export default function ContributeButton() {
    const [canContribute, setCanContribute] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile && CONTRIBUTOR_ROLES.includes(profile.role)) {
                setCanContribute(true);
            }
            setLoading(false);
        };

        checkAccess();
    }, []);

    if (loading || !canContribute) return null;

    return (
        <Link
            href="/write"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/30 hover:scale-105"
        >
            <PenLine className="w-4 h-4" />
            Share Your Story
        </Link>
    );
}
