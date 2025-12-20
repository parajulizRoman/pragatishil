import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48" />

            {/* Veto Card Skeleton */}
            <div className="p-6 rounded-2xl border-2 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-4">
                    <Skeleton className="p-3 w-14 h-14 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>

            {/* Council List Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="divide-y divide-slate-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="w-10 h-10 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning Skeleton */}
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
    );
}
