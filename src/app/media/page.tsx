import MediaContent from "./MediaContent";

export const metadata = {
    title: "Media Center | Pragatishil Loktantrik Party",
    description: "Explore our media gallery, press releases, video interviews, and latest news coverage.",
};

export default function MediaPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 py-12 md:py-20">
            <MediaContent />
        </main>
    );
}
