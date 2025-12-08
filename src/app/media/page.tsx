import { siteContent } from "@/config/siteContent";
/* eslint-disable @next/next/no-img-element */

export const metadata = {
    title: "Media Gallery | Pragatishil Loktantrik",
    description: "Watch videos and view photos from our recent campaigns.",
};

export default function MediaPage() {
    return (
        <main className="min-h-screen bg-white py-12 md:py-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Media Gallery</h1>
                    <p className="text-slate-600">Our journey in visuals</p>
                </div>

                {/* Videos Section */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-brand-blue pl-4">Video Interviews & Speeches</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {siteContent.videos.map((video) => (
                            <div key={video.id} className="group">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-slate-200 mb-3">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={video.url}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="group-hover:scale-105 transition-transform duration-500"
                                    ></iframe>
                                </div>
                                <h3 className="font-semibold text-slate-800 group-hover:text-brand-blue transition-colors">{video.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Photo Gallery Section */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-brand-red pl-4">Photo Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {siteContent.galleryImages.map((img) => (
                            <div key={img.id} className="relative group aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm cursor-pointer">
                                <img
                                    src={img.url}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-medium">{img.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
