"use client";
import React from 'react';
import { motion } from 'framer-motion';

const BlogPage = () => {
    const blogs = [
        {
            id: 1,
            date: "Jan 12, 2026",
            category: "Moon Phase",
            title: "How the New Moon in Capricorn Affects Your Ambition",
            excerpt: "The cosmic alignment this month brings a powerful surge in professional clarity. Discover how to harness this energy...",
            img: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?q=80&w=800"
        },
        {
            id: 2,
            date: "Jan 08, 2026",
            category: "Relationships",
            title: "Venus Retrograde: Healing Past Emotional Wounds",
            excerpt: "When the planet of love slows down, our hearts look backward. A guide to navigating relationship shadows...",
            img: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=800"
        },
        {
            id: 3,
            date: "Jan 05, 2026",
            category: "Rituals",
            title: "5 Morning Rituals to Align Your Chakras",
            excerpt: "Start your day with intention. These simple 5-minute practices will shift your vibration for the entire day...",
            img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800"
        },
        {
            id: 4,
            date: "Jan 02, 2026",
            category: "Astrology",
            title: "Mercury Transit: Communication in the Digital Age",
            excerpt: "Clear communication is key as Mercury moves through Aquarius. What you need to know about your tech and talk...",
            img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
        }
    ];

    return (
        <div className="bg-[#080808] min-h-screen text-white pt-28 pb-20 px-6">
            <div className="max-w-[1300px] mx-auto">

                {/* Header Section */}
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Journal</span>
                            <h1 className="text-6xl md:text-9xl font-light tracking-tighter leading-none uppercase">
                                Cosmic <br /> <span className="font-serif italic text-zinc-600">Insights</span>
                            </h1>
                        </div>
                        <p className="max-w-[300px] text-zinc-500 text-sm font-light leading-relaxed">
                            Explore the intersection of ancient wisdom and modern living through our curated editorial.
                        </p>
                    </motion.div>
                    <div className="w-full h-[1px] bg-white/10 mt-12" />
                </header>

                {/* Featured Post (Big Impact) */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="group relative h-[60vh] md:h-[80vh] w-full mb-24 overflow-hidden rounded-3xl cursor-pointer"
                >
                    <img
                        src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        alt="Featured"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-[70%]">
                        <span className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 mb-6 inline-block">Featured Reading</span>
                        <h2 className="text-3xl md:text-6xl font-light tracking-tight mb-4 group-hover:text-zinc-300 transition-colors">
                            The Great Conjunction: Why 2026 is the year of Spiritual Awakening.
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-lg font-light line-clamp-2">
                            Ancient prophecies and modern astronomy collide this year, creating a unique window for personal transformation.
                        </p>
                    </div>
                </motion.section>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16 md:gap-x-20 md:gap-y-32">
                    {blogs.map((blog, i) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-8 bg-zinc-900">
                                <img
                                    src={blog.img}
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    alt={blog.title}
                                />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-3 py-1 uppercase tracking-widest">{blog.category}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                    <span>{blog.date}</span>
                                    <div className="w-8 h-[1px] bg-zinc-800" />
                                    <span>5 Min Read</span>
                                </div>
                                <h3 className="text-2xl md:text-4xl font-light tracking-tight leading-tight group-hover:text-zinc-400 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-zinc-500 text-sm md:text-base font-light leading-relaxed line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <div className="pt-4 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden">
                                    <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:translate-x-[-105%] group-hover:after:translate-x-0 after:transition-transform after:duration-500">
                                        Read Article
                                    </span>
                                    <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-32 flex justify-center">
                    <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-white hover:text-black transition-all duration-500">
                        Show More Insights
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BlogPage;