"use client";

import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $createTextNode,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    LexicalEditor,
} from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { Sparkles, Loader2, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Editor theme
const theme = {
    paragraph: "mb-2",
    heading: {
        h1: "text-2xl font-bold mb-3 text-brand-navy",
        h2: "text-xl font-bold mb-2 text-brand-navy",
        h3: "text-lg font-semibold mb-2 text-brand-navy",
    },
    list: {
        ul: "list-disc ml-4 mb-2",
        ol: "list-decimal ml-4 mb-2",
        listitem: "mb-1",
    },
    quote: "border-l-4 border-brand-blue pl-4 italic text-slate-600 mb-2",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        code: "bg-slate-100 px-1 rounded font-mono text-sm",
    },
    link: "text-brand-blue underline hover:text-brand-navy",
    code: "bg-slate-100 p-3 rounded-lg font-mono text-sm mb-2 block overflow-x-auto",
};

// Toolbar component
function ToolbarPlugin({ onAIFormat, isFormatting }: { onAIFormat: () => void; isFormatting: boolean }) {
    const [editor] = useLexicalComposerContext();
    const { t } = useLanguage();

    const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    const formatStrikethrough = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");

    const insertList = () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    const insertOrderedList = () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);

    const alignLeft = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    const alignCenter = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    const alignRight = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");

    const formatHeading = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
        });
    };

    const btnClass = "p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors";
    const separatorClass = "w-px h-6 bg-slate-200 mx-1";

    return (
        <div className="flex items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg flex-wrap">
            {/* Text formatting */}
            <button type="button" onClick={formatBold} className={btnClass} title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={formatItalic} className={btnClass} title="Italic"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={formatUnderline} className={btnClass} title="Underline"><Underline className="w-4 h-4" /></button>
            <button type="button" onClick={formatStrikethrough} className={btnClass} title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>

            <div className={separatorClass} />

            {/* Heading */}
            <button type="button" onClick={formatHeading} className={btnClass} title="Heading"><Heading2 className="w-4 h-4" /></button>

            <div className={separatorClass} />

            {/* Lists */}
            <button type="button" onClick={insertList} className={btnClass} title="Bullet List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={insertOrderedList} className={btnClass} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>

            <div className={separatorClass} />

            {/* Alignment */}
            <button type="button" onClick={alignLeft} className={btnClass} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
            <button type="button" onClick={alignCenter} className={btnClass} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
            <button type="button" onClick={alignRight} className={btnClass} title="Align Right"><AlignRight className="w-4 h-4" /></button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* AI Format Button */}
            <button
                type="button"
                onClick={onAIFormat}
                disabled={isFormatting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-sm"
            >
                {isFormatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {t("AI फर्म्याट", "AI Format")}
            </button>
        </div>
    );
}

// Get content plugin
function GetContentPlugin({ onContentChange }: { onContentChange: (json: string, text: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const json = JSON.stringify(editorState.toJSON());
                const text = editorState.read(() => {
                    const root = editorState._nodeMap.get("root");
                    return root?.getTextContent() || "";
                });
                onContentChange(json, text);
            });
        });
    }, [editor, onContentChange]);

    return null;
}

// Set content plugin
function SetContentPlugin({ content }: { content: string | null }) {
    const [editor] = useLexicalComposerContext();
    const [isFirst, setIsFirst] = useState(true);

    useEffect(() => {
        if (content && isFirst) {
            try {
                const parsed = JSON.parse(content);
                const editorState = editor.parseEditorState(parsed);
                editor.setEditorState(editorState);
                setIsFirst(false);
            } catch {
                // Content is not JSON, treat as plain text - will be empty
            }
        }
    }, [content, editor, isFirst]);

    return null;
}

interface RichTextEditorProps {
    initialContent?: string;
    onChange?: (json: string, plainText: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export default function RichTextEditor({
    initialContent,
    onChange,
    placeholder = "Start writing...",
    minHeight = "200px",
}: RichTextEditorProps) {
    const { t } = useLanguage();
    const [isFormatting, setIsFormatting] = useState(false);
    const [editorRef, setEditorRef] = useState<LexicalEditor | null>(null);

    const initialConfig = {
        namespace: "RichTextEditor",
        theme,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            AutoLinkNode,
            CodeNode,
            CodeHighlightNode,
        ],
        onError: (error: Error) => console.error(error),
    };

    const handleContentChange = (json: string, text: string) => {
        if (onChange) {
            onChange(json, text);
        }
    };

    const handleAIFormat = async () => {
        if (!editorRef) return;

        setIsFormatting(true);
        try {
            // Get current plain text
            let currentText = "";
            editorRef.getEditorState().read(() => {
                currentText = $getRoot().getTextContent();
            });

            if (!currentText.trim()) {
                alert(t("कृपया पहिले केही लेख्नुहोस्", "Please write something first"));
                return;
            }

            // Call AI format API
            const res = await fetch("/api/ai/format-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: currentText }),
            });

            if (!res.ok) throw new Error("Failed to format");

            const { formatted } = await res.json();

            // Update editor with formatted content using proper Lexical APIs
            editorRef.update(() => {
                const root = $getRoot();
                root.clear();
                // Insert formatted text as paragraphs
                const lines = formatted.split("\n");
                lines.forEach((line: string) => {
                    if (line.trim()) {
                        const paragraph = $createParagraphNode();
                        paragraph.append($createTextNode(line));
                        root.append(paragraph);
                    }
                });
            });

        } catch (err) {
            console.error("AI format error:", err);
            alert(t("AI फर्म्याट असफल भयो", "AI formatting failed"));
        } finally {
            setIsFormatting(false);
        }
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <ToolbarPlugin onAIFormat={handleAIFormat} isFormatting={isFormatting} />
                <div className="relative" style={{ minHeight }}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="outline-none p-4 prose prose-sm max-w-none min-h-[inherit]"
                                style={{ minHeight }}
                            />
                        }
                        placeholder={
                            <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <HistoryPlugin />
                <ListPlugin />
                <LinkPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                <GetContentPlugin onContentChange={handleContentChange} />
                {initialContent && <SetContentPlugin content={initialContent} />}
                {/* Store editor ref */}
                <EditorRefPlugin setEditorRef={setEditorRef} />
            </div>
        </LexicalComposer>
    );
}

// Helper plugin to expose editor ref
function EditorRefPlugin({ setEditorRef }: { setEditorRef: (editor: LexicalEditor) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        setEditorRef(editor);
    }, [editor, setEditorRef]);
    return null;
}
