"use client";
import React, { useEffect, useState } from "react";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { fetchSubcategories } from "@/app/redux/slices/subcategory/subcategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
                        {/* <span className="text-[#66FCF1] font-black tracking-[0.5em] text-[10px] uppercase">Digital Pavilion</span> */}
                        <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                            The <span className="font-serif italic text-gray-500">Mall</span>
                        </h2>
                    </div>
                    {/* <p className="max-w-sm text-gray-500 text-[11px] leading-relaxed uppercase tracking-widest opacity-80">
                        Explore our curated architectural tiers.
                    </p> */}
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

const SideContent = ({ activeCat, subcategories, onClose }) => {
    const router = useRouter();

    const goToSubcategory = (subcategoryName) => {
        const query = new URLSearchParams({
            category: activeCat.name,
            subcategory: subcategoryName,
        }).toString();

        router.push(`/categories?${query}`);
        onClose(); // close panel after navigation
    };

    return (
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

            <div className="space-y-4 max-h-[450px] overflow-y-auto hide-scrollbar-force">
                {subcategories.map((sub, idx) => (
                    <div
                        key={sub.id}
                        onClick={() => goToSubcategory(sub.name)}
                        className="group flex items-center gap-5 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#66FCF1]/20 transition-all cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                            <img src={sub.image} className="w-full h-full object-cover  transition-all" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[12px] font-black text-gray-100 group-hover:text-[#66FCF1] uppercase tracking-widest">{sub.name}</h4>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase">Unit 0{idx + 1}</p>
                        </div>
                        <svg className="text-gray-700 group-hover:text-[#66FCF1]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                    </div>
                ))}
            </div>

            <button
                onClick={() => goToSubcategory("All")}
                className="w-full mt-10 py-5 bg-[#66FCF1] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-lg shadow-[#66FCF1]/10"
            >
                Visit All
            </button>
        </motion.div>
    );
};

const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[600px] flex flex-col items-center justify-center text-center border border-dashed border-[#66FCF1]/20 rounded-[3rem] bg-[#66FCF1]/[0.01]">
        <h4 className="text-2xl font-light text-white/90 tracking-tighter">Enter The Mall</h4>
        <p className="text-[10px] text-gray-600 max-w-[250px] mt-4 font-bold leading-relaxed uppercase tracking-widest">Select a department to view floor listings.</p>
    </motion.div>
);

export default Section1;