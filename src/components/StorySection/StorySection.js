"use client";
import React, { useState, useEffect } from "react";
import { fetchVideos } from "@/app/redux/slices/videoStory/videoStorySlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const StorySection = () => {
    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.videoStory);
    const [activeStory, setActiveStory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);

    const openModal = (story) => {
        setActiveStory(story);
        setModalOpen(true);
    };

    const closeModal = () => {
        setActiveStory(null);
        setModalOpen(false);
    };

    const activeVideos = videos.filter((video) => video.active);

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight dark:text-white">
                        Exclusive <span className="font-serif italic text-blue-600">Stories</span>
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scroll to explore</span>
                </div>

                {/* Stories Container */}
                <div className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x">
                    {activeVideos.map((story) => (
                        <motion.div
                            key={story.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center flex-shrink-0 snap-start"
                        >
                            {/* Story Ring - Pure CSS Gradient */}
                            <div
                                className="relative p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 cursor-pointer"
                                onClick={() => openModal(story)}
                            >
                                <div className="bg-white dark:bg-[#0a0a0a] p-[2px] rounded-full">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden relative">
                                        <video
                                            src={story.url}
                                            className="w-full h-full object-cover brightness-90 group-hover:brightness-100"
                                            muted
                                            playsInline
                                            autoPlay
                                            loop
                                        />
                                    </div>
                                </div>
                                {/* Live Tag if needed */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase border-2 border-white dark:border-black">
                                    New
                                </div>
                            </div>

                            <span className="mt-4 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide text-center max-w-[80px] sm:max-w-[100px] truncate">
                                {story.title}
                            </span>
                        </motion.div>
                    ))}

                    {activeVideos.length === 0 && (
                        <div className="w-full text-center py-10 text-gray-400 font-light italic">
                            No active stories at the moment.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Cinematic Global Style */}
            <AnimatePresence>
                {modalOpen && activeStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                    >
                        {/* 1. Dynamic Background (Blurry Mirror Effect) */}
                        <div className="absolute inset-0 overflow-hidden opacity-40 hidden md:block">
                            <video
                                src={activeStory.url}
                                className="w-full h-full object-cover blur-[100px] scale-150"
                                muted autoPlay loop
                            />
                        </div>

                        {/* 2. Close Button (Global) */}
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white transition-all z-[120] bg-white/10 p-3 rounded-full backdrop-blur-md"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* 3. Navigation Buttons (Hidden on Mobile) */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between px-10 z-[110] pointer-events-none">
                            <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-sm">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-sm">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>

                        {/* 4. Main Story Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full md:h-[90vh] md:max-w-[450px] bg-[#111] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5"
                        >
                            {/* Top Interaction Layer */}
                            <div className="absolute top-0 inset-x-0 z-30 p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                                {/* Progress Segment Bars */}
                                <div className="flex gap-1.5 mb-4">
                                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 10, ease: "linear" }}
                                            className="h-full bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Profile Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            <video src={activeStory.url} className="w-full h-full object-cover" muted autoPlay loop />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-bold tracking-wide drop-shadow-md">
                                            {activeStory.title}
                                        </span>
                                        <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                                            Story Collection
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Video Content */}
                            <div className="w-full h-full relative">
                                <video
                                    src={activeStory.url}
                                    autoPlay
                                    playsInline
                                    onEnded={closeModal}
                                    className="w-full h-full object-cover md:object-contain bg-black"
                                />
                            </div>

                            {/* Bottom Action Layer */}
                            {/* <div className="absolute bottom-0 inset-x-0 z-30 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center">
                                <button className="group flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95">
                                    Shop This Look
                                    <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                                </button>
                                <p className="mt-4 text-white/40 text-[9px] uppercase tracking-[0.3em]">Swipe up to see more</p>
                            </div> */}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default StorySection;