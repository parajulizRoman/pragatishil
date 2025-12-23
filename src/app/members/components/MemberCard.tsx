"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile, UserRole } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatHandle } from "@/lib/handle";
import {
    Crown, Shield, User, MapPin, Briefcase, Building2,
    CheckCircle, Mail, Phone, Linkedin, Globe
} from "lucide-react";

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

interface MemberCardProps {
    member: Profile;
    showDetails?: boolean;
    canSeeContacts?: boolean;  // Central committee+ can see all contacts
}

// Get role display info with Nepali support
const getRoleDisplay = (role: UserRole, isNepali: boolean) => {
    switch (role) {
        case 'admin':
            return { variant: "secondary" as const, icon: <Shield size={12} />, label: isNepali ? "यन्त्रिक" : "Yantrik" };
        case 'admin_party':
            return { variant: "red" as const, icon: <Crown size={12} />, label: isNepali ? "प्रशासक" : "Admin" };
        case 'yantrik':
            return { variant: "secondary" as const, icon: <Shield size={12} />, label: isNepali ? "यन्त्रिक" : "Yantrik" };
        case 'board':
            return { variant: "default" as const, icon: <Building2 size={12} />, label: isNepali ? "समिति" : "Committee" };
        case 'central_committee':
            return { variant: "default" as const, icon: <Building2 size={12} />, label: isNepali ? "समिति" : "Committee" };
        case 'team_member':
            return { variant: "outline" as const, icon: <User size={12} />, label: isNepali ? "टिम" : "Team" };
        case 'party_member':
            return { variant: "party" as const, icon: <User size={12} />, label: isNepali ? "सदस्य" : "Member" };
        default:
            return { variant: "outline" as const, icon: <User size={12} />, label: isNepali ? "समर्थक" : "Supporter" };
    }
};

export default function MemberCard({ member, showDetails = true, canSeeContacts = false }: MemberCardProps) {
    const { language } = useLanguage();
    const isNepali = language === 'ne';
    const role = getRoleDisplay(member.role, isNepali);
    const placeholderIndex = member.id.charCodeAt(0) % PLACEHOLDERS.length;
    const avatar = member.avatar_url || PLACEHOLDERS[placeholderIndex];
    const handle = formatHandle(member.handle);
    const isVerified = !!member.verified_at;

    // Show contact if user opted in OR viewer is central_committee+
    const showEmail = canSeeContacts || (member.show_contact_email && member.contact_email_public);
    const showPhone = canSeeContacts || (member.show_contact_phone && member.contact_phone_public);

    return (
        <Link href={member.handle ? `/members/@${member.handle}` : `/members/${member.id}`}>
            <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-0">
                    {/* Header Gradient */}
                    <div className="h-16 bg-gradient-to-br from-brand-blue/80 to-brand-navy relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    </div>

                    {/* Avatar */}
                    <div className="px-4 -mt-10 relative z-10">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
                            <Image
                                src={avatar}
                                alt={member.full_name || "Member"}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 pt-2">
                        {/* Name + Handle */}
                        <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="font-semibold text-slate-800 group-hover:text-brand-blue transition-colors truncate">
                                {member.full_name || "Anonymous"}
                            </h3>
                            {isVerified && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                        </div>

                        {/* Handle */}
                        {handle && (
                            <p className="text-xs text-slate-400 mb-2">{handle}</p>
                        )}

                        {/* Role Badge */}
                        <Badge variant={role.variant} className="mb-3">
                            {role.icon}
                            <span className="ml-1">{role.label}</span>
                        </Badge>

                        {showDetails && (
                            <div className="space-y-1.5 text-xs text-slate-500">
                                {/* Location */}
                                {member.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3 w-3 text-slate-400" />
                                        <span className="truncate">{member.location}</span>
                                    </div>
                                )}

                                {/* Profession */}
                                {member.profession && (
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="h-3 w-3 text-slate-400" />
                                        <span className="truncate">
                                            {member.position_title
                                                ? `${member.position_title} at ${member.organization || member.profession}`
                                                : member.profession
                                            }
                                        </span>
                                    </div>
                                )}

                                {/* Contact Icons */}
                                <div className="flex items-center gap-2 pt-2">
                                    {showEmail && member.contact_email_public && (
                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                    {showPhone && member.contact_phone_public && (
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                    {member.linkedin_url && (
                                        <Linkedin className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                    {member.website_url && (
                                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// Skeleton for loading state
export function MemberCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full">
            <CardContent className="p-0">
                <div className="h-16 bg-slate-100" />
                <div className="px-4 -mt-10">
                    <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-lg animate-pulse" />
                </div>
                <div className="px-4 pb-4 pt-2 space-y-2">
                    <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
                </div>
            </CardContent>
        </Card>
    );
}
