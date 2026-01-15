"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from "react-redux";

const Section2 = () => {
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
        <section className="relative w-full h-[100vh] min-h-[650px] flex items-center justify-center bg-[#050505] overflow-hidden">

            {/* 1. Ultra-Large Background Text (Desktop Only) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={`bg-${index}`}
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        animate={{ opacity: 0.05, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="text-[25vw] font-black text-white uppercase leading-none whitespace-nowrap hidden lg:block"
                    >
                        {activeCat?.name || "Aura"}
                    </motion.h2>
                </AnimatePresence>
            </div>

            {/* 2. Main Layout Grid */}
            <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">

                {/* Left Content (Text) */}
                <div className="lg:col-span-6 px-8 md:px-16 lg:px-24 z-20 mt-20 lg:mt-0 order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 mb-8"
                    >
                        <span className="w-8 h-[1px] bg-blue-600"></span>
                        <span className="text-blue-500 uppercase tracking-[0.4em] text-[10px] font-black">
                            Aura Selection 2026
                        </span>
                    </motion.div>

                    <div className="relative overflow-hidden h-[150px] sm:h-[200px] md:h-[250px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ y: "100%" }}
                                animate={{ y: "0%" }}
                                exit={{ y: "-100%" }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0"
                            >
                                <h1 className="text-5xl sm:text-7xl lg:text-[6.5vw] text-white font-light leading-[0.9] tracking-tighter">
                                   
                                    <span className="font-serif italic text-gray-400">
                                        {activeCat?.name || "Minimalism"}
                                    </span>
                                </h1>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-8"
                    >
                        <button className="group relative px-10 py-4 bg-white rounded-full overflow-hidden transition-all duration-500 active:scale-95 shadow-xl shadow-white/5">
                            <span className="relative z-10 text-black text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
                                Explore Edition
                            </span>
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full"></div>
                        </button>

                        {/* Slide Counters */}
                        <div className="flex items-center gap-3">
                            <span className="text-white text-xs font-mono">0{index + 1}</span>
                            <div className="w-12 h-[1px] bg-white/20">
                                <motion.div
                                    key={index}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className="h-full bg-blue-600"
                                />
                            </div>
                            <span className="text-white/30 text-xs font-mono">0{subcategories?.length || 0}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Content (Visual) */}
                <div className="lg:col-span-6 h-[50vh] lg:h-[80vh] w-full relative order-1 lg:order-2 px-4 lg:px-0">
                    <div className="relative w-full h-full lg:rounded-l-[4rem] overflow-hidden group">

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ scale: 1.2, filter: "brightness(0)" }}
                                animate={{ scale: 1, filter: "brightness(1)" }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                                className="w-full h-full relative"
                            >
                                <Image
                                    src={activeCat?.image || "/placeholder.jpg"}
                                    alt={activeCat?.name}
                                    fill
                                    className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                                    priority
                                />
                                {/* Modern Glass Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#050505]/80 lg:to-transparent"></div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl hidden md:block"
                        >
                            <p className="text-white/50 text-[9px] uppercase tracking-widest mb-1 font-bold">Category Details</p>
                            <h3 className="text-white text-xl font-serif italic">{activeCat?.name}</h3>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Global Progress */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
                <motion.div
                    key={`progress-${index}`}
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="w-full h-full bg-blue-600 shadow-[0_0_15px_#2563eb]"
                />
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    section { height: 100vh; }
                }
            `}</style>
        </section>
    );
};

export default Section2;