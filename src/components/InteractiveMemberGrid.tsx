"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
// import { RealtimeMembersListener } from "@/app/members/RealtimeMembersListener"; // Disable for now as we switched tables
import { X, Shield, User, Crown } from "lucide-react";
import { Profile, UserRole } from "@/types";

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

// Helper to get role badge color/icon
const getRoleBadge = (role: UserRole) => {
    switch (role) {
        case 'admin_party': return { color: "bg-red-100 text-red-700 border-red-200", icon: <Crown size={12} fill="currentColor" /> };
        case 'yantrik': return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: <Shield size={12} /> };
        case 'central_committee': return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Shield size={12} fill="currentColor" /> };
        case 'team_member': return { color: "bg-green-100 text-green-700 border-green-200", icon: <User size={12} /> };
        case 'party_member': return { color: "bg-brand-red/10 text-brand-red border-brand-red/20", icon: <User size={12} /> };
        default: return null; // Supporter/Guest
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { innerWidth, innerHeight } = window; // Keep for ref if needed
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
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="text-center mb-16 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        <span className="text-brand-blue">Progressive</span> <span className="text-brand-red">Commune</span> <span className="block text-2xl md:text-4xl mt-2 font-bold text-brand-red">प्रगतिशील कम्युन</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto font-medium drop-shadow-md bg-white/80 backdrop-blur-sm py-2 px-6 rounded-full inline-block">
                        <span className="text-brand-blue">Meet The</span> <span className="text-brand-red">Progressives</span> <br />
                        <span className="text-base mt-1 block"><span className="text-brand-red">प्रगतिशील</span> <span className="text-brand-blue">व्यक्तित्व</span></span>
                    </p>
                </div>

                {members.length === 0 ? (
                    <div className="text-center text-slate-600 py-20 bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/40">
                        <p className="text-xl font-medium">No public members found yet.</p>
                        <p className="text-sm mt-2 opacity-80">Join us to be the first!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-16 md:gap-24 perspective-1000">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeDetail}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden border border-white/40 animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={closeDetail}
                            className="absolute top-3 right-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="h-32 bg-gradient-to-r from-brand-blue to-brand-red relative">
                            {/* Header Background */}
                        </div>

                        <div className="px-6 pb-6 -mt-12 text-center relative">
                            <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md bg-brand-navy overflow-hidden relative">
                                <Image
                                    src={selectedMember.avatar_url || PLACEHOLDERS[selectedMember.id.charCodeAt(0) % PLACEHOLDERS.length]}
                                    alt={selectedMember.full_name || "Member"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-slate-800">
                                {selectedMember.full_name || "Anonymous User"}
                            </h3>

                            {/* Role Label */}
                            {(() => {
                                const badge = getRoleBadge(selectedMember.role);
                                return badge ? (
                                    <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
                                        {badge.icon}
                                        {selectedMember.role.replace('_', ' ')}
                                    </div>
                                ) : (
                                    <span className="mt-1 block text-slate-400 text-xs uppercase tracking-widest">Supporter</span>
                                );
                            })()}

                            {selectedMember.bio && (
                                <p className="mt-4 text-sm text-slate-600 italic line-clamp-4">
                                    &quot;{selectedMember.bio}&quot;
                                </p>
                            )}

                            {selectedMember.location && (
                                <p className="mt-2 text-xs text-slate-500 font-medium">
                                    📍 {selectedMember.location}
                                </p>
                            )}

                        </div>
                    </div>
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
        if (role.startsWith('admin')) return 'border-amber-400';
        if (role === 'central_committee') return 'border-brand-blue';
        if (role === 'party_member') return 'border-brand-red';
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
                className={`member-bubble relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-all duration-300 group-hover:scale-110 shadow-lg bg-brand-navy ${getRingColor(member.role)}`}
            >
                <Image
                    src={photo}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover"
                />
            </div>

            {/* Tooltip Name */}
            <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/90 text-white text-sm px-3 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none backdrop-blur-sm border border-slate-700">
                {name}
            </div>
        </div>
    );
}

