"use client";

import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MentionUser {
    id: string;
    handle: string;
    name: string | null;
    avatar: string | null;
    role: string | null;
}

interface MentionAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    className?: string;
    minRows?: number;
    maxRows?: number;
    disabled?: boolean;
}

export interface MentionAutocompleteRef {
    focus: () => void;
    blur: () => void;
}

const PLACEHOLDERS = [
    "/placeholders/eye-red.svg",
    "/placeholders/eye-blue.svg",
];

/**
 * Textarea with @mention autocomplete support
 * Shows a dropdown when user types @ followed by characters
 */
const MentionAutocomplete = forwardRef<MentionAutocompleteRef, MentionAutocompleteProps>(
    ({ value, onChange, onKeyDown, placeholder, className, minRows = 2, maxRows = 6, disabled }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);

        const [showDropdown, setShowDropdown] = useState(false);
        const [users, setUsers] = useState<MentionUser[]>([]);
        const [loading, setLoading] = useState(false);
        const [selectedIndex, setSelectedIndex] = useState(0);
        const [mentionQuery, setMentionQuery] = useState("");
        const [mentionStart, setMentionStart] = useState(-1);

        // Expose focus/blur methods
        useImperativeHandle(ref, () => ({
            focus: () => textareaRef.current?.focus(),
            blur: () => textareaRef.current?.blur(),
        }));

        // Auto-resize textarea
        useEffect(() => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            textarea.style.height = "auto";
            const lineHeight = 24;
            const minHeight = minRows * lineHeight;
            const maxHeight = maxRows * lineHeight;
            const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
            textarea.style.height = `${newHeight}px`;
        }, [value, minRows, maxRows]);

        // Search users when mention query changes
        useEffect(() => {
            if (!mentionQuery || mentionQuery.length < 1) {
                setUsers([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const controller = new AbortController();

            const searchUsers = async () => {
                try {
                    const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}&limit=8`, {
                        signal: controller.signal
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUsers(data.users || []);
                    }
                } catch (e: unknown) {
                    if (e instanceof Error && e.name !== "AbortError") {
                        console.error("Mention search error:", e);
                    }
                } finally {
                    setLoading(false);
                }
            };

            // Debounce search
            const timeout = setTimeout(searchUsers, 150);

            return () => {
                controller.abort();
                clearTimeout(timeout);
            };
        }, [mentionQuery]);

        // Detect @ mention trigger
        const detectMention = useCallback((text: string, cursorPos: number) => {
            // Look backwards from cursor to find @
            let start = cursorPos - 1;
            while (start >= 0 && text[start] !== "@" && text[start] !== " " && text[start] !== "\n") {
                start--;
            }

            if (start >= 0 && text[start] === "@") {
                // Check if @ is at start or preceded by whitespace
                if (start === 0 || /\s/.test(text[start - 1])) {
                    const query = text.substring(start + 1, cursorPos);
                    // Only show if query is valid (letters, numbers, underscore)
                    if (/^[a-zA-Z0-9_]*$/.test(query)) {
                        setMentionStart(start);
                        setMentionQuery(query);
                        setShowDropdown(true);
                        setSelectedIndex(0);
                        return;
                    }
                }
            }

            // No valid mention found
            setShowDropdown(false);
            setMentionQuery("");
            setMentionStart(-1);
        }, []);

        // Handle text change
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            const cursorPos = e.target.selectionStart;
            onChange(newValue);
            detectMention(newValue, cursorPos);
        };

        // Handle selection and cursor movement
        const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
            const cursorPos = e.currentTarget.selectionStart;
            detectMention(value, cursorPos);
        };

        // Insert mention
        const insertMention = (user: MentionUser) => {
            if (mentionStart === -1) return;

            const before = value.substring(0, mentionStart);
            const cursorPos = textareaRef.current?.selectionStart || value.length;
            const after = value.substring(cursorPos);

            const mention = `@${user.handle} `;
            const newValue = before + mention + after;

            onChange(newValue);
            setShowDropdown(false);
            setMentionQuery("");
            setMentionStart(-1);

            // Focus and set cursor position after mention
            setTimeout(() => {
                if (textareaRef.current) {
                    const newPos = mentionStart + mention.length;
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(newPos, newPos);
                }
            }, 0);
        };

        // Handle keyboard navigation
        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (showDropdown && users.length > 0) {
                switch (e.key) {
                    case "ArrowDown":
                        e.preventDefault();
                        setSelectedIndex(prev => (prev + 1) % users.length);
                        return;
                    case "ArrowUp":
                        e.preventDefault();
                        setSelectedIndex(prev => (prev - 1 + users.length) % users.length);
                        return;
                    case "Enter":
                    case "Tab":
                        e.preventDefault();
                        insertMention(users[selectedIndex]);
                        return;
                    case "Escape":
                        e.preventDefault();
                        setShowDropdown(false);
                        return;
                }
            }

            onKeyDown?.(e);
        };

        // Close dropdown on click outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(e.target as Node) &&
                    textareaRef.current &&
                    !textareaRef.current.contains(e.target as Node)
                ) {
                    setShowDropdown(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full text-base p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none bg-white",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                    style={{ minHeight: `${minRows * 24}px` }}
                />

                {/* Mention Dropdown */}
                {showDropdown && (mentionQuery.length > 0 || loading) && (
                    <div
                        ref={dropdownRef}
                        className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                    >
                        {loading && users.length === 0 ? (
                            <div className="flex items-center justify-center p-4 text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                No users found for &ldquo;@{mentionQuery}&rdquo;
                            </div>
                        ) : (
                            <ul className="py-1">
                                {users.map((user, index) => {
                                    const placeholderIdx = user.id.charCodeAt(0) % PLACEHOLDERS.length;
                                    const avatar = user.avatar || PLACEHOLDERS[placeholderIdx];

                                    return (
                                        <li
                                            key={user.id}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                                                index === selectedIndex
                                                    ? "bg-brand-blue/10 text-brand-blue"
                                                    : "hover:bg-slate-50"
                                            )}
                                            onClick={() => insertMention(user)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                <Image
                                                    src={avatar}
                                                    alt={user.name || user.handle}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm text-slate-800 truncate">
                                                    {user.name || user.handle}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">
                                                    @{user.handle}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

MentionAutocomplete.displayName = "MentionAutocomplete";

export default MentionAutocomplete;
