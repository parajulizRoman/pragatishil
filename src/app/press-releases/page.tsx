import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import PressReleasesClient from "./PressReleasesClient";

export const metadata: Metadata = {
    title: "प्रेस विज्ञप्ति | Press Releases | प्रगतिशील लोकतान्त्रिक पार्टी",
    description: "Official press releases, statements, and documents from Pragatishil Loktantrik Party (Progressive Democratic Party) Nepal. Download official party statements and declarations.",
    keywords: ["press release", "official statement", "pragatishil", "प्रगतिशील", "प्रेस विज्ञप्ति", "nepal politics", "party statement"],
    openGraph: {
        title: "Press Releases | प्रगतिशील लोकतान्त्रिक पार्टी",
        description: "Official press releases and statements from Pragatishil Loktantrik Party",
        type: "website",
    }
};

export const dynamic = "force-dynamic";

export default async function PressReleasesPage() {
    const supabase = await createClient();

    const { data: documents } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('media_type', 'document')
        .order('created_at', { ascending: false });

    return <PressReleasesClient documents={documents || []} />;
}
