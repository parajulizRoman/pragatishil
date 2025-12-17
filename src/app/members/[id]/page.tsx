
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@/lib/supabase/server"; // Use helper or direct
import { notFound } from "next/navigation";
import Image from "next/image";
import { UserRole, hasRole, Profile } from "@/types";
import { Shield, MapPin, Mail, Phone, Crown, User } from "lucide-react";
import Link from "next/link";
import { createClient as createSupabaseClient } from "@supabase/supabase-js"; // For public/admin fetch

// Force dynamic to ensure we check auth every time
export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { id: string } }) {
    // 1. Get Viewer
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch viewer profile to get role
    let viewerRole: UserRole = 'guest';
    if (user) {
        const { data: viewerProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (viewerProfile) viewerRole = viewerProfile.role as UserRole;
    }

    // 2. Fetch Target Profile (Use Admin client to bypass RLS for filtering logic, OR rely on RLS)
    // RLS usually hides non-public. But we might want to show "Private Profile" instead of 404.
    // Let's use Admin to fetch and then decide what to show.
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !profile) {
        // Fallback: If no profile exists, check if it's the current user and try to auto-fix
        if (user && user.id === params.id) {
            console.log(`[Profile Page] Profile missing for owner ${user.id}. Attempting auto-repair.`);
            const meta = user.user_metadata;
            const fullName = meta.full_name || meta.name || 'Anonymous Member';
            const avatarUrl = meta.avatar_url || meta.picture;

            // Auto-create
            const { data: newProfile, error: createError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    role: 'supporter',
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (newProfile && !createError) {
                // Success: The profile is created.
                // We don't need to do anything else here.
                // The subsequent logic flow will re-fetch or use the updated targetProfile logic below.
            }
        }
    }

    // We need to restart the logic flow a bit.
    // Let's refactor the fetch part slightly.

    let targetProfile = profile;

    if (!targetProfile && user && user.id === params.id) {
        // Auto-fix block
        const meta = user.user_metadata;
        const fullName = meta.full_name || meta.name || 'Anonymous Member';
        const avatarUrl = meta.avatar_url || meta.picture;

        await supabaseAdmin.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: 'supporter',
            updated_at: new Date().toISOString()
        });

        const { data: fixed } = await supabaseAdmin.from('profiles').select('*').eq('id', params.id).single();
        targetProfile = fixed;
    }

    if (!targetProfile) {
        return notFound();
    }

    // Ensure "Anonymous" name is fixed for owner if metadata creates it
    if (user && user.id === targetProfile.id && (targetProfile.full_name === 'Anonymous' || !targetProfile.full_name)) {
        const meta = user.user_metadata;
        if (meta.full_name || meta.name) {
            const realName = meta.full_name || meta.name;
            await supabaseAdmin.from('profiles').update({
                full_name: realName,
                avatar_url: meta.avatar_url || meta.picture || targetProfile.avatar_url
            }).eq('id', user.id);
            targetProfile.full_name = realName;
            targetProfile.avatar_url = meta.avatar_url || meta.picture || targetProfile.avatar_url;
        }
    }

    const target = targetProfile as Profile;
    const isOwner = user?.id === target.id;
    const isAdmin = hasRole(viewerRole, 'admin_party');
    const isMember = hasRole(viewerRole, 'party_member');

    // 3. Visibility Check
    if (!target.is_public && !isOwner && !isAdmin) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
                <Shield size={64} className="text-slate-300 mb-4" />
                <h1 className="text-2xl font-bold text-slate-700">Private Profile</h1>
                <p className="text-slate-500 mt-2">This member has chosen to keep their profile private.</p>
                <Link href="/members" className="mt-6 text-brand-blue hover:underline">
                    Back to Members
                </Link>
            </div>
        );
    }

    // 4. Determine Data Visibility
    // Base: Avatar, Name, Role, Bio (Short)
    // Member+: Location, Expertise, Contact (if public)
    // Admin: Metadata

    const showSensitive = isOwner || isAdmin || isMember;
    const showContact = isOwner || isAdmin || (isMember && (target.contact_email_public || target.contact_phone_public));

    return (
        <main className="min-h-screen pt-20 pb-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="h-40 bg-gradient-to-r from-brand-blue to-brand-navy"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="rounded-full p-2 bg-white ring-4 ring-slate-50">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-200">
                                    <Image
                                        src={target.avatar_url || "/placeholders/default-avatar.png"}
                                        alt={target.full_name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            {isOwner && (
                                <Link
                                    href="/settings/profile"
                                    className="mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </Link>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900">{target.full_name || "Anonymous Member"}</h1>
                                <RoleBadge role={target.role} />
                            </div>

                            {/* Bio */}
                            {target.bio && (
                                <p className="mt-4 text-lg text-slate-800 leading-relaxed max-w-2xl font-medium">
                                    {target.bio}
                                </p>
                            )}

                            {/* Meta Grid */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {target.location && (
                                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                                        <MapPin className="text-slate-500" />
                                        <span>{target.location}</span>
                                    </div>
                                )}

                                {showContact && target.contact_email_public && (
                                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                                        <Mail className="text-slate-500" />
                                        <a href={`mailto:${target.contact_email_public}`} className="hover:text-brand-blue hover:underline">
                                            {target.contact_email_public}
                                        </a>
                                    </div>
                                )}

                                {showContact && target.contact_phone_public && (
                                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                                        <Phone className="text-slate-500" />
                                        <span>{target.contact_phone_public}</span>
                                    </div>
                                )}
                            </div>

                            {/* Expertise Tags */}
                            {showSensitive && target.expertise && target.expertise.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Areas of Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {target.expertise.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admin Section */}
                            {isAdmin && (
                                <div className="mt-8 pt-8 border-t border-red-100 bg-red-50/50 -mx-8 px-8 pb-4">
                                    <div className="flex items-center gap-2 mb-4 text-red-700 font-semibold">
                                        <Shield size={18} />
                                        Admin Controls
                                    </div>
                                    <div className="flex gap-4">
                                        <Link href={`/admin/audit?actor=${target.id}`} className="text-sm text-red-600 hover:underline">
                                            View Audit Logs
                                        </Link>
                                        <Link href={`/admin/users/${target.id}`} className="text-sm text-red-600 hover:underline">
                                            Manage Role
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Activity Section - Visible to Owner or if Public */}
                            {(showSensitive || target.is_public) && (
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6 font-heading">Recent Activity</h2>
                                    <ActivityFeed userId={target.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Separate component for async data fetching of activity to avoid blocking main profile load too much
// or just inline it if simple. Let's inline fetch for simplicity in Server Component.
async function ActivityFeed({ userId }: { userId: string }) {
    const supabase = await createClient(); // Use standard client (RLS applies - good!)

    // Fetch Threads
    const { data: threads } = await supabase
        .from('discussion_threads')
        .select('id, title, created_at, channel:channel_id(name, slug)')
        .eq('created_by', userId)
        .neq('is_anonymous', true) // Hide anonymous threads from profile
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch Posts
    const { data: posts } = await supabase
        .from('discussion_posts')
        .select('id, content, created_at, thread:thread_id(title, channel:channel_id(slug))')
        .eq('author_id', userId)
        .neq('is_anonymous', true) // Hide anonymous posts from profile
        .order('created_at', { ascending: false })
        .limit(5);

    if ((!threads || threads.length === 0) && (!posts || posts.length === 0)) {
        return <p className="text-slate-500 italic">No public activity yet.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    Recent Discussions
                </h3>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {threads?.map((thread: any) => (
                        <div key={thread.id} className="group">
                            <Link href={`/commune/thread/${thread.id}`} className="block">
                                <p className="font-medium text-slate-800 group-hover:text-brand-blue transition-colors line-clamp-1">
                                    {thread.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    {/* Handle potentially array-inferred channel */}
                                    <span>{Array.isArray(thread.channel) ? thread.channel[0]?.name : thread.channel?.name || 'Unknown Channel'}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                    {(!threads || threads.length === 0) && <p className="text-slate-400 text-sm">No discussions started.</p>}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    Recent Comments
                </h3>
                <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {posts?.map((post: any) => {
                        // Robust handling for nested inference quirks
                        const thread = Array.isArray(post.thread) ? post.thread[0] : post.thread;
                        const channel = thread && (Array.isArray(thread.channel) ? thread.channel[0] : thread.channel);
                        const channelSlug = channel?.slug || 'general';
                        const threadId = thread?.id || '';
                        const threadTitle = thread?.title || 'Unknown Thread';

                        return (
                            <div key={post.id} className="group">
                                <Link href={`/commune/thread/${threadId}#post-${post.id}`} className="block">
                                    <p className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors line-clamp-2 italic">
                                        &quot;{post.content}&quot;
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="line-clamp-1">on {threadTitle}</span>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                    {(!posts || posts.length === 0) && <p className="text-slate-400 text-sm">No comments made.</p>}
                </div>
            </div>
        </div >
    );
}

function RoleBadge({ role }: { role: UserRole }) {
    const config: Record<string, { color: string; icon: any; label: string }> = {
        'admin_party': { color: 'bg-red-100 text-red-700 border-red-200', icon: Crown, label: "Political Admin" },
        'yantrik': { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Shield, label: "Yantrik" },
        'central_committee': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Shield, label: "Central Committee" },
        'team_member': { color: 'bg-green-100 text-green-700 border-green-200', icon: User, label: "Team Member" },
        'party_member': { color: 'bg-brand-red/10 text-brand-red border-brand-red/20', icon: User, label: "Party Member" },
        'supporter': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: null, label: "Supporter" },
        'guest': { color: 'bg-slate-50 text-slate-400 border-slate-100', icon: null, label: "Guest" },
        'member': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: User, label: "Member" },
        'volunteer': { color: 'bg-green-50 text-green-600 border-green-100', icon: User, label: "Volunteer" },
        'board': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Crown, label: "Board Member" },
        'admin': { color: 'bg-red-900 text-white border-red-800', icon: Shield, label: "System Admin" },
    };

    const style = config[role] || { color: 'bg-slate-100', icon: null, label: role };

    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style.color}`}>
            {Icon && <Icon size={12} strokeWidth={2.5} />}
            {style.label}
        </span>
    );
}
