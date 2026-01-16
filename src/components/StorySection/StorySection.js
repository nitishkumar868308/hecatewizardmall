// "use client";
// import React, { useState, useEffect } from "react";
// import { fetchVideos } from "@/app/redux/slices/videoStory/videoStorySlice";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";

// const StorySection = () => {
//     const dispatch = useDispatch();
//     const { videos } = useSelector((state) => state.videoStory);
//     const [activeStory, setActiveStory] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     useEffect(() => {
//         dispatch(fetchVideos());
//     }, [dispatch]);

//     const openModal = (story) => {
//         setActiveStory(story);
//         setModalOpen(true);
//     };

//     const closeModal = () => {
//         setActiveStory(null);
//         setModalOpen(false);
//     };

//     const activeVideos = videos.filter((video) => video.active);

//     return (
//         <section className="bg-white dark:bg-[#0a0a0a] py-12 transition-colors duration-500">
//             <div className="max-w-7xl mx-auto px-4">

//                 {/* Section Header */}
//                 <div className="flex items-center justify-between mb-8 px-2">
//                     <h2 className="text-2xl md:text-3xl font-light tracking-tight dark:text-white">
//                         Exclusive <span className="font-serif italic text-blue-600">Stories</span>
//                     </h2>
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scroll to explore</span>
//                 </div>

//                 {/* Stories Container */}
//                 <div className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x">
//                     {activeVideos.map((story) => (
//                         <motion.div
//                             key={story.id}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="flex flex-col items-center flex-shrink-0 snap-start"
//                         >
//                             {/* Story Ring - Pure CSS Gradient */}
//                             <div
//                                 className="relative p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 cursor-pointer"
//                                 onClick={() => openModal(story)}
//                             >
//                                 <div className="bg-white dark:bg-[#0a0a0a] p-[2px] rounded-full">
//                                     <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden relative">
//                                         <video
//                                             src={story.url}
//                                             className="w-full h-full object-cover brightness-90 group-hover:brightness-100"
//                                             muted
//                                             playsInline
//                                             autoPlay
//                                             loop
//                                         />
//                                     </div>
//                                 </div>
//                                 {/* Live Tag if needed */}
//                                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase border-2 border-white dark:border-black">
//                                     New
//                                 </div>
//                             </div>

//                             <span className="mt-4 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide text-center max-w-[80px] sm:max-w-[100px] truncate">
//                                 {story.title}
//                             </span>
//                         </motion.div>
//                     ))}

//                     {activeVideos.length === 0 && (
//                         <div className="w-full text-center py-10 text-gray-400 font-light italic">
//                             No active stories at the moment.
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Modal - Cinematic Global Style */}
//             <AnimatePresence>
//                 {modalOpen && activeStory && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
//                     >
//                         {/* 1. Dynamic Background (Blurry Mirror Effect) */}
//                         <div className="absolute inset-0 overflow-hidden opacity-40 hidden md:block">
//                             <video
//                                 src={activeStory.url}
//                                 className="w-full h-full object-cover blur-[100px] scale-150"
//                                 muted autoPlay loop
//                             />
//                         </div>

//                         {/* 2. Close Button (Global) */}
//                         <button
//                             onClick={closeModal}
//                             className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white transition-all z-[120] bg-white/10 p-3 rounded-full backdrop-blur-md"
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
//                         </button>

//                         {/* 3. Navigation Buttons (Hidden on Mobile) */}
//                         <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between px-10 z-[110] pointer-events-none">
//                             <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-sm">
//                                 <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
//                             </button>
//                             <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-sm">
//                                 <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
//                             </button>
//                         </div>

//                         {/* 4. Main Story Container */}
//                         <motion.div
//                             initial={{ scale: 0.9, opacity: 0, y: 30 }}
//                             animate={{ scale: 1, opacity: 1, y: 0 }}
//                             exit={{ scale: 0.8, opacity: 0, y: 30 }}
//                             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                             className="relative w-full h-full md:h-[90vh] md:max-w-[450px] bg-[#111] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5"
//                         >
//                             {/* Top Interaction Layer */}
//                             <div className="absolute top-0 inset-x-0 z-30 p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
//                                 {/* Progress Segment Bars */}
//                                 <div className="flex gap-1.5 mb-4">
//                                     <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
//                                         <motion.div
//                                             initial={{ width: "0%" }}
//                                             animate={{ width: "100%" }}
//                                             transition={{ duration: 10, ease: "linear" }}
//                                             className="h-full bg-white"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Profile Header */}
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5">
//                                         <div className="w-full h-full rounded-full overflow-hidden">
//                                             <video src={activeStory.url} className="w-full h-full object-cover" muted autoPlay loop />
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col">
//                                         <span className="text-white text-sm font-bold tracking-wide drop-shadow-md">
//                                             {activeStory.title}
//                                         </span>
//                                         <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
//                                             Story Collection
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Main Video Content */}
//                             <div className="w-full h-full relative">
//                                 <video
//                                     src={activeStory.url}
//                                     autoPlay
//                                     playsInline
//                                     onEnded={closeModal}
//                                     className="w-full h-full object-cover md:object-contain bg-black"
//                                 />
//                             </div>

//                             {/* Bottom Action Layer */}
//                             {/* <div className="absolute bottom-0 inset-x-0 z-30 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center">
//                                 <button className="group flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95">
//                                     Shop This Look
//                                     <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
//                                 </button>
//                                 <p className="mt-4 text-white/40 text-[9px] uppercase tracking-[0.3em]">Swipe up to see more</p>
//                             </div> */}
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <style jsx>{`
//                 .scrollbar-hide::-webkit-scrollbar { display: none; }
//                 .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//             `}</style>
//         </section>
//     );
// };

// export default StorySection;


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
        <section className="bg-[#050505] py-16 transition-colors duration-500 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Section Header */}
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-1">
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Inside the lab</span>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">
                            Visual <span className="font-serif italic text-gray-500">Journal</span>
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Slide to view</span>
                        <div className="w-12 h-[1px] bg-white/20"></div>
                    </div>
                </div>

                {/* Stories Horizontal Container */}
                <div className="flex gap-6 sm:gap-10 overflow-x-auto scrollbar-hide pb-8 px-2 snap-x select-none">
                    {activeVideos.map((story, i) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center flex-shrink-0 snap-start group"
                        >
                            {/* Story Ring - Premium Aesthetic */}
                            <div
                                className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-200 via-amber-500 to-amber-800 cursor-pointer active:scale-95 transition-transform duration-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                                onClick={() => openModal(story)}
                            >
                                <div className="bg-[#050505] p-[3px] rounded-full">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden relative border border-white/5">
                                        <video
                                            src={story.url}
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            muted
                                            playsInline
                                            autoPlay
                                            loop
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                </div>

                                {/* Status Tag */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-[8px] text-black px-3 py-0.5 rounded-full font-black uppercase tracking-tighter border-2 border-[#050505]">
                                    Live
                                </div>
                            </div>

                            <span className="mt-5 text-[10px] font-bold text-white/70 group-hover:text-amber-500 uppercase tracking-[0.2em] transition-colors">
                                {story.title}
                            </span>
                        </motion.div>
                    ))}

                    {activeVideos.length === 0 && (
                        <div className="w-full text-center py-20 text-gray-600 font-light tracking-widest uppercase text-xs">
                            No Stories active.
                        </div>
                    )}
                </div>
            </div>

            {/* Cinematic Modal */}
            <AnimatePresence>
                {modalOpen && activeStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
                    >
                        {/* Desktop Background Blur */}
                        <div className="absolute inset-0 overflow-hidden opacity-30 hidden lg:block">
                            <video
                                src={activeStory.url}
                                className="w-full h-full object-cover blur-[120px] scale-150"
                                muted autoPlay loop
                            />
                        </div>

                        {/* Top Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/50 hover:text-white transition-all z-[1010] bg-white/5 hover:bg-white/10 p-4 rounded-full"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Story Phone Frame */}
                        <motion.div
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full lg:h-[92vh] lg:max-w-[420px] bg-black lg:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] lg:border lg:border-white/10"
                        >
                            {/* Header Info Overlay */}
                            <div className="absolute top-0 inset-x-0 z-50 p-6 bg-gradient-to-b from-black/90 via-black/20 to-transparent">
                                {/* Progress Bar */}
                                <div className="h-[2px] w-full bg-white/20 rounded-full mb-6 overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear" }}
                                        onAnimationComplete={closeModal}
                                        className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-amber-500/50 p-0.5 shadow-lg shadow-amber-500/10">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                            <video src={activeStory.url} className="w-full h-full object-cover" muted autoPlay loop />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-white text-sm font-black tracking-wide uppercase italic font-serif">
                                            {activeStory.title}
                                        </h4>
                                        <p className="text-amber-500/80 text-[9px] uppercase tracking-[0.3em] font-bold">
                                            Official Story
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Content */}
                            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                <video
                                    src={activeStory.url}
                                    autoPlay
                                    playsInline
                                    onEnded={closeModal}
                                    className="w-full h-full object-cover lg:object-contain"
                                />
                            </div>

                            {/* Bottom CTA Overlay */}
                            <div className="absolute bottom-0 inset-x-0 z-50 p-10 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-amber-500 hover:text-white transition-all duration-500"
                                >
                                    Explore Piece
                                </motion.button>
                                <p className="mt-6 text-white/30 text-[8px] uppercase tracking-[0.5em] animate-pulse">Swipe up to shop</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                /* Smooth snapping for mobile */
                .snap-x { scroll-snap-type: x mandatory; }
                .snap-start { scroll-snap-align: start; }
            `}</style>
        </section>
    );
};

export default StorySection;