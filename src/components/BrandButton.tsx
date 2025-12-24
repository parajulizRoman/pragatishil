import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from "react";

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "solid-blue" | "danger";
    href?: string; // If provided, renders as Link
    className?: string; // Additional classes
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export function BrandButton({
    variant = "primary",
    href,
    className = "",
    children,
    onClick,
    ...props
}: BrandButtonProps) {

    // Base styles
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Variant styles
    const variants = {
        primary: "bg-gradient-to-r from-brand-red to-brand-blue text-white hover:brightness-110 shadow-blue-900/20 hover:scale-105",
        secondary: "bg-transparent border-2 border-slate-400/30 hover:border-brand-blue/50 text-slate-700 hover:text-brand-blue hover:bg-blue-50/50",
        "solid-blue": "bg-brand-blue text-white hover:bg-blue-700 shadow-blue-200",
        danger: "bg-brand-red text-white hover:bg-red-700 shadow-red-200"
    };

    // Combined classes
    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link
                href={href}
                className={combinedClasses}
                onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
            >
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} onClick={onClick} {...props}>
            {children}
        </button>
    );
}
