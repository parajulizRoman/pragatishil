import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-32" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-8 h-8 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-24 rounded" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
