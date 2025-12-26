/* eslint-disable */
"use client";

import { useState } from "react";
import { Trash2, Edit2, X, Check } from "lucide-react";
import { deleteContent, updateContent } from "@/app/commune/actions";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";

interface PostActionsProps {
    postId: string;
    postContent: string;
    isAuthor: boolean;
    onDelete?: () => void;
    onUpdate?: (newContent: string) => void;
}

export default function PostActions({ postId, postContent, isAuthor, onDelete, onUpdate }: PostActionsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(postContent);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isAuthor) return null;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
        setIsLoading(true);
        try {
            await deleteContent(postId, 'post');
            if (onDelete) onDelete();
        } catch (e: any) {
            setError(e.message || "An error occurred");
            alert("Error deleting post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (editValue.trim() === postContent) {
            setIsEditing(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await updateContent(postId, 'post', editValue);
            if (onUpdate) onUpdate(editValue);
            setIsEditing(false);
        } catch (e: any) {
            setError(e.message || "An error occurred");
            alert("Error updating post");
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="w-full mt-2 space-y-2">
                <div className="w-full mt-2 space-y-2 border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <RichTextEditor
                        initialContent={postContent}
                        onChange={setEditValue}
                        minHeight="100px"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="h-8"
                        >
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-8 bg-brand-blue hover:bg-brand-blue/90 text-white"
                        >
                            {isLoading ? "Saving..." : <><Check className="w-4 h-4 mr-1" /> Save</>}
                        </Button>
                    </div>
                    {error && <div className="text-destructive text-xs">{error}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2 text-slate-500 hover:text-brand-blue"
                title="Edit Post"
            >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Edit</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-7 px-2 text-slate-400 hover:text-destructive hover:bg-red-50"
                title="Delete Post"
            >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Delete</span>
            </Button>
        </div>
    );
}
