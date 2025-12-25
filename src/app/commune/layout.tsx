"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiscussionChannel, UserRole } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import ChannelModal from "./ChannelModal";
import { canManageChannels } from "@/lib/permissions";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

function SidebarSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in">
            {[1, 2, 3].map((i) => (
                <div key={i} className="px-2">
                    <Skeleton className="h-3 w-24 mb-3" />
                    <div className="space-y-2 pl-2 border-l-2 border-slate-100 ml-1">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-[80%]" />
                        <Skeleton className="h-6 w-[90%]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CommuneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const [channels, setChannels] = useState<DiscussionChannel[]>([]);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<DiscussionChannel | null>(null);
    const [parentChannelForCreate, setParentChannelForCreate] = useState<DiscussionChannel | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Fetch User Role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            if (profile) setUserRole(profile.role);
        }

        // 2. Fetch Channels
        try {
            const res = await fetch("/api/discussions/channels");
            if (res.ok) {
                const data = await res.json();
                setChannels(data.channels);
            }
        } catch (err) {
            console.error("Failed to load sidebar channels", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingChannel(null);
        setParentChannelForCreate(null);
        setIsModalOpen(true);
    };

    const handleCreateSubChannel = (e: React.MouseEvent, parentChannel: DiscussionChannel) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingChannel(null);
        setParentChannelForCreate(parentChannel);
        setIsModalOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, channel: DiscussionChannel) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingChannel(channel);
        setParentChannelForCreate(null);
        setIsModalOpen(true);
    };

    // Use Capability Helper
    const canEditChannels = canManageChannels(userRole);

    // Separate geographic (Council) channels from regular channels
    const geoChannels = channels.filter(c => c.location_type);
    const regularChannels = channels.filter(c => !c.location_type);

    // Build nested tree from geographic channels
    interface ChannelNode extends DiscussionChannel {
        children: ChannelNode[];
    }

    const buildChannelTree = (chans: DiscussionChannel[], parentId: string | null = null): ChannelNode[] => {
        return chans
            .filter(c => c.parent_channel_id === parentId)
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .map(c => ({ ...c, children: buildChannelTree(chans, c.id) }));
    };

    // Separate into 3 categories:
    // 1. Central Committee (location_type = 'central')
    // 2. Geographic/States (location_type = 'state', 'district', 'municipality', 'ward')
    // 3. Departments (location_type = 'department')
    const centralChannels = geoChannels.filter(c => c.location_type === 'central');
    const stateChannels = geoChannels.filter(c => ['state', 'district', 'municipality', 'ward'].includes(c.location_type || ''));
    const departmentChannels = geoChannels.filter(c => c.location_type === 'department');

    // Build trees for each category
    // Central tree starts from root (no parent)
    const centralTree = buildChannelTree(centralChannels);

    // States tree: states are roots (even though they may have parent = central in DB)
    // First get state-level channels as roots, then build children
    const buildStatesTree = (): ChannelNode[] => {
        // State channels are the roots for Geographic section
        const stateRoots = stateChannels.filter(c => c.location_type === 'state');
        return stateRoots
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .map(s => ({
                ...s,
                children: buildChannelTree(stateChannels, s.id)
            }));
    };
    const statesTree = buildStatesTree();

    // Departments tree
    const departmentsTree = buildChannelTree(departmentChannels);

    // Dynamic Grouping & Ordering for regular channels
    const groupedChannels = regularChannels.reduce((acc, channel) => {
        const cat = channel.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(channel);
        return acc;
    }, {} as Record<string, DiscussionChannel[]>);

    const CATEGORY_ORDER = ['Public Space', 'Q&A', 'Public Resources'];

    const sortedCategories = Object.keys(groupedChannels).sort((a, b) => {
        const idxA = CATEGORY_ORDER.indexOf(a);
        const idxB = CATEGORY_ORDER.indexOf(b);

        // If both in priority list, sort by index
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        // If A is priority, it goes first
        if (idxA !== -1) return -1;
        // If B is priority, it goes first
        if (idxB !== -1) return 1;

        // Otherwise alphabetical
        return a.localeCompare(b);
    });

    const renderChannelLink = (c: DiscussionChannel, icon: string, activeClass: string) => (
        <li key={c.id} className="group flex items-center justify-between hover:bg-slate-50 rounded-md">
            <Link
                href={`/commune/${c.id}`}
                className={`flex-grow block px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(c.id) ? activeClass : 'text-slate-600 hover:text-slate-900'} flex items-center gap-1`}
            >
                <span className="opacity-70 text-xs">{icon}</span> {language === 'ne' && c.name_ne ? c.name_ne : c.name}
            </Link>
            {canEditChannels && (
                <button
                    onClick={(e) => handleEdit(e, c)}
                    className="p-1 text-slate-300 hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity mr-1"
                    title={t("च्यानल सम्पादन", "Edit Channel")}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
            )}
        </li>
    );

    const renderCategoryGroup = (cat: string) => {
        const _channels = groupedChannels[cat].sort((a, b) => {
            // Prioritize "Khulla Manch" in any category
            if (a.name.toLowerCase().includes('khulla manch')) return -1;
            if (b.name.toLowerCase().includes('khulla manch')) return 1;
            return a.name.localeCompare(b.name);
        });

        // Default open for priority categories
        const isOpen = CATEGORY_ORDER.includes(cat) || cat === 'General';

        return (
            <details key={cat} open={isOpen} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 hover:text-slate-700 transition-colors">
                    <span>{cat}</span>
                    <span className="text-[10px] transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="space-y-1 mb-4 pl-1 border-l-2 border-slate-100 ml-1">
                    {_channels.map(c => {
                        let icon = '#';
                        let activeClass = 'bg-slate-100 text-slate-900 font-medium';

                        if (c.visibility === 'public') {
                            activeClass = 'bg-blue-50 text-brand-blue font-medium';
                        } else if (['members', 'party_only'].includes(c.visibility)) {
                            activeClass = 'bg-red-50 text-brand-red font-medium';
                        } else {
                            icon = '🔒';
                        }
                        return renderChannelLink(c, icon, activeClass);
                    })}
                </ul>
            </details>
        );
    };

    // Recursive render for Council tree
    const renderCouncilNode = (node: ChannelNode, depth: number = 0): React.ReactNode => {
        const hasChildren = node.children && node.children.length > 0;
        const isActive = pathname.includes(node.id);

        // Check if user can create sub-channels under this node
        const canCreateSub = node.can_create_subchannels && canEditChannels;

        // Location type icons
        const locationIcons: Record<string, string> = {
            'central': '🏛️',
            'state': '🗺️',
            'district': '📍',
            'municipality': '🏘️',
            'ward': '🏠',
        };
        const icon = locationIcons[node.location_type || ''] || '#';

        // Create sub-channel button
        const createButton = canCreateSub ? (
            <button
                onClick={(e) => handleCreateSubChannel(e, node)}
                className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-brand-blue p-0.5 rounded hover:bg-slate-100 transition-all"
                title={t("उप-च्यानल सिर्जना गर्नुहोस्", "Create sub-channel")}
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        ) : null;

        if (hasChildren) {
            return (
                <details key={node.id} open={depth < 1} className="group/nested">
                    <summary className={`group/item flex items-center justify-between cursor-pointer list-none text-sm py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors ${isActive ? 'bg-red-50 text-brand-red font-medium' : 'text-slate-600'}`}>
                        <span className="flex items-center gap-1.5 flex-1">
                            <span className="text-xs">{icon}</span>
                            {language === 'ne' && node.name_ne ? node.name_ne : node.name}
                        </span>
                        <span className="flex items-center gap-1">
                            {createButton}
                            <span className="text-[10px] transform group-open/nested:rotate-180 transition-transform">▼</span>
                        </span>
                    </summary>
                    <div className="pl-3 border-l-2 border-red-100 ml-2 mt-1 space-y-0.5">
                        {node.children.map((child: ChannelNode) => renderCouncilNode(child, depth + 1))}
                    </div>
                </details>
            );
        }

        // Leaf node (no children) - clickable link with optional create button
        return (
            <div key={node.id} className="group/item flex items-center justify-between">
                <Link
                    href={`/commune/${node.id}`}
                    className={`flex-1 flex items-center gap-1.5 py-1.5 px-2 rounded-md text-sm transition-colors ${isActive ? 'bg-red-50 text-brand-red font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                    <span className="text-xs">{icon}</span>
                    {language === 'ne' && node.name_ne ? node.name_ne : node.name}
                </Link>
                {createButton}
            </div>
        );
    };

    // Render Council category with 3 sub-sections
    const renderCouncilCategory = () => {
        const hasCentral = centralTree.length > 0;
        const hasStates = statesTree.length > 0;
        const hasDepartments = departmentsTree.length > 0;

        if (!hasCentral && !hasStates && !hasDepartments) return null;

        return (
            <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-brand-red uppercase tracking-wider mb-2 px-2 hover:text-red-700 transition-colors">
                    <span>🏛️ {t("परिषद्", "Council")}</span>
                    <span className="text-[10px] transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="space-y-3 mb-4 pl-1 border-l-2 border-red-100 ml-1">

                    {/* Central Committee */}
                    {hasCentral && (
                        <details open className="group/central">
                            <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-600 uppercase tracking-wide px-2 hover:text-brand-red transition-colors">
                                <span className="flex items-center gap-1">🏢 {t("केन्द्रीय समिति", "Central Committee")}</span>
                                <span className="text-[10px] transform group-open/central:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="pl-3 border-l-2 border-slate-100 ml-2 mt-1 space-y-0.5">
                                {centralTree.map((node: ChannelNode) => renderCouncilNode(node, 0))}
                            </div>
                        </details>
                    )}

                    {/* Geographic - States Hierarchy */}
                    {hasStates && (
                        <details open className="group/states">
                            <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-600 uppercase tracking-wide px-2 hover:text-brand-red transition-colors">
                                <span className="flex items-center gap-1">🗺️ {t("प्रादेशिक", "Geographic")}</span>
                                <span className="text-[10px] transform group-open/states:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="pl-3 border-l-2 border-slate-100 ml-2 mt-1 space-y-0.5">
                                {statesTree.map((node: ChannelNode) => renderCouncilNode(node, 0))}
                            </div>
                        </details>
                    )}

                    {/* Departments */}
                    <details open className="group/depts">
                        <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-600 uppercase tracking-wide px-2 hover:text-brand-red transition-colors">
                            <span className="flex items-center gap-1">📁 {t("विभागहरू", "Departments")}</span>
                            <span className="flex items-center gap-1">
                                {/* Add Department button - admin/yantrik only */}
                                {canEditChannels && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditingChannel(null);
                                            // Create a "fake" parent for department
                                            setParentChannelForCreate({
                                                id: 'new-department',
                                                name: 'New Department',
                                                slug: 'new-department',
                                                description: '',
                                                visibility: 'party_only',
                                                access_type: 'role_based',
                                                category: 'Council',
                                                location_type: 'department',
                                                can_create_subchannels: true,
                                                allow_anonymous_posts: false,
                                                min_role_to_post: 'party_member',
                                                min_role_to_create_threads: 'party_member',
                                                min_role_to_comment: 'party_member',
                                                min_role_to_vote: 'party_member',
                                                created_at: new Date().toISOString(),
                                            } as DiscussionChannel);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-slate-400 hover:text-brand-blue p-0.5 rounded hover:bg-slate-100 transition-all"
                                        title={t("नयाँ विभाग थप्नुहोस्", "Add new department")}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                )}
                                <span className="text-[10px] transform group-open/depts:rotate-180 transition-transform">▼</span>
                            </span>
                        </summary>
                        <div className="pl-3 border-l-2 border-slate-100 ml-2 mt-1 space-y-0.5">
                            {departmentsTree.map((node: ChannelNode) => renderCouncilNode(node, 0))}
                        </div>
                    </details>
                </div>
            </details>
        );
    };

    // Role label translation with disguising (admin → yantrik, board → central committee)
    const getRoleLabel = (role: string | null) => {
        if (!role) return t("अतिथि", "Guest");

        // Disguise roles for public display
        let displayRole = role;
        if (role === 'admin') displayRole = 'yantrik';
        if (role === 'board') displayRole = 'central_committee';

        const labels: Record<string, { en: string; ne: string }> = {
            'admin_party': { en: 'Party Admin', ne: 'पार्टी प्रशासक' },
            'yantrik': { en: 'Yantrik', ne: 'यान्त्रिक' },
            'central_committee': { en: 'Central Committee', ne: 'केन्द्रीय सदस्य' },
            'party_member': { en: 'Party Member', ne: 'पार्टी सदस्य' },
            'supporter': { en: 'Supporter', ne: 'समर्थक' },
        };
        const label = labels[displayRole] || { en: displayRole, ne: displayRole };
        return t(label.ne, label.en);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 pt-16">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] z-20">
                <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="flex justify-between items-center mb-6 px-2 sticky top-0 bg-white pb-2 z-10">
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-brand-red/20 pb-1">{t("छलफलहरू", "Discussions")}</h2>
                        {canEditChannels && (
                            <button
                                onClick={handleCreate}
                                className="text-slate-400 hover:text-brand-blue p-1 rounded hover:bg-slate-50"
                                title={t("नयाँ च्यानल सिर्जना", "Create New Channel")}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {loading ? (
                            <SidebarSkeleton />
                        ) : (
                            <>
                                {/* Council (Geographic) Channels First */}
                                {renderCouncilCategory()}

                                {/* Regular Categories */}
                                {sortedCategories.map(renderCategoryGroup)}
                            </>
                        )}

                        {/* Fallback if no channels */}
                        {channels.length === 0 && (
                            <div className="px-2 text-xs text-slate-400 italic">{t("कुनै च्यानलहरू लोड भएनन्।", "No channels loaded.")}</div>
                        )}
                    </div>
                </div>
                {/* User Role Debug / Info */}
                <div className="p-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        {t("पोस्ट गर्दै", "Posting as")}: <span className="font-semibold text-slate-600">{getRoleLabel(userRole)}</span>
                    </p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 w-full">
                {children}
            </main>

            {/* Modal - Global for Commune Section */}
            <ChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                editChannel={editingChannel}
                parentChannel={parentChannelForCreate}
            />
        </div>
    );
}
