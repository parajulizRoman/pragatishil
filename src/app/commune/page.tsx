/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { DiscussionChannel, UserRole } from "@/types";
import ChannelModal from "./ChannelModal";
import { createBrowserClient } from "@supabase/ssr";
import { canManageChannels } from "@/lib/permissions";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Plus, Edit2, Search, Folder, FolderOpen,
    ChevronDown, ChevronRight, MapPin, Building2, Users, Globe,
    FileText, Hash, MessageSquare
} from "lucide-react";

// Tree node interface for display
interface TreeNode {
    id: string;
    name: string;
    name_ne?: string;
    slug?: string;
    location_type?: string | null;
    isVirtual?: boolean;
    channel?: DiscussionChannel;
    children: TreeNode[];
}

// Skeleton for loading
function TreeSkeleton() {
    return (
        <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-48" />
                </div>
            ))}
        </div>
    );
}

export default function CommunityPage() {
    const { t, language } = useLanguage();
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingChannel, setEditingChannel] = useState<DiscussionChannel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    // Search and expanded state
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Council', 'Public Space']));
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    useEffect(() => {
        const init = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile) setUserRole(profile.role);
            }
            fetchChannels();
        };
        init();
    }, []);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/discussions/channels");
            if (!res.ok) throw new Error("Failed to load channels");
            const data = await res.json();
            setChannels(data.channels);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingChannel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, channel: DiscussionChannel) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingChannel(channel);
        setIsModalOpen(true);
    };

    const canEditChannels = canManageChannels(userRole);

    // Filter channels based on search
    const filteredChannels = useMemo(() => {
        if (!searchQuery) return channels;
        const query = searchQuery.toLowerCase();
        return channels.filter(c =>
            (c.name || '').toLowerCase().includes(query) ||
            (c.name_ne || '').toLowerCase().includes(query) ||
            (c.description || '').toLowerCase().includes(query)
        );
    }, [channels, searchQuery]);

    // Build tree structure from channels
    const buildChannelTree = useCallback((chans: DiscussionChannel[], parentId: string | null = null): TreeNode[] => {
        return chans
            .filter(c => c.parent_channel_id === parentId)
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .map(c => ({
                id: c.id,
                name: c.name,
                name_ne: c.name_ne,
                slug: c.slug,
                location_type: c.location_type,
                channel: c,
                children: buildChannelTree(chans, c.id)
            }));
    }, []);

    // Group channels by category
    const groupedChannels = useMemo(() => {
        const geoChannels = filteredChannels.filter(c => c.location_type);
        const regularChannels = filteredChannels.filter(c => !c.location_type);

        // Build council tree
        const councilTree: TreeNode[] = [];

        // Central Committee
        const centralChannels = geoChannels.filter(c => c.location_type === 'central');
        if (centralChannels.length > 0) {
            councilTree.push({
                id: 'central-committee',
                name: 'Central Committee',
                name_ne: 'केन्द्रीय समिति',
                location_type: 'central',
                isVirtual: true,
                children: buildChannelTree(centralChannels)
            });
        }

        // Geographic (States)
        const stateChannels = geoChannels.filter(c => ['state', 'district', 'municipality', 'ward'].includes(c.location_type || ''));
        if (stateChannels.length > 0) {
            const stateRoots = stateChannels.filter(c => c.location_type === 'state');
            councilTree.push({
                id: 'geographic',
                name: 'Geographic',
                name_ne: 'प्रादेशिक',
                location_type: 'state',
                isVirtual: true,
                children: stateRoots.map(s => ({
                    id: s.id,
                    name: s.name,
                    name_ne: s.name_ne,
                    slug: s.slug,
                    location_type: s.location_type,
                    channel: s,
                    children: buildChannelTree(stateChannels, s.id)
                }))
            });
        }

        // Departments
        const departmentChannels = geoChannels.filter(c => c.location_type === 'department');
        if (departmentChannels.length > 0) {
            councilTree.push({
                id: 'departments',
                name: 'Departments',
                name_ne: 'विभागहरू',
                location_type: 'department',
                isVirtual: true,
                children: buildChannelTree(departmentChannels)
            });
        }

        // Regular channels grouped by category
        const regularGroups: Record<string, TreeNode[]> = {};
        regularChannels.forEach(ch => {
            const cat = ch.category || 'General';
            if (!regularGroups[cat]) regularGroups[cat] = [];
            regularGroups[cat].push({
                id: ch.id,
                name: ch.name,
                name_ne: ch.name_ne,
                slug: ch.slug,
                channel: ch,
                children: []
            });
        });

        return { councilTree, regularGroups };
    }, [filteredChannels, buildChannelTree]);

    // Toggle category expansion
    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    };

    // Toggle node expansion
    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(nodeId)) next.delete(nodeId);
            else next.add(nodeId);
            return next;
        });
    };

    // Get icon for location type
    const getLocationIcon = (locationType?: string | null, isExpanded?: boolean) => {
        if (locationType === 'central') return <Building2 size={18} className="text-brand-red" />;
        if (locationType === 'state') return <MapPin size={18} className="text-brand-blue" />;
        if (locationType === 'district') return <MapPin size={16} className="text-slate-500" />;
        if (locationType === 'municipality') return <MapPin size={14} className="text-slate-400" />;
        if (locationType === 'ward') return <Users size={14} className="text-slate-400" />;
        if (locationType === 'department') return <Building2 size={16} className="text-purple-500" />;
        return isExpanded ? <FolderOpen size={18} className="text-amber-500" /> : <Folder size={18} className="text-amber-500" />;
    };

    // Render a tree node
    const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const isClickable = !node.isVirtual && node.slug;

        return (
            <div key={node.id} className="select-none">
                <div
                    className={cn(
                        "flex items-center gap-2 py-2.5 px-3 rounded-lg transition-all group",
                        depth > 0 && "ml-6",
                        isClickable ? "hover:bg-slate-100 cursor-pointer" : "cursor-default",
                        hasChildren && !isClickable && "hover:bg-slate-50"
                    )}
                    onClick={() => {
                        if (hasChildren) toggleNode(node.id);
                    }}
                >
                    {/* Expand/Collapse Arrow */}
                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNode(node.id);
                            }}
                            className="p-0.5 hover:bg-slate-200 rounded transition-colors shrink-0"
                        >
                            {isExpanded ? (
                                <ChevronDown size={16} className="text-slate-500" />
                            ) : (
                                <ChevronRight size={16} className="text-slate-500" />
                            )}
                        </button>
                    ) : (
                        <span className="w-5" />
                    )}

                    {/* Icon */}
                    <span className="shrink-0">
                        {getLocationIcon(node.location_type, isExpanded)}
                    </span>

                    {/* Name */}
                    {isClickable ? (
                        <Link
                            href={`/commune/${node.slug || node.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 font-medium text-slate-800 hover:text-brand-blue transition-colors truncate"
                        >
                            {language === 'ne' && node.name_ne ? node.name_ne : node.name}
                        </Link>
                    ) : (
                        <span className={cn(
                            "flex-1 font-semibold uppercase tracking-wide truncate",
                            depth === 0 ? "text-slate-700 text-sm" : "text-slate-600 text-xs"
                        )}>
                            {language === 'ne' && node.name_ne ? node.name_ne : node.name}
                        </span>
                    )}

                    {/* Edit Button */}
                    {canEditChannels && isClickable && node.channel && (
                        <button
                            onClick={(e) => handleEdit(e, node.channel!)}
                            className="p-1.5 text-slate-300 hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white"
                        >
                            <Edit2 size={12} />
                        </button>
                    )}

                    {/* Arrow indicator for expandable */}
                    {!hasChildren && <span className="w-5" />}
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="border-l-2 border-slate-100 ml-5 mt-0.5">
                        {node.children.map(child => renderTreeNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Render category folder
    const renderCategoryFolder = (
        category: string,
        nodes: TreeNode[],
        icon: React.ReactNode,
        colorClass: string
    ) => {
        const isExpanded = expandedCategories.has(category);

        return (
            <div key={category} className="mb-2">
                <button
                    onClick={() => toggleCategory(category)}
                    className={cn(
                        "w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all",
                        "hover:bg-slate-50 group",
                        isExpanded && "bg-slate-50/50"
                    )}
                >
                    {/* Expand Arrow */}
                    <span className="shrink-0">
                        {isExpanded ? (
                            <ChevronDown size={18} className={colorClass} />
                        ) : (
                            <ChevronRight size={18} className="text-slate-400" />
                        )}
                    </span>

                    {/* Icon */}
                    <span className="shrink-0">{icon}</span>

                    {/* Category Name */}
                    <span className={cn(
                        "flex-1 text-left font-bold uppercase tracking-wider text-sm",
                        isExpanded ? colorClass : "text-slate-600"
                    )}>
                        {category}
                    </span>

                    {/* Count Badge */}
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500">
                        {nodes.length}
                    </Badge>
                </button>

                {/* Children */}
                {isExpanded && (
                    <div className="ml-4 border-l-2 border-slate-100 pl-2 mt-1 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                        {nodes.map(ch => renderTreeNode(ch, 0))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8 text-center">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>
                <Card className="border-slate-200">
                    <TreeSkeleton />
                </Card>
            </div>
        );
    }

    if (error) {
        return <div className="p-10 text-center text-destructive font-medium">{t("त्रुटि", "Error")}: {error}</div>;
    }

    // Category order and icons
    const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
        'Council': { icon: <Building2 size={20} className="text-brand-red" />, color: 'text-brand-red' },
        'Public Space': { icon: <Globe size={20} className="text-brand-blue" />, color: 'text-brand-blue' },
        'Q&A': { icon: <MessageSquare size={20} className="text-green-600" />, color: 'text-green-600' },
        'General': { icon: <Hash size={20} className="text-slate-500" />, color: 'text-slate-600' },
        'Public Resources': { icon: <FileText size={20} className="text-purple-500" />, color: 'text-purple-600' },
    };

    const categoryOrder = ['Council', 'Public Space', 'Q&A', 'General', 'Public Resources'];

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh]">
            {/* Header */}
            <div className="mb-8 text-center">
                <Typography variant="h1" className="mb-2 text-brand-navy">
                    {t("समुदाय छलफल", "Community Discussions")}
                </Typography>
                <Typography variant="lead" className="text-slate-500">
                    {t("छलफलमा सहभागी हुनुहोस्। तलको च्यानल छान्नुहोस्।", "Join the conversation. Select a channel below.")}
                </Typography>
            </div>

            {/* Search Bar */}
            <div className="mb-6 max-w-xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm"
                        placeholder={t("च्यानल खोज्नुहोस्...", "Search channels...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tree View Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    {filteredChannels.length === 0 ? (
                        <div className="text-center py-12">
                            <Typography variant="muted" className="text-lg">
                                {t("कुनै च्यानल भेटिएन।", "No channels found.")}
                            </Typography>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Council Section */}
                            {groupedChannels.councilTree.length > 0 && (
                                <div className="mb-4">
                                    <button
                                        onClick={() => toggleCategory('Council')}
                                        className={cn(
                                            "w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all",
                                            "hover:bg-red-50/50 group",
                                            expandedCategories.has('Council') && "bg-red-50/30"
                                        )}
                                    >
                                        <span className="shrink-0">
                                            {expandedCategories.has('Council') ? (
                                                <ChevronDown size={18} className="text-brand-red" />
                                            ) : (
                                                <ChevronRight size={18} className="text-slate-400" />
                                            )}
                                        </span>
                                        <Building2 size={20} className="text-brand-red shrink-0" />
                                        <span className={cn(
                                            "flex-1 text-left font-bold uppercase tracking-wider text-sm",
                                            expandedCategories.has('Council') ? "text-brand-red" : "text-slate-600"
                                        )}>
                                            {t("परिषद्", "Council")}
                                        </span>
                                    </button>

                                    {expandedCategories.has('Council') && (
                                        <div className="ml-4 border-l-2 border-red-100 pl-2 mt-1 animate-in slide-in-from-top-2 duration-200">
                                            {groupedChannels.councilTree.map(node => renderTreeNode(node, 0))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            {groupedChannels.councilTree.length > 0 && Object.keys(groupedChannels.regularGroups).length > 0 && (
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
                            )}

                            {/* Regular Categories */}
                            {categoryOrder
                                .filter(cat => cat !== 'Council' && groupedChannels.regularGroups[cat])
                                .map(category => {
                                    const config = categoryConfig[category] || { icon: <Folder size={20} />, color: 'text-slate-600' };
                                    return renderCategoryFolder(
                                        category,
                                        groupedChannels.regularGroups[category],
                                        config.icon,
                                        config.color
                                    );
                                })}

                            {/* Remaining categories not in order */}
                            {Object.keys(groupedChannels.regularGroups)
                                .filter(cat => !categoryOrder.includes(cat))
                                .map(category => {
                                    return renderCategoryFolder(
                                        category,
                                        groupedChannels.regularGroups[category],
                                        <Folder size={20} className="text-slate-500" />,
                                        'text-slate-600'
                                    );
                                })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Admin Create Action */}
            {canEditChannels && (
                <div className="mt-8 text-center">
                    <Button onClick={handleCreate} size="lg" className="rounded-full shadow-lg hover:shadow-xl px-8 bg-brand-blue hover:bg-brand-blue/90">
                        <Plus className="mr-2 h-5 w-5" />
                        {t("नयाँ च्यानल सिर्जना", "Create New Channel")}
                    </Button>
                    <Typography variant="muted" className="mt-2 text-xs">
                        {t("एडमिन र यान्त्रिकहरूलाई मात्र देखिने", "Visible only to Admins & Yantriks")}
                    </Typography>
                </div>
            )}

            <ChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchChannels}
                editChannel={editingChannel}
            />
        </div>
    );
}
