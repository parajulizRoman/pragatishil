import { getSiteSettings } from "@/lib/dynamicContent";
import { siteContent } from "@/config/siteContent";
import HomeClient from "@/components/HomeClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic'; // Ensure we get fresh data

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Global/Page Settings
  // If DB is empty, 'global' key lookup returns undefined from staticContent.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalData = await getSiteSettings<any>('global');

  if (!globalData) {
    // Construct fallback from individual static parts
    globalData = {
      nav: siteContent.nav,
      contact: siteContent.contact,
      footer: siteContent.footer,
      social: siteContent.social
    };
  }

  const [hero, vision] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSiteSettings<any>('hero'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSiteSettings<any>('vision')
  ]);

  // Combine into one content object matching SiteSettings interface
  // globalData contains { nav, contact, social, footer }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any = {
    hero,
    vision,
    nav: globalData?.nav,
    contact: globalData?.contact,
    social: globalData?.social,
    footer: globalData?.footer
  };

  // 2. Fetch News - support both new 'status' field and legacy 'is_published' field
  const { data: newsItems } = await supabase
    .from('news_items')
    .select('*')
    .or('status.eq.published,is_published.eq.true')
    .order('date', { ascending: false })
    .limit(3);

  // 3. Fetch Videos
  const { data: videos } = await supabase
    .from('media_gallery')
    .select('*')
    .eq('media_type', 'video')
    .limit(3);

  // 4. Fetch Documents (Press Releases)
  const { data: documents } = await supabase
    .from('media_gallery')
    .select('*')
    .eq('media_type', 'document')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <HomeClient
      content={content}
      news={newsItems || []}
      videos={videos || []}
      documents={documents || []}
    />
  );
}

