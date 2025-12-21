import { createClient } from "@/lib/supabase/server";
import { siteContent } from "@/config/siteContent";
import ContactForm from "./ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "सम्पर्क | Contact | प्रगतिशील लोकतान्त्रिक पार्टी",
    description: "Contact Pragatishil Loktantrik Party - Get in touch with us for inquiries, collaboration, or joining the movement.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    const supabase = await createClient();

    // Fetch global settings from DB
    const { data: globalData } = await supabase
        .from('site_settings')
        .select('content')
        .eq('key', 'global')
        .single();

    // Use DB settings if available, fallback to static content
    const contact = globalData?.content?.contact || siteContent.contact;
    const social = globalData?.content?.social || siteContent.social;

    return <ContactForm contact={contact} social={social} />;
}
