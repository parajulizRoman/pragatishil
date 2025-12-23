"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { X, Shield, User, Crown } from "lucide-react";
import { Profile, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

// Helper to get role badge variant/icon (with disguising for admin/board)
const getRoleObj = (role: UserRole) => {
    // Disguise roles for public display
    let displayRole = role;
    if (role === 'admin') displayRole = 'yantrik';
    if (role === 'board') displayRole = 'central_committee';

    switch (displayRole) {
        case 'admin_party': return { variant: "red" as const, icon: <Crown size={12} className="mr-1" />, label: "Admin" };
        case 'yantrik': return { variant: "secondary" as const, icon: <Shield size={12} className="mr-1" />, label: "Yantrik" };
        case 'central_committee': return { variant: "default" as const, icon: <Shield size={12} className="mr-1" />, label: "Central Committee" };
        case 'team_member': return { variant: "outline" as const, icon: <User size={12} className="mr-1" />, label: "Team Member" };
        case 'party_member': return { variant: "party" as const, icon: <User size={12} className="mr-1" />, label: "Member" };
        default: return { variant: "outline" as const, icon: null, label: "Supporter" };
    }
};

export default function InteractiveMemberGrid({ members }: { members: Profile[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedMember, setSelectedMember] = useState<Profile | null>(null);

    // Handle mouse movement for background gradient
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;
            const xPct = (clientX / window.innerWidth) * 100;
            const yPct = (clientY / window.innerHeight) * 100;

            setMousePos({ x: xPct, y: yPct });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const closeDetail = () => setSelectedMember(null);

    return (
        <main
            ref={containerRef}
            className="members-bg min-h-screen relative overflow-hidden transition-colors duration-700"
            style={{
                "--mouse-x": `${mousePos.x}%`,
                "--mouse-y": `${mousePos.y}%`
            } as React.CSSProperties}
        >
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="text-center mb-16 relative z-10">
                    <Typography as="h1" variant="h1" className="mb-4 drop-shadow-md">
                        <span className="text-brand-blue">Progressive</span> <span className="text-brand-red">Commune</span>
                    </Typography>
                    <div className="inline-block bg-white/60 backdrop-blur-sm py-2 px-6 rounded-full shadow-sm border border-brand-navy/5">
                        <Typography variant="large" className="text-brand-navy">
                            Meet The Progressives
                        </Typography>
                        <Typography variant="small" className="text-brand-muted">
                            प्रगतिशील व्यक्तित्वहरु
                        </Typography>
                    </div>
                </div>

                {members.length === 0 ? (
                    <Card className="max-w-md mx-auto text-center p-10 bg-white/60 backdrop-blur-md">
                        <CardContent>
                            <Typography variant="h4" className="mb-2">No public members found yet.</Typography>
                            <Typography variant="muted">Join us to be the first!</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-20 perspective-1000">
                        {members.map((member, index) => (
                            <MagneticBubble
                                key={member.id}
                                member={member}
                                index={index}
                                onClick={() => setSelectedMember(member)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Overlay / Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={closeDetail}>
                    <Card
                        className="w-full max-w-[350px] overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border-none ring-1 ring-white/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={closeDetail}
                            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-20"
                        >
                            <X size={16} />
                        </button>

                        <div className="h-28 bg-brand-tricolor relative">
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>

                        <div className="px-6 pb-8 -mt-14 relative text-center">
                            <div className="w-28 h-28 mx-auto rounded-full border-[4px] border-white shadow-lg bg-brand-navy overflow-hidden relative mb-4">
                                <Image
                                    src={selectedMember.avatar_url || PLACEHOLDERS[selectedMember.id.charCodeAt(0) % PLACEHOLDERS.length]}
                                    alt={selectedMember.full_name || "Member"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <Typography variant="h3" className="mb-1">
                                {selectedMember.full_name || "Anonymous"}
                            </Typography>

                            {(() => {
                                const { variant, icon, label } = getRoleObj(selectedMember.role);
                                return (
                                    <Badge variant={variant} className="mb-4">
                                        {icon} {label}
                                    </Badge>
                                );
                            })()}

                            {selectedMember.bio && (
                                <div className="mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <p className="text-sm text-slate-600 italic leading-relaxed">
                                        &quot;{selectedMember.bio}&quot;
                                    </p>
                                </div>
                            )}

                            {selectedMember.location && (
                                <div className="flex items-center justify-center text-xs text-slate-500 font-medium bg-slate-100 py-1.5 px-3 rounded-full inline-block">
                                    📍 <span className="ml-1">{selectedMember.location}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}

function MagneticBubble({ member, onClick }: { member: Profile; index: number; onClick: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from cursor to bubble center
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Repel radius
            const radius = 200;

            if (distance < radius) {
                // Determine strength (closer = stronger repel)
                const strength = (1 - distance / radius) * 40; // Max 40px movement
                const angle = Math.atan2(distY, distX);

                // Move AWAY from cursor (repel) -> opposite direction
                const moveX = -Math.cos(angle) * strength;
                const moveY = -Math.sin(angle) * strength;

                setPosition({ x: moveX, y: moveY });
            } else {
                // Reset if far away
                setPosition({ x: 0, y: 0 });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Deterministic placeholder
    const placeholderIndex = member.id.charCodeAt(0) % PLACEHOLDERS.length;
    const photo = member.avatar_url || PLACEHOLDERS[placeholderIndex];
    const name = member.full_name || "Member";

    // Ring color based on role
    const getRingColor = (role: UserRole) => {
        if (role?.startsWith('admin')) return 'border-amber-400 ring-4 ring-amber-400/20';
        if (role === 'central_committee') return 'border-brand-blue ring-4 ring-brand-blue/20';
        if (role === 'party_member') return 'border-brand-red ring-4 ring-brand-red/20';
        return 'border-white/80';
    };

    return (
        <div
            ref={ref}
            onClick={onClick}
            className="group relative flex flex-col items-center transition-transform duration-300 ease-out will-change-transform cursor-pointer"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: Math.abs(position.x) > 1 || Math.abs(position.y) > 1 ? 50 : 1 // Bring to front when moving
            }}
        >
            <div
                className={cn(
                    "member-bubble relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-110 shadow-lg bg-brand-navy",
                    getRingColor(member.role)
                )}
            >
                <Image
                    src={photo}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 80px, 112px"
                    className="object-cover"
                />
            </div>

            {/* Tooltip Name */}
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-navy/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none backdrop-blur-sm">
                {name}
            </div>
        </div>
    );
}
