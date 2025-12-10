"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { RealtimeMembersListener } from "@/app/members/RealtimeMembersListener";

// ... imports
import { X } from "lucide-react";

interface Member {
    id: string;
    full_name_ne: string | null;
    full_name_en: string | null;
    photo_url: string | null;
    gender_code?: string | null;
    gender_label_ne?: string | null;
    gender_label_en?: string | null;
    inclusion_groups?: string[] | null;
    inclusion_groups_ne?: Record<string, string> | null;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

export default function InteractiveMemberGrid({ members }: { members: Member[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // Handle mouse movement for background gradient
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPct = (clientX / innerWidth) * 100;
            const yPct = (clientY / innerHeight) * 100;

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
            <RealtimeMembersListener />

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
                                    src={selectedMember.photo_url && selectedMember.photo_url !== "placeholder-no-photo" ? selectedMember.photo_url : PLACEHOLDERS[selectedMember.id.charCodeAt(0) % PLACEHOLDERS.length]}
                                    alt={selectedMember.full_name_en || "Member"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-slate-800">
                                {selectedMember.full_name_ne}
                            </h3>
                            {selectedMember.full_name_en && (
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    {selectedMember.full_name_en}
                                </p>
                            )}

                            {/* Gender Pill */}
                            {selectedMember.gender_label_ne && (
                                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-navy/10 text-brand-navy border border-brand-navy/20">
                                    {selectedMember.gender_label_ne}
                                    {selectedMember.gender_label_en !== selectedMember.gender_label_ne && (
                                        <span className="opacity-75 ml-1 font-normal">({selectedMember.gender_label_en})</span>
                                    )}
                                </div>
                            )}

                            {/* Inclusion Badges */}
                            {selectedMember.inclusion_groups && selectedMember.inclusion_groups.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Inclusive Identity</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {selectedMember.inclusion_groups.map(code => (
                                            <span
                                                key={code}
                                                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                            >
                                                {selectedMember.inclusion_groups_ne?.[code] || code}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function MagneticBubble({ member, onClick }: { member: Member; index: number; onClick: () => void }) {
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
    const hasPhoto = member.photo_url && member.photo_url !== "placeholder-no-photo";
    const photo = hasPhoto ? member.photo_url! : PLACEHOLDERS[placeholderIndex];
    const name = member.full_name_ne || member.full_name_en || "Anonymous";

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
                className="member-bubble relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/80 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400 bg-brand-navy shadow-lg"
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

