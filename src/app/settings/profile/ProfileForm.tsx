"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import {
    Loader2, Camera, Save, Eye, EyeOff, AtSign,
    Briefcase, Linkedin, Globe, Check, X
} from "lucide-react";
import { updateProfile } from "./actions";
import { Profile } from "@/types";
import { validateHandle, formatHandle } from "@/lib/handle";

export default function ProfileForm({ profile }: { profile: Profile }) {
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
    const [uploading, setUploading] = useState(false);
    const [isPublic, setIsPublic] = useState(profile.is_public);

    // New fields
    const [handle, setHandle] = useState(profile.handle || "");
    const [handleError, setHandleError] = useState<string | null>(null);
    const [handleChecking, setHandleChecking] = useState(false);
    const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);

    // Privacy toggles
    const [showContactEmail, setShowContactEmail] = useState(profile.show_contact_email || false);
    const [showContactPhone, setShowContactPhone] = useState(profile.show_contact_phone || false);

    // Profession
    const [profession, setProfession] = useState(profile.profession || "");
    const [organization, setOrganization] = useState(profile.organization || "");
    const [positionTitle, setPositionTitle] = useState(profile.position_title || "");

    // Social links
    const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || "");
    const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || "");

    // Handle validation
    const checkHandle = async (value: string) => {
        if (!value.trim()) {
            setHandleError(null);
            setHandleAvailable(null);
            return;
        }

        const validation = validateHandle(value);
        if (!validation.valid) {
            setHandleError(validation.error || "Invalid handle");
            setHandleAvailable(false);
            return;
        }

        setHandleChecking(true);
        setHandleError(null);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data, error } = await supabase
                .from("profiles")
                .select("id")
                .eq("handle_lower", value.toLowerCase())
                .neq("id", profile.id)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setHandleError("This handle is already taken");
                setHandleAvailable(false);
            } else {
                setHandleAvailable(true);
                setHandleError(null);
            }
        } catch (err) {
            console.error("Error checking handle:", err);
            setHandleError("Error checking availability");
            setHandleAvailable(false);
        } finally {
            setHandleChecking(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const fileExt = file.name.split(".").pop();
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Error uploading avatar. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        // Validate handle before submitting
        if (handle && handleAvailable === false) {
            alert("Please choose an available handle");
            return;
        }

        setLoading(true);

        // Append controlled state
        formData.set("is_public", isPublic ? "true" : "false");
        formData.set("show_contact_email", showContactEmail ? "true" : "false");
        formData.set("show_contact_phone", showContactPhone ? "true" : "false");
        formData.set("handle", handle);
        formData.set("profession", profession);
        formData.set("organization", organization);
        formData.set("position_title", positionTitle);
        formData.set("linkedin_url", linkedinUrl);
        formData.set("website_url", websiteUrl);
        if (avatarUrl) formData.set("avatar_url", avatarUrl);

        try {
            await updateProfile(formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
                <p className="text-slate-500">Update your public information and settings.</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner">
                    <Image
                        src={avatarUrl || "/placeholders/default-user.png"}
                        alt="Avatar"
                        fill
                        className="object-cover"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                        <Camera size={16} />
                        Change Photo
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">Max 2MB. JPG, PNG.</p>
                </div>
            </div>

            {/* @Handle Section */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-3">
                    <AtSign className="h-5 w-5 text-brand-blue" />
                    <h3 className="font-semibold text-slate-800">Your Handle</h3>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                    Choose a unique handle for your profile URL and mentions. Others can tag you with @{handle || "yourhandle"}
                </p>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                            setHandle(value);
                            setHandleAvailable(null);
                        }}
                        onBlur={() => checkHandle(handle)}
                        className="w-full pl-8 pr-10 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                        placeholder="yourhandle"
                        maxLength={30}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {handleChecking && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}
                        {!handleChecking && handleAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                        {!handleChecking && handleAvailable === false && <X className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
                {handleError && <p className="text-sm text-red-500 mt-1">{handleError}</p>}
                {handleAvailable && !handleError && handle && (
                    <p className="text-sm text-green-600 mt-1">✓ {formatHandle(handle)} is available!</p>
                )}
            </div>

            {/* Visibility Toggle */}
            <div className={`p-4 rounded-xl border transition-colors ${isPublic ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isPublic ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                            {isPublic ? <Eye size={20} /> : <EyeOff size={20} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Public Profile</h3>
                            <p className="text-sm text-slate-500">
                                {isPublic ? "Your profile is visible on the members page." : "Only you and admins can see your profile."}
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                </div>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                        name="full_name"
                        defaultValue={profile.full_name || ""}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                        placeholder="Your Name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input
                        name="location"
                        defaultValue={profile.location || ""}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                        placeholder="Kathmandu, Nepal"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Bio</label>
                    <textarea
                        name="bio"
                        defaultValue={profile.bio || ""}
                        rows={3}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                        placeholder="Tell us about yourself..."
                    />
                </div>
            </div>

            {/* Profession Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Professional Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Profession</label>
                        <input
                            type="text"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="Software Engineer"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Organization</label>
                        <input
                            type="text"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="Company Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Position/Title</label>
                        <input
                            type="text"
                            value={positionTitle}
                            onChange={(e) => setPositionTitle(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="Senior Developer"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info with Privacy Toggles */}
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700">Email</label>
                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showContactEmail}
                                    onChange={(e) => setShowContactEmail(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                />
                                Show publicly
                            </label>
                        </div>
                        <input
                            name="contact_email_public"
                            defaultValue={profile.contact_email_public || ""}
                            type="email"
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="contact@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700">Phone</label>
                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showContactPhone}
                                    onChange={(e) => setShowContactPhone(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                />
                                Show publicly
                            </label>
                        </div>
                        <input
                            name="contact_phone_public"
                            defaultValue={profile.contact_phone_public || ""}
                            type="tel"
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="+977 98..."
                        />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Social Links (Optional)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Linkedin size={14} /> LinkedIn
                        </label>
                        <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Globe size={14} /> Website
                        </label>
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                            placeholder="https://yoursite.com"
                        />
                    </div>
                </div>
            </div>

            {/* Expertise */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Areas of Expertise</label>
                <p className="text-xs text-slate-400">Separate with commas</p>
                <input
                    name="expertise"
                    defaultValue={profile.expertise?.join(", ") || ""}
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-400"
                    placeholder="Policy, Technology, Agriculture..."
                />
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading || Boolean(handle && handleAvailable === false)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
