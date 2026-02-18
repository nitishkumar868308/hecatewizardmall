"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageWithSkeleton from "../Common/ImageWithSkeleton";

const ProductHomePage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const [activeCatIndex, setActiveCatIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});
    console.log("products", products)

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Unique Categories nikalna
    const categories = products?.length > 0
        ? Array.from(new Set(products.map(p => p.category?.name || "Premium")))
        : ["Loading..."];

    const subcategories = products?.length > 0
        ? Array.from(
            new Set(products.map(p => p.subcategory?.name || "General"))
        )
        : ["Loading..."];


    const filteredProducts = products
        ? products.filter(p => (p.subcategory?.name || "Premium") === subcategories[activeCatIndex])
        : [];

    // Slide Logic (useCallback for stability)
    const nextCat = useCallback(() => {
        setActiveCatIndex((prev) => (prev + 1) % subcategories.length);
    }, [subcategories.length]);

    const prevCat = () => {
        setActiveCatIndex((prev) => (prev - 1 + subcategories.length) % subcategories.length);
    };

    // --- Automatic Slider Logic ---
    useEffect(() => {
        if (subcategories.length <= 1) return;

        const interval = setInterval(() => {
            nextCat();
        }, 5000);

        return () => clearInterval(interval);
    }, [nextCat, subcategories.length]);

    const getProductImage = (imgData) => {
        if (Array.isArray(imgData) && imgData.length > 0) return imgData[0];
        if (typeof imgData === 'string' && imgData.length > 0) return imgData;
        return "/placeholder.png";
    };

    return (
        <div className="bg-[#050505] min-h-screen py-10 md:py-16 px-4 md:px-6 overflow-hidden text-white">
            <div className="max-w-[1300px] mx-auto">

                {/* Header Section */}
                <header className="mb-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] md:text-[11px] tracking-[0.5em] md:tracking-[0.8em] uppercase text-[#66FCF1] font-bold block mb-4"
                    >
                        Products
                    </motion.span>
                    <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-tight">
                        Explore Our <span className="font-serif italic text-gray-500">Complete</span> Collection
                    </h2>
                </header>


                {/* --- Category Slider Controller --- */}
                <div className="relative flex items-center justify-between mb-8 md:mb-12 border-b border-white/5 pb-8">
                    {/* Progress Bar (Auto-slide indicator) */}
                    <motion.div
                        key={`progress-${activeCatIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[1px] bg-[#66FCF1]/30"
                    />

                    <button onClick={prevCat} className="z-10 p-2 hover:text-[#66FCF1] transition-colors bg-black/50 rounded-full md:bg-transparent">
                        <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1} />
                    </button>

                    <div className="text-center px-4">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={subcategories[activeCatIndex]}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-xl md:text-5xl font-medium tracking-tight uppercase italic font-serif"
                            >
                                {subcategories[activeCatIndex]}
                            </motion.h3>
                        </AnimatePresence>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {subcategories.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveCatIndex(i)}
                                    className={`h-1 transition-all duration-500 rounded-full ${i === activeCatIndex ? 'w-8 md:w-12 bg-[#66FCF1]' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={nextCat} className="z-10 p-2 hover:text-[#66FCF1] transition-colors bg-black/50 rounded-full md:bg-transparent">
                        <ChevronRight className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1} />
                    </button>
                </div>

                {/* --- Dynamic Product Grid --- */}
                <div className="min-h-[600px]"> {/* Height jump prevent karne ke liye */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCatIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16"
                        >
                            {(loading ? Array.from({ length: 4 }) : filteredProducts.slice(0, 12)).map((product, i) => (
                                <motion.div
                                    key={product?.id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => router.push(`/product/${product.id}`)}
                                    className="group relative flex flex-col cursor-pointer"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#0d0d0d]">
                                        {!loadedImages[product?.id] && (
                                            <div className="absolute inset-0 shimmer" />
                                        )}



                                        {!loading && product ? (
                                            <>
                                                {/* <Image
                                                    src={getProductImage(product.image)}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    priority={i < 2}
                                                    onLoad={() =>
                                                        setLoadedImages(prev => ({ ...prev, [product.id]: true }))
                                                    }
                                                    className={`object-cover transition-opacity duration-700 ${loadedImages[product?.id] ? "opacity-100" : "opacity-0"
                                                        }`}
                                                /> */}
                                                <ImageWithSkeleton
                                                    src={getProductImage(product.image)}
                                                    alt={product.name}
                                                    containerClass="aspect-[4/5] w-full rounded-xl"
                                                    priority={i < 2}
                                                />
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 backdrop-blur-[2px]">
                                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                                            {product.variations?.map((v, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // parent click se bachne ke liye
                                                                        router.push(`/product/${product.id}`);
                                                                    }}
                                                                    className="flex justify-between items-center bg-white/10 p-2 rounded-lg border border-white/5 cursor-pointer hover:bg-white/20"
                                                                >

                                                                    <span className="text-[10px] text-white/90 font-light">{v.variationName}</span>
                                                                    <span className="text-[10px] text-[#66FCF1] font-bold font-mono">{v?.currencySymbol}{v.price}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-white/5 animate-pulse" />
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div className="mt-4 flex justify-between items-start px-1">
                                        <div className="max-w-[70%]">
                                            <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-white/90 leading-tight">
                                                {product?.name}
                                            </h3>
                                            <p className="text-[9px] text-white/40 mt-1 tracking-widest uppercase">
                                                {subcategories[activeCatIndex]}
                                            </p>
                                        </div>
                                        <p className="text-xs md:text-sm font-black text-[#66FCF1] drop-shadow-[0_0_5px_rgba(102,252,241,0.5)]">
                                            {product?.currency} {product?.currencySymbol}{product?.price}
                                        </p>
                                    </div>

                                    {/* Neon Glow Line */}
                                    <div className="mt-3 h-[1px] w-0 group-hover:w-full bg-[#66FCF1] transition-all duration-700 shadow-[0_0_12px_#66FCF1]" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className="mt-20 mb-10 flex justify-center">
                    <motion.button
                        onClick={() => {
                            const category = filteredProducts[0]?.category?.name;
                            const subcategory = subcategories[activeCatIndex];

                            if (!category || !subcategory) return;

                            router.push(
                                `/categories?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
                            );

                        }}
                        whileHover={{ scale: 1.05, letterSpacing: "0.5em" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-4 bg-transparent border border-[#66FCF1]/50 text-[#66FCF1] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full transition-all hover:bg-[#66FCF1] hover:text-black shadow-[0_0_15px_rgba(102,252,241,0.1)]"
                    >
                        Explore Collection
                    </motion.button>
                </footer>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #66FCF1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
      `}</style>
        </div>
    );
};

export default ProductHomePage;