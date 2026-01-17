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


// "use client";
// import React, { useEffect, useState } from "react";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";

// const Section1 = () => {
//     const dispatch = useDispatch();
//     const { categories } = useSelector((state) => state.category);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const [activeCat, setActiveCat] = useState(null);

//     useEffect(() => {
//         dispatch(fetchCategories());
//         dispatch(fetchSubcategories());
//     }, [dispatch]);

//     const activeCategories = categories.filter((cat) => cat.active);
//     const getActiveSubcategories = (catId) =>
//         subcategories.filter((sub) => sub.categoryId === catId && sub.active);

//     const handleCatClick = (cat) => {
//         setActiveCat(activeCat?.id === cat.id ? null : cat);
//     };

//     return (
//         <section className="w-full py-24 bg-[#080808] text-white transition-colors duration-500 overflow-hidden">
//             <div className="max-w-[1400px] mx-auto px-6 md:px-12">

//                 {/* Header Section */}
//                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
//                     <div className="space-y-2">
//                         <span className="text-amber-500 font-bold tracking-[0.3em] text-[10px] uppercase">
//                             Curated Collections
//                         </span>
//                         <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white">
//                             The <span className="font-serif italic text-gray-500">Categories</span>
//                         </h2>
//                     </div>
//                     <p className="max-w-xs text-gray-400 text-xs leading-relaxed opacity-80">
//                         Explore our handpicked selections designed for modern aesthetics and functional elegance.
//                     </p>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-8 items-start">

//                     {/* LEFT: Dynamic Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 w-full">
//                         {activeCategories.map((cat, i) => (
//                             <motion.div
//                                 key={cat.id}
//                                 layout
//                                 onClick={() => handleCatClick(cat)}
//                                 className={`relative h-[400px] cursor-pointer group rounded-[2rem] overflow-hidden border transition-all duration-500 
//                 ${activeCat?.id === cat.id
//                                         ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[0.98]"
//                                         : "border-white/10 shadow-sm hover:border-white/30"}`}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ delay: i * 0.05 }}
//                             >
//                                 <img
//                                     src={cat.image}
//                                     alt={cat.name}
//                                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
//                                 />

//                                 {/* Overlay Gradient */}
//                                 <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 
//                 ${activeCat?.id === cat.id ? "opacity-100" : "opacity-80 group-hover:opacity-90"}`} />

//                                 {/* Content */}
//                                 <div className="absolute bottom-8 left-8 right-8">
//                                     <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
//                                         View Collection
//                                     </p>
//                                     <h3 className="text-2xl font-medium text-white mb-1 tracking-tight">{cat.name}</h3>
//                                     <div className={`h-[2px] bg-amber-500 transition-all duration-500 rounded-full ${activeCat?.id === cat.id ? "w-full" : "w-0 group-hover:w-12"}`} />
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>

//                     {/* RIGHT: High-End Sticky Side Panel */}
//                     <div className="w-full lg:w-[420px] lg:sticky lg:top-24">
//                         <AnimatePresence mode="wait">
//                             {activeCat ? (
//                                 <motion.div
//                                     key={activeCat.id}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, scale: 0.95 }}
//                                     className="bg-[#111] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 backdrop-blur-xl"
//                                 >
//                                     <div className="flex justify-between items-start mb-10">
//                                         <div>
//                                             <h3 className="text-3xl font-serif italic text-white leading-tight">
//                                                 {activeCat.name}
//                                             </h3>
//                                             <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mt-2">
//                                                 {getActiveSubcategories(activeCat.id).length} Exclusive Editions
//                                             </p>
//                                         </div>
//                                         <button
//                                             onClick={() => setActiveCat(null)}
//                                             className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
//                                         >
//                                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                                 <path d="M18 6L6 18M6 6l12 12" />
//                                             </svg>
//                                         </button>
//                                     </div>

//                                     {/* Subcategory Scroll Area */}
//                                     <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
//                                         {getActiveSubcategories(activeCat.id).map((sub, idx) => (
//                                             <motion.div
//                                                 key={sub.id}
//                                                 initial={{ opacity: 0, x: -10 }}
//                                                 animate={{ opacity: 1, x: 0 }}
//                                                 transition={{ delay: idx * 0.08 }}
//                                                 className="group/item flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
//                                             >
//                                                 <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
//                                                     <img
//                                                         src={sub.image}
//                                                         className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
//                                                     />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <h4 className="text-sm font-bold text-white group-hover/item:text-amber-500 transition-colors uppercase tracking-wider">
//                                                         {sub.name}
//                                                     </h4>
//                                                     <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
//                                                         Limited Edition
//                                                     </p>
//                                                 </div>
//                                                 <div className="text-gray-600 group-hover/item:text-amber-500 transition-all transform translate-x-0 group-hover:translate-x-1">
//                                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                         <path d="M5 12h14m-7-7l7 7-7 7" />
//                                                     </svg>
//                                                 </div>
//                                             </motion.div>
//                                         ))}
//                                     </div>

//                                     <button className="w-full mt-10 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-amber-500 hover:text-white transition-all duration-500">
//                                         Discover All {activeCat.name}
//                                     </button>
//                                 </motion.div>
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="hidden lg:flex h-[550px] flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02]"
//                                 >
//                                     <div className="w-24 h-24 mb-8 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20">
//                                         <svg className="text-amber-500/50" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
//                                             <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                         </svg>
//                                     </div>
//                                     <h4 className="text-xl font-light text-white/80 tracking-tight">Select a Category</h4>
//                                     <p className="text-sm text-gray-500 max-w-[220px] mt-3 font-light leading-relaxed">
//                                         Click on a collection to reveal its curated sub-sections and signature pieces.
//                                     </p>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//     .custom-scrollbar::-webkit-scrollbar { width: 3px; }
//     .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//     .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
//     .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
//   `}</style>
//         </section>
//     );
// };

// export default Section1;


// "use client";
// import React, { useEffect, useState } from "react";
// import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
// import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";

// const Section1 = () => {
//     const dispatch = useDispatch();
//     const { categories } = useSelector((state) => state.category);
//     const { subcategories } = useSelector((state) => state.subcategory);
//     const [activeCat, setActiveCat] = useState(null);

//     useEffect(() => {
//         dispatch(fetchCategories());
//         dispatch(fetchSubcategories());
//     }, [dispatch]);

//     const activeCategories = categories.filter((cat) => cat.active);
//     const getActiveSubcategories = (catId) =>
//         subcategories.filter((sub) => sub.categoryId === catId && sub.active);

//     const handleCatClick = (cat) => {
//         setActiveCat(activeCat?.id === cat.id ? null : cat);
//     };

//     return (
//         <section className="w-full py-28 bg-[#050505] text-white transition-colors duration-500 overflow-hidden">
//             <div className="max-w-[1400px] mx-auto px-6 md:px-12">

//                 {/* Header Section */}
//                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
//                     <div className="space-y-3">
//                         <span className="text-[#66FCF1] font-black tracking-[0.5em] text-[10px] uppercase">
//                             Digital Pavilion
//                         </span>
//                         <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
//                             The <span className="font-serif italic text-gray-500">Mall</span>
//                         </h2>
//                     </div>
//                     <p className="max-w-sm text-gray-500 text-[11px] leading-relaxed uppercase tracking-widest opacity-80">
//                         Navigate through our architectural tiers of luxury. A curated space where technology meets lifestyle.
//                     </p>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-10 items-start">

//                     {/* LEFT: Dynamic Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 flex-1 w-full">
//                         {activeCategories.map((cat, i) => (
//                             <motion.div
//                                 key={cat.id}
//                                 layout
//                                 onClick={() => handleCatClick(cat)}
//                                 className={`relative h-[450px] cursor-pointer group rounded-[2.5rem] overflow-hidden border transition-all duration-700 
//                                 ${activeCat?.id === cat.id
//                                         ? "border-[#66FCF1] shadow-[0_0_40px_rgba(102,252,241,0.15)] scale-[0.97]"
//                                         : "border-white/5 shadow-sm hover:border-[#66FCF1]/40"}`}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ delay: i * 0.05 }}
//                             >
//                                 <img
//                                     src={cat.image}
//                                     alt={cat.name}
//                                     className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
//                                 />

//                                 {/* Overlay Gradient */}
//                                 <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-700 
//                                 ${activeCat?.id === cat.id ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`} />

//                                 {/* Content */}
//                                 <div className="absolute bottom-10 left-10 right-10">
//                                     <p className="text-[#66FCF1] text-[9px] font-black tracking-[0.4em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
//                                         Enter Floor
//                                     </p>
//                                     <h3 className="text-3xl font-medium text-white mb-2 tracking-tighter">{cat.name}</h3>
//                                     <div className={`h-[1px] bg-[#66FCF1] transition-all duration-700 ${activeCat?.id === cat.id ? "w-full shadow-[0_0_10px_#66FCF1]" : "w-0 group-hover:w-16"}`} />
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>

//                     {/* RIGHT: High-End Sticky Side Panel */}
//                     <div className="w-full lg:w-[450px] lg:sticky lg:top-28">
//                         <AnimatePresence mode="wait">
//                             {activeCat ? (
//                                 <motion.div
//                                     key={activeCat.id}
//                                     initial={{ opacity: 0, x: 30 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     exit={{ opacity: 0, scale: 0.95 }}
//                                     className="bg-[#0c0c0c] rounded-[3rem] p-10 shadow-2xl border border-[#66FCF1]/10 backdrop-blur-3xl relative overflow-hidden"
//                                 >
//                                     {/* Subtle Background Glow */}
//                                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#66FCF1]/5 blur-[80px] rounded-full" />

//                                     <div className="flex justify-between items-start mb-12 relative z-10">
//                                         <div>
//                                             <h3 className="text-4xl font-serif italic text-white leading-tight tracking-tight">
//                                                 {activeCat.name}
//                                             </h3>
//                                             <p className="text-[#66FCF1]/80 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
//                                                 {getActiveSubcategories(activeCat.id).length} Available Aisles
//                                             </p>
//                                         </div>
//                                         <button
//                                             onClick={() => setActiveCat(null)}
//                                             className="p-4 bg-white/5 rounded-full hover:bg-[#66FCF1]/10 text-gray-500 hover:text-[#66FCF1] transition-all duration-500"
//                                         >
//                                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                 <path d="M18 6L6 18M6 6l12 12" />
//                                             </svg>
//                                         </button>
//                                     </div>

//                                     {/* Subcategory Scroll Area */}
//                                     <div className="space-y-5 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
//                                         {getActiveSubcategories(activeCat.id).map((sub, idx) => (
//                                             <motion.div
//                                                 key={sub.id}
//                                                 initial={{ opacity: 0, y: 10 }}
//                                                 animate={{ opacity: 1, y: 0 }}
//                                                 transition={{ delay: idx * 0.08 }}
//                                                 className="group/item flex items-center gap-6 p-5 rounded-[2rem] hover:bg-[#66FCF1]/5 border border-transparent hover:border-[#66FCF1]/10 transition-all duration-500 cursor-pointer"
//                                             >
//                                                 <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
//                                                     <img
//                                                         src={sub.image}
//                                                         className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000 grayscale group-hover/item:grayscale-0"
//                                                     />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <h4 className="text-[13px] font-black text-gray-400 group-hover/item:text-[#66FCF1] transition-colors uppercase tracking-[0.2em]">
//                                                         {sub.name}
//                                                     </h4>
//                                                     <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-2">
//                                                         Floor {idx + 1} • Unit {idx + 10}
//                                                     </p>
//                                                 </div>
//                                                 <div className="text-gray-700 group-hover/item:text-[#66FCF1] transition-all transform translate-x-0 group-hover:translate-x-2">
//                                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                                                         <path d="M5 12h14m-7-7l7 7-7 7" />
//                                                     </svg>
//                                                 </div>
//                                             </motion.div>
//                                         ))}
//                                     </div>

//                                     <button className="w-full mt-12 py-5 border border-[#66FCF1] text-[#66FCF1] rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#66FCF1] hover:text-black transition-all duration-700 shadow-[0_0_20px_rgba(102,252,241,0.1)]">
//                                         View Full Department
//                                     </button>
//                                 </motion.div>
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="hidden lg:flex h-[600px] flex-col items-center justify-center text-center border border-dashed border-[#66FCF1]/20 rounded-[3rem] bg-[#66FCF1]/[0.02]"
//                                 >
//                                     <div className="w-24 h-24 mb-10 rounded-full bg-[#66FCF1]/5 flex items-center justify-center border border-[#66FCF1]/10">
//                                         <svg className="text-[#66FCF1]/30" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
//                                             <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                         </svg>
//                                     </div>
//                                     <h4 className="text-2xl font-light text-white/90 tracking-tighter">Enter The Mall</h4>
//                                     <p className="text-[10px] text-gray-600 max-w-[250px] mt-4 font-bold leading-relaxed uppercase tracking-widest">
//                                         Select a department to view curated collections and exclusive floor listings.
//                                     </p>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//                 .custom-scrollbar::-webkit-scrollbar { width: 2px; }
//                 .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//                 .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(102, 252, 241, 0.1); border-radius: 10px; }
//                 .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #66FCF1; }
//             `}</style>
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

    return (
        <section className="w-full py-28 bg-[#050505] text-white overflow-hidden relative">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <div className="space-y-3">
                        <span className="text-[#66FCF1] font-black tracking-[0.5em] text-[10px] uppercase">Digital Pavilion</span>
                        <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                            The <span className="font-serif italic text-gray-500">Mall</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-gray-500 text-[11px] leading-relaxed uppercase tracking-widest opacity-80">
                        Explore our curated architectural tiers.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* CATEGORIES GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 flex-1 w-full">
                        {activeCategories.map((cat) => (
                            <motion.div
                                key={cat.id}
                                layout
                                onClick={() => setActiveCat(cat)}
                                className="relative h-[400px] md:h-[450px] cursor-pointer group rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-700 hover:border-[#66FCF1]/40"
                            >
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-transform duration-[1.5s] group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-10 left-10">
                                    <h3 className="text-3xl font-medium text-white mb-2 tracking-tighter">{cat.name}</h3>
                                    <div className="h-[1px] bg-[#66FCF1] w-0 group-hover:w-16 transition-all duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DESKTOP SIDE PANEL */}
                    <div className="hidden lg:block w-[450px] sticky top-28">
                        <AnimatePresence mode="wait">
                            {activeCat ? (
                                <SideContent 
                                    activeCat={activeCat} 
                                    subcategories={getActiveSubcategories(activeCat.id)} 
                                    onClose={() => setActiveCat(null)} 
                                />
                            ) : (
                                <EmptyState />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM SHEET */}
            <AnimatePresence>
                {activeCat && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveCat(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] z-[100] rounded-t-[3rem] border-t border-[#66FCF1]/20 p-8 lg:hidden max-h-[85vh] flex flex-col"
                        >
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 shrink-0" />
                            {/* Force Hide Scrollbar Wrapper */}
                            <div className="overflow-y-auto hide-scrollbar-force">
                                <SideContent 
                                    activeCat={activeCat} 
                                    subcategories={getActiveSubcategories(activeCat.id)} 
                                    onClose={() => setActiveCat(null)} 
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* GLOBAL CSS OVERRIDE */}
            <style jsx global>{`
                .hide-scrollbar-force {
                    -ms-overflow-style: none !important;
                    scrollbar-width: none !important;
                }
                .hide-scrollbar-force::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `}</style>
        </section>
    );
};

const SideContent = ({ activeCat, subcategories, onClose }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0c0c0c] lg:rounded-[3rem] lg:p-10 lg:border lg:border-[#66FCF1]/10 shadow-2xl"
    >
        <div className="flex justify-between items-start mb-10">
            <div>
                <h3 className="text-3xl md:text-4xl font-serif italic text-white tracking-tight">{activeCat.name}</h3>
                <p className="text-[#66FCF1]/80 text-[10px] font-black uppercase tracking-[0.3em] mt-3">{subcategories.length} Floor Units</p>
            </div>
            <button onClick={onClose} className="p-4 bg-white/5 rounded-full text-gray-500 hover:text-[#66FCF1] transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
        </div>

        {/* List inside also gets the force class */}
        <div className="space-y-4 max-h-[450px] overflow-y-auto hide-scrollbar-force">
            {subcategories.map((sub, idx) => (
                <div key={sub.id} className="group flex items-center gap-5 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#66FCF1]/20 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                        <img src={sub.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[12px] font-black text-gray-400 group-hover:text-[#66FCF1] uppercase tracking-widest">{sub.name}</h4>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase">Unit 0{idx + 1}</p>
                    </div>
                    <svg className="text-gray-700 group-hover:text-[#66FCF1]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </div>
            ))}
        </div>
        <button className="w-full mt-10 py-5 bg-[#66FCF1] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-lg shadow-[#66FCF1]/10">
            Visit Department
        </button>
    </motion.div>
);

const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[600px] flex flex-col items-center justify-center text-center border border-dashed border-[#66FCF1]/20 rounded-[3rem] bg-[#66FCF1]/[0.01]">
        <h4 className="text-2xl font-light text-white/90 tracking-tighter">Enter The Mall</h4>
        <p className="text-[10px] text-gray-600 max-w-[250px] mt-4 font-bold leading-relaxed uppercase tracking-widest">Select a department to view floor listings.</p>
    </motion.div>
);

export default Section1;