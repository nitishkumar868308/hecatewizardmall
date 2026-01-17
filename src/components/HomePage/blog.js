"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Plus } from 'lucide-react';

const BlogPage = () => {
    const blogs = [
        {
            id: 1,
            date: "12.01.26",
            category: "Moon Phase",
            title: "How the New Moon in Capricorn Affects Your Ambition",
            excerpt: "The cosmic alignment this month brings a powerful surge in professional clarity. Discover how to harness this energy for long-term success.",
            img: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?q=80&w=800",
            size: "large"
        },
        {
            id: 2,
            date: "08.01.26",
            category: "Relationships",
            title: "Venus Retrograde: Healing Past Emotional Wounds",
            excerpt: "When the planet of love slows down, our hearts look backward.",
            img: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=800",
            size: "small"
        },
        {
            id: 3,
            date: "05.01.26",
            category: "Rituals",
            title: "5 Morning Rituals to Align Your Chakras",
            excerpt: "Start your day with intention. Simple 5-minute practices.",
            img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
            size: "small"
        },
        {
            id: 4,
            date: "02.01.26",
            category: "Astrology",
            title: "Mercury Transit: Communication in the Digital Age",
            excerpt: "Clear communication is key as Mercury moves through Aquarius. What you need to know about your tech and talk.",
            img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
            size: "large"
        }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-hidden">

            {/* --- Floating Background Text (Marquee) --- */}
            <div className="fixed top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none">
                <h1 className="text-[25vw] font-black leading-none whitespace-nowrap uppercase italic tracking-tighter">
                    Cosmic Journal Cosmic Journal
                </h1>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-24 relative z-10">

                {/* --- Header Section --- */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "80px" }}
                            className="h-[2px] bg-[#66FCF1] mb-6"
                        />
                        <h1 className="text-7xl md:text-[10rem] font-medium leading-[0.8] tracking-tighter uppercase">
                            The <br />
                            <span className="font-serif italic text-zinc-500">Journal</span>
                        </h1>
                    </div>

                    <div className="max-w-xs space-y-4">
                        <p className="text-[#66FCF1] text-[10px] font-bold tracking-[0.4em] uppercase">Curated Editorial</p>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed">
                            A sanctuary for modern mystics. Exploring the depths of astrology, wellness, and cosmic alignment.
                        </p>
                    </div>
                </header>

                {/* --- Bento-Style Asymmetric Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                    {blogs.map((blog, i) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`group cursor-pointer ${blog.size === "large" ? "md:col-span-8" : "md:col-span-4"
                                }`}
                        >
                            <div className="relative overflow-hidden rounded-sm bg-zinc-900 group">
                                {/* Image with Reveal Effect */}
                                <div className="aspect-[16/11] md:aspect-auto md:h-[500px] overflow-hidden">
                                    <img
                                        src={blog.img}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                </div>

                                {/* Floating Action Button */}
                                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20 translate-y-4 group-hover:translate-y-0">
                                    <ArrowUpRight className="text-white w-5 h-5" />
                                </div>

                                {/* Category Badge */}
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-[10px] bg-[#66FCF1] text-black font-black px-3 py-1.5 uppercase tracking-widest">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                                    <span>{blog.date}</span>
                                    <div className="w-4 h-[1px] bg-zinc-800" />
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} className="text-[#66FCF1]" />
                                        <span>5 MIN READ</span>
                                    </div>
                                </div>

                                <h3 className={`font-light leading-tight transition-all duration-500 group-hover:text-[#66FCF1] ${blog.size === "large" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                                    }`}>
                                    {blog.title}
                                </h3>

                                <p className="text-zinc-500 text-sm md:text-base font-light leading-relaxed line-clamp-2 max-w-2xl">
                                    {blog.excerpt}
                                </p>

                                <div className="pt-2 flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                                    <div className="h-[1px] w-8 bg-[#66FCF1] transition-all duration-500 group-hover:w-16" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Read More</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* --- Newsletter / Footer CTA --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10"
                >
                    <h2 className="text-4xl md:text-6xl font-serif italic text-zinc-500 text-center md:text-left">
                        Stay connected to <br /> the <span className="text-white not-italic font-sans font-bold">Cosmos.</span>
                    </h2>

                    <div className="flex w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="EMAIL ADDRESS"
                            className="bg-transparent border-b border-white/20 py-4 px-2 text-[10px] tracking-widest focus:outline-none focus:border-[#66FCF1] w-full md:w-64 transition-colors"
                        />
                        <button className="bg-[#66FCF1] text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">
                            Join
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* Global Custom CSS */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:italic&display=swap');
                
                ::selection {
                    background: #66FCF1;
                    color: #000;
                }
            `}</style>
        </div>
    );
};

export default BlogPage;