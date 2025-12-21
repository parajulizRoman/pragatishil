"use client";

import { Component, ReactNode } from "react";
import Navbar from "./Navbar";
import Link from "next/link";

class NavbarErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Navbar Error Boundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default function SafeNavbar() {
    return (
        <NavbarErrorBoundary
            fallback={
                <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex-shrink-0">
                            <span className="font-bold text-xl tracking-tight text-brand-red">
                                Pragatishil <span className="text-brand-blue">Loktantrik</span>
                            </span>
                        </Link>
                    </div>
                    <div className="text-sm text-red-500 font-medium">
                        Navigation Error (Check Console)
                    </div>
                </nav>
            }
        >
            <Navbar />
        </NavbarErrorBoundary>
    );
}
