// BlogPage.jsx
"use client"
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { fetchBlogs } from "@/app/redux/slices/blog/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';

const BlogPage = () => {
    const dispatch = useDispatch();
    const { blogs } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    // Only show active blogs
    const activeBlogs = blogs.filter(blog => blog.active).slice(0, 3);

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-hidden">

            {/* --- Floating Background Text (Marquee) --- */}
            {/* <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 0 }}>
                <h1
                    className="text-[8vw] font-black leading-none uppercase italic tracking-tighter"
                    style={{ color: "#ffffff", opacity: 0.1 }}
                >
                    Hecate Wizard Mall
                </h1>
            </div> */}



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
                            <span className="font-serif italic text-zinc-500">Blogs</span>
                        </h1>
                    </div>

                    {/* <div className="max-w-xs space-y-4">
                        <p className="text-[#66FCF1] text-[10px] font-bold tracking-[0.4em] uppercase">Curated Editorial</p>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed">
                            A sanctuary for modern mystics. Exploring the depths of astrology, wellness, and cosmic alignment.
                        </p>
                    </div> */}
                </header>

                {/* --- Bento-Style Asymmetric Grid --- */}
                {activeBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
                        {activeBlogs.map((blog, i) => (
                            <motion.article
                                key={blog.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`group cursor-pointer ${blog.size === "large" ? "md:col-span-8" : "md:col-span-4"}`}
                            >
                                <Link href={`/blog/${blog.slug}`} className="block">
                                    <div className="relative overflow-hidden rounded-sm bg-zinc-900 group">
                                        {/* Image with Reveal Effect */}
                                        <div className="aspect-[16/11] md:aspect-auto md:h-[500px] overflow-hidden">
                                            <img
                                                src={blog.image} // note: blog.img changed to blog.image
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
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            <div className="w-4 h-[1px] bg-zinc-800" />
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} className="text-[#66FCF1]" />
                                                <span><span>{blog.readTime}</span> MIN READ</span>
                                            </div>
                                        </div>

                                        <h3 className={`font-light leading-tight transition-all duration-500 group-hover:text-[#66FCF1] ${blog.size === "large" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
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
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 text-xl md:text-2xl mt-32">
                        No active blogs available right now.
                    </div>
                )}

                {/* --- Explore More Button --- */}
                <div className="mt-10 flex justify-center">
                    <Link href="/blog">
                        <motion.button
                            whileHover={{ scale: 1.05, letterSpacing: "0.4em" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-14 py-4 border border-[#66FCF1]/60 text-[#66FCF1] text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#66FCF1] hover:text-black transition-all shadow-[0_0_20px_rgba(102,252,241,0.15)]"
                        >
                            Explore More
                        </motion.button>
                    </Link>
                </div>

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
