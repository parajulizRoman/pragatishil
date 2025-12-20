import { cn } from "@/lib/utils";
import React, { ElementType } from "react";

type TypographyVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "list"
    | "lead"
    | "large"
    | "small"
    | "muted";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant;
    as?: ElementType;
}

export function Typography({
    className,
    variant = "p",
    as,
    ...props
}: TypographyProps) {
    const Component = as || defaultTags[variant];

    return (
        <Component
            className={cn(variantStyles[variant], className)}
            {...props}
        />
    );
}

const defaultTags: Record<TypographyVariant, ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    blockquote: "blockquote",
    list: "ul",
    lead: "p",
    large: "div",
    small: "small",
    muted: "p",
};

const variantStyles: Record<TypographyVariant, string> = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-brand-navy",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-brand-navy",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-brand-navy",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight text-brand-navy",
    p: "leading-7 [&:not(:first-child)]:mt-6 text-foreground/90",
    blockquote: "mt-6 border-l-2 pl-6 italic text-brand-muted",
    list: "my-6 ml-6 list-disc [&>li]:mt-2",
    lead: "text-xl text-brand-muted",
    large: "text-lg font-semibold text-brand-navy",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-brand-muted",
};
