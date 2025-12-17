"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Edit2, X, Check } from "lucide-react";
import { deleteContent, updateContent } from "@/app/commune/actions";

interface PostActionsProps {
    postId: string;
    postContent: string;
    isAuthor: boolean;
    onDelete?: () => void;
    onUpdate?: (newContent: string) => void;
}

export default function PostActions({ postId, postContent, isAuthor, onDelete, onUpdate }: PostActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(postContent);
    const [isLoading, setIsLoading] = useState(false);

    if (!isAuthor) return null;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
        setIsLoading(true);
        try {
            await deleteContent(postId, 'post');
            if (onDelete) onDelete();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    const handleSave = async () => {
        if (editValue.trim() === postContent) {
            setIsEditing(false);
            return;
        }
        setIsLoading(true);
        try {
            await updateContent(postId, 'post', editValue);
            if (onUpdate) onUpdate(editValue);
            setIsEditing(false);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    if (isEditing) {
        return (
            <div className="w-full mt-2">
                <textarea
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-blue outline-none text-slate-800"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 flex items-center text-slate-600 hover:bg-slate-100 rounded text-sm"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-1" /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 flex items-center bg-brand-blue text-white rounded hover:bg-blue-700 text-sm"
                        disabled={isLoading}
                    >
                        <Check className="w-4 h-4 mr-1" /> Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-blue transition-colors px-2 py-1 rounded hover:bg-slate-100"
                title="Edit Post"
            >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
            </button>
            <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                title="Delete Post"
            >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
            </button>
        </div>
    );
}
