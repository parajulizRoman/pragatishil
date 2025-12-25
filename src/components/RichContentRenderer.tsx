"use client";

import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

// Same theme as editor for consistent rendering
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

// Plugin to set read-only content
function SetContentPlugin({ content }: { content: string }) {
    const [editor] = useLexicalComposerContext();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded && content) {
            try {
                const parsed = JSON.parse(content);
                const editorState = editor.parseEditorState(parsed);
                editor.setEditorState(editorState);
                setLoaded(true);
            } catch {
                // Not JSON, treat as plain text
            }
        }
    }, [content, editor, loaded]);

    return null;
}

interface RichContentRendererProps {
    content: string; // JSON string from Lexical
    className?: string;
}

export default function RichContentRenderer({ content, className = "" }: RichContentRendererProps) {
    // Check if content is JSON (rich text) or plain text
    let isRichContent = false;
    try {
        const parsed = JSON.parse(content);
        isRichContent = parsed && typeof parsed === "object" && "root" in parsed;
    } catch {
        isRichContent = false;
    }

    // For plain text, just render as paragraphs
    if (!isRichContent) {
        return (
            <div className={`prose prose-sm max-w-none ${className}`}>
                {content.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">{line || "\u00A0"}</p>
                ))}
            </div>
        );
    }

    // For rich text, use Lexical to render
    const initialConfig = {
        namespace: "RichContentRenderer",
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
        editable: false, // Read-only mode
        onError: (error: Error) => console.error(error),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={className}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="outline-none prose prose-sm max-w-none" />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <SetContentPlugin content={content} />
            </div>
        </LexicalComposer>
    );
}
