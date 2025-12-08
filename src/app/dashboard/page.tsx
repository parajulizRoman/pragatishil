import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/join");
    }

    return (
        <main className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-xxl mx-auto bg-white p-8 rounded-xl shadow border border-slate-200">
                <h1 className="text-3xl font-bold mb-4 text-slate-800">Member Dashboard</h1>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <p className="text-lg text-blue-900">
                        Welcome, <span className="font-bold">{user.user_metadata?.full_name || user.email}</span>
                    </p>
                    <p className="text-sm text-blue-700 mt-1">{user.email}</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Your Membership Status</h2>
                    <p className="text-slate-600">
                        You are currently logged in. If you haven&apos;t submitted your membership application yet,
                        please proceed to the <Link href="/join" className="text-brand-blue hover:underline">Membership Form</Link>.
                    </p>

                    {/* Future: Display membership status from 'members' table if linked */}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <form action="/auth/signout" method="post">
                        {/* We would need a signout route or client component for this. 
                            For now just a placeholder link to home. 
                        */}
                        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">Return Home</Link>
                    </form>
                </div>
            </div>
        </main>
    );
}
