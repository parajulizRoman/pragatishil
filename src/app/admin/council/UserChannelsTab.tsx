"use client";

import { useEffect, useState } from "react";
import { Search, Hash, Trash2, Plus } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { addChannelMember, removeChannelMember, updateChannelMemberRole } from "@/actions/channelMembers";

interface UserProfile {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
}

interface UserMembership {
    id: string;
    channel_id: string;
    role: string;
    channel: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Channel {
    id: string;
    name: string;
    slug: string;
}

const roleBadgeColors: Record<string, string> = {
    viewer: "bg-slate-100 text-slate-600",
    member: "bg-blue-100 text-blue-700",
    moderator: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
};

export default function UserChannelsTab() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [memberships, setMemberships] = useState<UserMembership[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [addingChannel, setAddingChannel] = useState(false);
    const [newChannelId, setNewChannelId] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        loadUsers();
        loadChannels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadUsers = async () => {
        const { data } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, role")
            .order("full_name");
        setUsers(data || []);
    };

    const loadChannels = async () => {
        const { data } = await supabase
            .from("discussion_channels")
            .select("id, name, slug")
            .order("name");
        setChannels(data || []);
    };

    const loadUserMemberships = async (userId: string) => {
        setLoading(true);
        const { data } = await supabase
            .from("channel_members")
            .select(`
                id,
                channel_id,
                role,
                channel:discussion_channels (id, name, slug)
            `)
            .eq("user_id", userId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMemberships((data || []) as any);
        setLoading(false);
    };

    const handleSelectUser = (user: UserProfile) => {
        setSelectedUser(user);
        loadUserMemberships(user.id);
    };

    const handleRemoveMembership = async (channelId: string) => {
        if (!selectedUser) return;
        if (!confirm("Remove this user from the channel?")) return;

        await removeChannelMember(channelId, selectedUser.id);
        loadUserMemberships(selectedUser.id);
    };

    const handleRoleChange = async (channelId: string, newRole: string) => {
        if (!selectedUser) return;
        await updateChannelMemberRole(channelId, selectedUser.id, newRole as 'viewer' | 'member' | 'moderator' | 'admin');
        loadUserMemberships(selectedUser.id);
    };

    const handleAddChannel = async () => {
        if (!selectedUser || !newChannelId) return;
        setAddingChannel(true);
        await addChannelMember(newChannelId, selectedUser.id, "member");
        setNewChannelId("");
        setAddingChannel(false);
        loadUserMemberships(selectedUser.id);
    };

    const filteredUsers = users.filter(
        (u) =>
            u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Channels not yet assigned to user
    const availableChannels = channels.filter(
        (ch) => !memberships.some((m) => m.channel_id === ch.id)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-brand-navy text-sm mb-2">Select a User</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                    {filteredUsers.slice(0, 50).map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className={`w-full p-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${selectedUser?.id === user.id ? "bg-brand-blue/5" : ""
                                }`}
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                                <Image
                                    src={user.avatar_url || "/placeholders/default-user.png"}
                                    alt={user.full_name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-slate-800 truncate">{user.full_name}</p>
                                <p className="text-[10px] text-slate-400 uppercase">{user.role?.replace("_", " ")}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Channels */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-brand-navy text-sm">
                        {selectedUser ? `${selectedUser.full_name}'s Channels` : "Select a user to view channels"}
                    </h3>
                </div>

                {!selectedUser ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        Select a user from the list to manage their channel memberships
                    </div>
                ) : loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {memberships.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">No channel memberships</div>
                        ) : (
                            memberships.map((m) => (
                                <div key={m.id} className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Hash size={14} className="text-brand-blue" />
                                        <span className="text-sm font-medium">{m.channel.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={m.role}
                                            onChange={(e) => handleRoleChange(m.channel_id, e.target.value)}
                                            className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${roleBadgeColors[m.role]
                                                }`}
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="member">Member</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveMembership(m.channel_id)}
                                            className="h-7 w-7 text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add Channel */}
                        {selectedUser && availableChannels.length > 0 && (
                            <div className="p-3 flex items-center gap-2 bg-slate-50">
                                <select
                                    value={newChannelId}
                                    onChange={(e) => setNewChannelId(e.target.value)}
                                    className="flex-1 h-8 rounded-md border px-2 text-sm"
                                >
                                    <option value="">Add to channel...</option>
                                    {availableChannels.map((ch) => (
                                        <option key={ch.id} value={ch.id}>
                                            {ch.name}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    size="sm"
                                    onClick={handleAddChannel}
                                    disabled={!newChannelId || addingChannel}
                                    className="h-8"
                                >
                                    <Plus size={14} className="mr-1" />
                                    Add
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
