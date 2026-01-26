"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


const Section2 = () => {
    const router = useRouter();
    const { subcategories } = useSelector((state) => state.subcategory);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (subcategories?.length > 0) {
            const timer = setInterval(() => {
                setIndex((prev) => (prev + 1) % subcategories.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [subcategories]);

    const activeCat = subcategories?.[index];

    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center bg-[#050505] overflow-hidden px-4 md:px-10">

            {/* 1. Background Text (Re-sized & Balanced) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={`bg-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.03, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1 }}
                        className="text-[8vw] font-black text-white uppercase leading-none hidden lg:block tracking-tighter"
                    >
                        {activeCat?.name || "AD-TOLOGY"}
                    </motion.h2>
                </AnimatePresence>
            </div>

            {/* 2. Content Grid */}
            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Left Side: Text Details */}
                <div className="order-2 lg:order-1 space-y-8">
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <span className="text-[#66FCF1] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
                                    Featured SubCategory
                                </span>
                                <h1 className="text-4xl md:text-7xl lg:text-7xl font-black text-white leading-tight uppercase italic">
                                    {activeCat?.name}
                                </h1>
                                {/* <p className="text-gray-400 max-w-md mt-4 text-sm md:text-base leading-relaxed">
                                    Discover the next generation of creative excellence through our {activeCat?.name} collection.
                                </p> */}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                        <button
                            onClick={() => {
                                if (!activeCat?.name || !activeCat?.category?.name) return;

                                router.push(
                                    `/categories?category=${encodeURIComponent(
                                        activeCat.category.name
                                    )}&subcategory=${encodeURIComponent(activeCat.name)}`
                                );
                            }}
                            className="px-8 py-3 bg-[#66FCF1] text-black font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white transition-all active:scale-95"
                        >
                            Explore Now
                        </button>


                        {/* Slide Indicator */}
                        <div className="flex flex-col">
                            <span className="text-white font-mono text-xs">0{index + 1} / 0{subcategories?.length}</span>
                            <div className="w-24 h-[2px] bg-white/10 mt-2 relative">
                                <motion.div
                                    key={index}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className="absolute inset-0 bg-[#66FCF1]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image (No Cut - Contain Strategy) */}
                <div className="order-1 lg:order-2 flex justify-center items-center">
                    <div className="relative w-full aspect-square md:aspect-[4/5] max-h-[70vh] group">

                        {/* Decorative Frame */}
                        <div className="absolute inset-0 border border-white/10 rounded-[2rem] -m-4 group-hover:border-[#66FCF1]/30 transition-colors duration-500" />

                        <div className="relative w-full h-full overflow-hidden rounded-[2rem] bg-zinc-900/50 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative w-full h-full p-4" // Padding ensures image doesn't touch borders
                                >
                                    <Image
                                        src={activeCat?.image || "/placeholder.jpg"}
                                        alt={activeCat?.name}
                                        fill
                                        className="object-contain p-2 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" // Use object-contain here
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Inner Shadows for Depth */}
                            <div className="absolute inset-0 pointer-events-none shadow-inner bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Tagline Badge */}
                        <motion.div
                            className="absolute -bottom-5 -right-5 bg-white p-4 rounded-2xl hidden md:block shadow-2xl"
                            initial={{ rotate: 10, opacity: 0 }}
                            animate={{ rotate: -5, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {/* <p className="text-black font-black text-[10px] uppercase tracking-tighter italic">Studio Quality</p> */}
                        </motion.div>
                    </div>
                </div>

            </div>

            {/* Background Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66FCF1]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default Section2;