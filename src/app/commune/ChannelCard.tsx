import React from 'react';
import Link from 'next/link';
import { DiscussionChannel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
    channel: DiscussionChannel;
    isActive?: boolean;
    showStats?: boolean;
    language?: 'en' | 'ne';
}

export default function ChannelCard({ channel, isActive = false, showStats = true, language = 'en' }: ChannelCardProps) {
    const displayName = language === 'ne' && channel.name_ne ? channel.name_ne : channel.name;

    // Get thumbnail or fallback to emoji
    const thumbnail = channel.thumbnail_url || null;
    const icon = channel.icon_emoji || '💬';

    // Visibility badge
    const visibilityConfig = {
        public: { icon: Globe, label: 'Public', labelNe: 'सार्वजनिक', color: 'bg-green-100 text-green-700' },
        members: { icon: Users, label: 'Members', labelNe: 'सदस्य', color: 'bg-blue-100 text-blue-700' },
        party_only: { icon: Lock, label: 'Party Only', labelNe: 'पार्टी मात्र', color: 'bg-red-100 text-red-700' },
    };

    const visConfig = visibilityConfig[channel.visibility as keyof typeof visibilityConfig] || visibilityConfig.public;
    const VisIcon = visConfig.icon;

    return (
        <Link href={`/commune/${channel.slug || channel.id}`}>
            <Card className={cn(
                "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
                isActive ? "border-brand-blue bg-blue-50/50" : "border-transparent hover:border-slate-200"
            )}>
                <CardContent className="p-4">
                    {/* Thumbnail/Icon */}
                    <div className="flex items-start gap-3 mb-3">
                        {thumbnail ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                <img
                                    src={thumbnail}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                                {icon}
                            </div>
                        )}

                        {/* Channel Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className={cn(
                                "font-bold text-sm line-clamp-2 group-hover:text-brand-blue transition-colors",
                                isActive && "text-brand-blue"
                            )}>
                                {displayName}
                            </h3>

                            {/* Location/Type Badge */}
                            {channel.location_type && (
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {channel.location_type === 'central' && '🏛️ Central'}
                                    {channel.location_type === 'state' && '🗺️ State'}
                                    {channel.location_type === 'district' && '📍 District'}
                                    {channel.location_type === 'municipality' && '🏘️ Municipality'}
                                    {channel.location_type === 'ward' && '🏠 Ward'}
                                    {channel.location_type === 'department' && '🏢 Department'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {channel.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {channel.description}
                        </p>
                    )}

                    {/* Footer: Stats & Visibility */}
                    <div className="flex items-center justify-between text-xs">
                        {showStats && (
                            <div className="flex items-center gap-3 text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {channel.thread_count || 0}
                                </span>
                                {channel.member_count !== undefined && (
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {channel.member_count}
                                    </span>
                                )}
                            </div>
                        )}

                        <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", visConfig.color)}>
                            <VisIcon className="w-3 h-3 mr-1" />
                            {language === 'ne' ? visConfig.labelNe : visConfig.label}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
