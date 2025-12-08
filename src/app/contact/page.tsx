"use client";

import { siteContent } from "@/config/siteContent";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, we would send data to API here.
    };

    return (
        <main className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* Left: Contact Info */}
                    <div className="w-full md:w-1/3 bg-gradient-to-b from-brand-red/90 to-brand-blue/90 text-white p-10 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Address</label>
                                    <p className="text-lg">{siteContent.contact.address}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Email</label>
                                    <p className="text-lg text-blue-300">{siteContent.contact.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Phone</label>
                                    <p className="text-lg">{siteContent.contact.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                {siteContent.social.map((social) => (
                                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors">
                                        <span className="text-xl font-bold text-white">{social.name[0]}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="w-full md:w-2/3 p-10">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-xl border border-green-100">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-green-800 mb-2">Message Received!</h2>
                                <p className="text-green-700">Thank you for contacting us. We will get back to you soon.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-green-600 underline hover:text-green-800">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                            <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                            <input required type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea required rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
                                    </div>
                                    <button type="submit" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                                        Send Message
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
