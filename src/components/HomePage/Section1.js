// import React, { useEffect, useState } from "react";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";

// const Section1 = () => {
//     const dispatch = useDispatch();
//     const { categories } = useSelector((state) => state.category);
//     const { subcategories } = useSelector((state) => state.subcategory);

//     const [hoveredCat, setHoveredCat] = useState(null);

//     useEffect(() => {
//         dispatch(fetchCategories());
//         dispatch(fetchSubcategories());
//     }, [dispatch]);

//     const getSubcategories = (catId) =>
//         subcategories.filter((sub) => sub.categoryId === catId);

//     return (
//         <section className="w-full px-4 md:px-0 py-16">
//             <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 dark:text-white">
//                 Explore Our Luxury Categories
//             </h2>

//             {/* Categories Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//                 {categories.map((cat, index) => (
//                     <div
//                         key={cat.id}
//                         className="relative group cursor-pointer rounded-2xl overflow-visible shadow-lg bg-white dark:bg-gray-900 hover:shadow-2xl transition"
//                         onMouseEnter={() => setHoveredCat(cat.id)}
//                         onMouseLeave={() => setHoveredCat(null)}
//                     >
//                         <motion.div
//                             className=""
//                             whileHover={{ scale: 1.03 }}
//                             initial={{ opacity: 0, y: 30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.05, duration: 0.4 }}
//                         >
//                             <img
//                                 src={cat.image}
//                                 alt={cat.name}
//                                 className="w-full h-48 object-cover rounded-t-2xl"
//                             />
//                             <div className="p-4 text-center">
//                                 <h3 className="text-xl font-bold dark:text-white">{cat.name}</h3>
//                                 <button className="mt-2 px-4 py-1 bg-gold text-black font-semibold rounded-full shadow hover:scale-105 transition-transform">
//                                     Shop Now
//                                 </button>
//                             </div>
//                         </motion.div>

//                         {/* Subcategories Reveal */}
//                         <AnimatePresence>

//                             {hoveredCat === cat.id && getSubcategories(cat.id).length > 0 && (
//                                 <motion.div
//                                     className="absolute top-full left-0 w-full bg-gray-50 dark:bg-gray-800 shadow-lg p-4 grid grid-cols-3 gap-3 z-50 rounded-b-2xl mt-2"
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     transition={{ duration: 0.3 }}
//                                 >

//                                     {getSubcategories(cat.id).map((sub) => (
//                                         <div
//                                             key={sub.id}
//                                             className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
//                                         >
//                                             <img
//                                                 src={sub.image}
//                                                 alt={sub.name}
//                                                 className="w-20 h-20 object-cover rounded-lg"
//                                             />
//                                             <span className="text-sm mt-1 font-medium dark:text-white">
//                                                 {sub.name}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default Section1;


"use client";
import React, { useEffect, useState } from "react";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Section1 = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { subcategories } = useSelector((state) => state.subcategory);
    const [activeCat, setActiveCat] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchSubcategories());
    }, [dispatch]);

    const activeCategories = categories.filter((cat) => cat.active);
    const getActiveSubcategories = (catId) =>
        subcategories.filter((sub) => sub.categoryId === catId && sub.active);

    const handleCatClick = (cat) => {
        setActiveCat(activeCat?.id === cat.id ? null : cat);
    };

    return (
        <section className="w-full py-24 bg-[#fafafa] dark:bg-[#080808] transition-colors duration-500">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div className="space-y-2">
                        <span className="text-blue-600 font-bold tracking-[0.3em] text-[10px] uppercase">Curated Collections</span>
                        <h2 className="text-4xl md:text-6xl font-light tracking-tighter dark:text-white">
                            The <span className="font-serif italic text-gray-400">Categories</span>
                        </h2>
                    </div>
                    {/* <p className="max-w-xs text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        Explore our handpicked selections designed for modern aesthetics and functional elegance.
                    </p> */}
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT: Dynamic Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 w-full">
                        {activeCategories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                layout
                                onClick={() => handleCatClick(cat)}
                                className={`relative h-[350px] cursor-pointer group rounded-[2rem] overflow-hidden border-2 transition-all duration-500 
                                    ${activeCat?.id === cat.id ? "border-blue-600 shadow-2xl scale-[0.98]" : "border-transparent shadow-sm hover:shadow-xl"}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 
                                    ${activeCat?.id === cat.id ? "opacity-90" : "opacity-60 group-hover:opacity-80"}`} />

                                {/* Content */}
                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-2xl font-medium text-white mb-1">{cat.name}</h3>
                                    <div className={`h-1 bg-blue-600 transition-all duration-500 rounded-full ${activeCat?.id === cat.id ? "w-full" : "w-0 group-hover:w-12"}`} />

                                    {/* Mobile Only: Sub-count */}
                                    <p className="lg:hidden text-white/60 text-xs mt-2 uppercase tracking-widest">
                                        Tap to view collections
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT: High-End Sticky Side Panel */}
                    <div className="w-full lg:w-[400px] lg:sticky lg:top-24">
                        <AnimatePresence mode="wait">
                            {activeCat ? (
                                <motion.div
                                    key={activeCat.id}
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/5"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-serif italic dark:text-white leading-tight">
                                                {activeCat.name}
                                            </h3>
                                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">
                                                {getActiveSubcategories(activeCat.id).length} Editions
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setActiveCat(null)}
                                            className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                        </button>
                                    </div>

                                    {/* Subcategory Scroll Area */}
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {getActiveSubcategories(activeCat.id).map((sub, idx) => (
                                            <motion.div
                                                key={sub.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group/item flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                                            >
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img src={sub.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold dark:text-white group-hover/item:text-blue-600 transition-colors">{sub.name}</h4>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Signature Piece</p>
                                                </div>
                                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-blue-500/20 transition-all">
                                        Explore All {activeCat.name}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hidden lg:flex h-[500px] flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem]"
                                >
                                    <div className="w-20 h-20 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                        <svg className="text-blue-600 animate-pulse" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h4 className="text-xl font-medium dark:text-white">Select a Collection</h4>
                                    <p className="text-sm text-gray-400 max-w-[200px] mt-2 font-light">Click on a category to reveal its sub-collections.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
            `}</style>
        </section>
    );
};

export default Section1;