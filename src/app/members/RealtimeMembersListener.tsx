"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export function RealtimeMembersListener() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const channel = supabase
            .channel('realtime-members')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'members' },
                (payload) => {
                    // Only refresh if the new member is approved
                    if (payload.new.status === 'approved' && payload.new.confidentiality === 'public_ok') {
                        router.refresh();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [router, supabase]);

    return null;
}
