/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestAIPage() {
    const [chatInput, setChatInput] = useState("");
    const [chatReply, setChatReply] = useState<string | null>(null);
    const [visionResult, setVisionResult] = useState<unknown>(null);
    const [dbResult, setDbResult] = useState<unknown>(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [loadingVision, setLoadingVision] = useState(false);
    const [loadingDb, setLoadingDb] = useState(false);

    async function handleTestDb() {
        setLoadingDb(true);
        try {
            const supabase = createClient();
            // Just check if we can get the session (even if null, connection works)
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            setDbResult({ success: true, message: "Connected to Supabase", session: data.session ? "Active" : "None" });
        } catch (e) {
            setDbResult({ success: false, error: (e as Error).message });
        } finally {
            setLoadingDb(false);
        }
    }

    async function handleChat() {
        if (!chatInput.trim()) return;
        setLoadingChat(true);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Modified 'content' to 'text' to match the server API contract
                    messages: [{ role: "user", text: chatInput }],
                    locale: "ne",
                }),
            });
            const data = await res.json();
            setChatReply(data.reply ?? JSON.stringify(data));
        } catch (e) {
            setChatReply("Error: " + (e as Error).message);
        } finally {
            setLoadingChat(false);
        }
    }

    async function handleVision(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fileInput = (e.currentTarget.elements.namedItem("image") as HTMLInputElement);
        const file = fileInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoadingVision(true);
        try {
            const res = await fetch("/api/ai/vision/voter-id", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setVisionResult(data);
        } catch (e) {
            setVisionResult({ error: (e as Error).message });
        } finally {
            setLoadingVision(false);
        }
    }

    const [membershipResult, setMembershipResult] = useState<unknown>(null);
    const [loadingMembership, setLoadingMembership] = useState(false);

    async function handleTestMembership() {
        setLoadingMembership(true);
        try {
            // Sample request payload based on README
            const payload = {
                personal: {
                    capacity: "party_member",
                    fullNameNe: "परीक्षण प्रयोगकर्ता", // Test User in Nepali
                    dobOriginal: "2050-01-01",
                    dobCalendar: "BS",
                    gender: "male"
                },
                contact: {
                    phone: "9800000000",
                    email: `test-${Date.now()}@example.com`
                },
                party: {
                    motivationTextNe: "देश र जनताको सेवा गर्न चाहन्छु", // I want to serve country and people
                    departmentIds: [],
                    confidentiality: "public_ok"
                },
                documents: {
                    idDocument: {
                        docType: "citizenship",
                        imageUrl: "https://placehold.co/400x300.png" // Placeholder
                    }
                },
                meta: {
                    source: "test-ai-page"
                }
            };

            const res = await fetch("/api/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            setMembershipResult(data);
        } catch (e) {
            setMembershipResult({ error: (e as Error).message });
        } finally {
            setLoadingMembership(false);
        }
    }

    return (
        <main className="min-h-screen p-6 space-y-8">
            <section className="space-y-2">
                <h1 className="text-xl font-bold">Test AI Chat</h1>
                <div className="flex gap-2">
                    <input
                        className="form-input flex-1"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a question in Nepali..."
                    />
                    <button
                        onClick={handleChat}
                        disabled={loadingChat}
                        className="border px-3 py-1 bg-brand-blue text-white rounded disabled:bg-gray-400"
                    >
                        {loadingChat ? "Sending..." : "Send"}
                    </button>
                </div>
                {chatReply && (
                    <pre className="mt-2 whitespace-pre-wrap border p-2 text-sm bg-gray-100 text-slate-800">
                        {chatReply}
                    </pre>
                )}
            </section>

            <section className="space-y-2">
                <h1 className="text-xl font-bold">Test Voter ID Vision</h1>
                <form onSubmit={handleVision} className="space-y-2">
                    <input type="file" name="image" accept="image/*" />
                    <button
                        type="submit"
                        disabled={loadingVision}
                        className="border px-3 py-1 bg-brand-blue text-white rounded disabled:bg-gray-400"
                    >
                        {loadingVision ? "Scanning..." : "Upload & Scan"}
                    </button>
                </form>
                {!!visionResult && (
                    <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap border p-2 text-xs bg-gray-100 text-slate-800">
                        {JSON.stringify(visionResult as any, null, 2)}
                    </pre>
                )}
            </section>

            <section className="space-y-2 border-t pt-8">
                <h1 className="text-xl font-bold">Test Supabase Connection</h1>
                <button
                    onClick={handleTestDb}
                    disabled={loadingDb}
                    className="border px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400"
                >
                    {loadingDb ? "Connecting..." : "Test Connection"}
                </button>
                {!!dbResult && (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 text-slate-800">
                        {JSON.stringify(dbResult as any, null, 2)}
                    </pre>
                )}
            </section>

            <section className="space-y-2 border-t pt-8">
                <h1 className="text-xl font-bold">Test Membership API</h1>
                <p className="text-sm text-gray-600">Sends a sample membership application to /api/membership. Requires database tables to be created.</p>
                <button
                    onClick={handleTestMembership}
                    disabled={loadingMembership}
                    className="border px-3 py-1 bg-purple-600 text-white rounded disabled:bg-gray-400"
                >
                    {loadingMembership ? "Sending..." : "Create Test Member"}
                </button>
                {!!membershipResult && (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 text-slate-800">
                        {JSON.stringify(membershipResult as any, null, 2)}
                    </pre>
                )}
            </section>
        </main>
    );
}
