"use client";

import { useState, useEffect } from "react";
import { getAIPrompts, updateAIPrompt, AIPrompt } from "@/actions/ai-prompts";
import { Bot, Save, RotateCcw, AlertCircle, CheckCircle2, Edit2, X } from "lucide-react";

export default function AIPromptsPage() {
    const [prompts, setPrompts] = useState<AIPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedPrompt, setEditedPrompt] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        setLoading(true);
        setError(null);
        const { prompts: data, error: err } = await getAIPrompts();
        if (err) {
            setError(err);
        } else {
            setPrompts(data || []);
        }
        setLoading(false);
    };

    const startEditing = (prompt: AIPrompt) => {
        setEditingId(prompt.id);
        setEditedPrompt(prompt.prompt);
        setSuccessMessage(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditedPrompt("");
    };

    const savePrompt = async (id: string) => {
        setSaving(true);
        setError(null);

        const { success, error: err } = await updateAIPrompt(id, { prompt: editedPrompt });

        if (err) {
            setError(err);
        } else if (success) {
            setSuccessMessage("Prompt saved successfully!");
            setEditingId(null);
            await loadPrompts();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        setSaving(false);
    };

    const revertPrompt = () => {
        const original = prompts.find(p => p.id === editingId);
        if (original) {
            setEditedPrompt(original.prompt);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                <span className="ml-3 text-slate-600">Loading prompts...</span>
            </div>
        );
    }

    if (error && prompts.length === 0) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Bot className="h-8 w-8 text-brand-blue" />
                    <h1 className="text-2xl font-bold text-slate-900">AI Prompt Management</h1>
                </div>
                <p className="text-slate-600">
                    Edit AI prompts to customize translation and content generation behavior.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                </div>
            )}

            {/* Prompts List */}
            <div className="space-y-6">
                {prompts.map((prompt) => (
                    <div
                        key={prompt.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        {/* Prompt Header */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">{prompt.name}</h3>
                                <p className="text-sm text-slate-500">
                                    Key: <code className="bg-slate-200 px-2 py-0.5 rounded text-xs">{prompt.key}</code>
                                    {prompt.variables.length > 0 && (
                                        <span className="ml-3">
                                            Variables: {prompt.variables.map(v => (
                                                <code key={v} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mx-1">
                                                    {`{{${v}}}`}
                                                </code>
                                            ))}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${prompt.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {prompt.is_active ? "Active" : "Inactive"}
                                </span>
                                {editingId !== prompt.id ? (
                                    <button
                                        onClick={() => startEditing(prompt)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition text-sm"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={cancelEditing}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition text-sm"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Prompt Content */}
                        <div className="p-6">
                            {prompt.description && (
                                <p className="text-sm text-slate-600 mb-4 italic">{prompt.description}</p>
                            )}

                            {editingId === prompt.id ? (
                                /* Edit Mode */
                                <div className="space-y-4">
                                    <textarea
                                        value={editedPrompt}
                                        onChange={(e) => setEditedPrompt(e.target.value)}
                                        className="w-full h-[500px] p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-y"
                                        placeholder="Enter prompt..."
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => savePrompt(prompt.id)}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={revertPrompt}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                                        >
                                            <RotateCcw size={16} />
                                            Revert
                                        </button>
                                        <span className="text-sm text-slate-500 ml-auto">
                                            {editedPrompt.length} characters
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto border border-slate-200">
                                    {prompt.prompt.length > 1000
                                        ? prompt.prompt.substring(0, 1000) + "\n\n... (click Edit to see full prompt)"
                                        : prompt.prompt
                                    }
                                </pre>
                            )}

                            {/* Metadata */}
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                                Last updated: {new Date(prompt.updated_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {prompts.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <Bot className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-slate-600">No AI prompts found. Run the database migration to seed default prompts.</p>
                </div>
            )}
        </div>
    );
}
