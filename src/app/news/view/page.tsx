import { fetchArticle } from "@/actions/fetchArticle";
import { BrandButton } from "@/components/BrandButton";
import Link from "next/link";

export default async function NewsViewPage({
    searchParams,
}: {
    searchParams: Promise<{ url: string }>;
}) {
    const { url } = await searchParams;

    if (!url) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">No article URL provided.</p>
                    <BrandButton href="/news">Back to News</BrandButton>
                </div>
            </div>
        );
    }

    const article = await fetchArticle(url);

    return (
        <main className="min-h-screen bg-white">
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <Link href="/" className="font-bold text-brand-blue text-xl">Pragatishil News Reader</Link>
                <BrandButton href="/news" variant="secondary" className="px-4 py-1.5 text-sm">Close</BrandButton>
            </nav>

            <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-4">
                        <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full text-sm font-semibold">
                            {article.source || "External Source"}
                        </span>
                        {article.date && <span className="text-gray-500 text-sm ml-3">{article.date}</span>}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    {article.image && (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-md">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-sm font-medium">
                            View Original Article &rarr;
                        </a>
                    </div>
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-blue prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </main>
    );
}
