"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

// Types for geo data
interface GeoProvince {
    id: number;
    name_en: string;
    districts: GeoDistrict[];
}

interface GeoDistrict {
    id: number;
    name_en: string;
    localLevels: GeoLocalLevel[];
}

interface GeoLocalLevel {
    id: number;
    name_en: string;
    category_label?: string;
}

interface GeoFilterProps {
    selectedProvince: number | null;
    selectedDistrict: number | null;
    selectedLocalLevel: number | null;
    onProvinceChange: (id: number | null) => void;
    onDistrictChange: (id: number | null) => void;
    onLocalLevelChange: (id: number | null) => void;
}

export default function GeoFilter({
    selectedProvince,
    selectedDistrict,
    selectedLocalLevel,
    onProvinceChange,
    onDistrictChange,
    onLocalLevelChange,
}: GeoFilterProps) {
    const [provinces, setProvinces] = useState<GeoProvince[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch geo structure from API on mount
    useEffect(() => {
        const fetchGeo = async () => {
            try {
                const res = await fetch("/api/geo/structure");
                if (!res.ok) throw new Error("Failed to fetch geo data");
                const data = await res.json();
                setProvinces(data.provinces || []);
            } catch (error) {
                console.error("Failed to load geo data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGeo();
    }, []);

    // Get filtered districts based on selected province
    const districts: GeoDistrict[] = selectedProvince
        ? provinces.find(p => p.id === selectedProvince)?.districts || []
        : [];

    // Get filtered local levels based on selected district
    const localLevels: GeoLocalLevel[] = selectedDistrict
        ? districts.find(d => d.id === selectedDistrict)?.localLevels || []
        : [];

    // Handle province change - reset district and local level
    const handleProvinceChange = (value: string) => {
        const id = value ? parseInt(value) : null;
        onProvinceChange(id);
        onDistrictChange(null);
        onLocalLevelChange(null);
    };

    // Handle district change - reset local level
    const handleDistrictChange = (value: string) => {
        const id = value ? parseInt(value) : null;
        onDistrictChange(id);
        onLocalLevelChange(null);
    };

    const handleLocalLevelChange = (value: string) => {
        const id = value ? parseInt(value) : null;
        onLocalLevelChange(id);
    };

    if (loading) {
        return (
            <div className="flex gap-2">
                <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3">
            {/* Province Dropdown */}
            <div className="relative">
                <select
                    value={selectedProvince?.toString() || ""}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-9 text-sm text-slate-700 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue cursor-pointer"
                >
                    <option value="">All Provinces</option>
                    {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                            {province.name_en}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* District Dropdown */}
            <div className="relative">
                <select
                    value={selectedDistrict?.toString() || ""}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!selectedProvince}
                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-9 text-sm text-slate-700 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">All Districts</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name_en}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Local Level Dropdown */}
            <div className="relative">
                <select
                    value={selectedLocalLevel?.toString() || ""}
                    onChange={(e) => handleLocalLevelChange(e.target.value)}
                    disabled={!selectedDistrict}
                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-9 text-sm text-slate-700 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">All Local Levels</option>
                    {localLevels.map((ll) => (
                        <option key={ll.id} value={ll.id}>
                            {ll.name_en} {ll.category_label ? `(${ll.category_label})` : ""}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}
