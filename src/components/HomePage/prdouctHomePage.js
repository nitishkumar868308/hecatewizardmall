// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { fetchProducts } from "@/app/redux/slices/products/productSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";

// const ProductHomePage = () => {
//     const dispatch = useDispatch();
//     const { products, loading } = useSelector((state) => state.products);

//     useEffect(() => {
//         dispatch(fetchProducts());
//     }, [dispatch]);

//     const getProductImage = (imgData) => {
//         if (Array.isArray(imgData) && imgData.length > 0) return imgData[0];
//         if (typeof imgData === 'string' && imgData.length > 0) return imgData;
//         return "/placeholder.png";
//     };

//     return (
//         <div className="bg-[#fcfcfc] dark:bg-[#050505] min-h-screen py-16 px-6 overflow-hidden">
//             <div className="max-w-[1300px] mx-auto">

//                 {/* Compact Editorial Header */}
//                 <header className="mb-16 relative">
//                     <div className="flex flex-col items-center text-center">
//                         <motion.span
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="text-[9px] tracking-[0.7em] uppercase text-blue-600 font-bold mb-3"
//                         >
//                             The Conscious Collection
//                         </motion.span>
//                         <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-black dark:text-white leading-[1.1]">
//                             Pure <span className="font-serif italic text-gray-400">Aura</span> & Space
//                         </h2>
//                     </div>
//                 </header>

//                 {/* Compact Luxury Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
//                     {(loading || !products ? Array.from({ length: 8 }) : products.slice(0, 8)).map((product, i) => (
//                         <motion.div
//                             key={product?.id || i}
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.6, delay: i * 0.05 }}
//                             className="group relative flex flex-col cursor-pointer" // Group added here for global trigger
//                         >
//                             {/* Hero Image Container */}
//                             <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#f2f2f2] dark:bg-[#0d0d0d] shadow-lg transition-all duration-500">
//                                 {!loading && product ? (
//                                     <>
//                                         <Image
//                                             src={getProductImage(product.image)}
//                                             alt={product.name}
//                                             fill
//                                             sizes="(max-width: 768px) 50vw, 25vw"
//                                             className="object-cover transition-transform duration-[1s] group-hover:scale-105"
//                                             priority={i < 4}
//                                         />

//                                         {/* Variation Overlay - Triggers when ANY part of the group is hovered */}
//                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 backdrop-blur-[3px]">
//                                             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
//                                                 <p className="text-[8px] uppercase tracking-widest text-white/60 mb-2 font-bold text-center">Select Variation</p>
//                                                 <div className="space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar">
//                                                     {product.variations && product.variations.length > 0 ? (
//                                                         product.variations.map((v, idx) => (
//                                                             <div key={idx} className="flex justify-between items-center bg-white/5 hover:bg-white/20 p-1.5 rounded transition-colors">
//                                                                 <span className="text-[9px] text-white font-medium truncate w-3/5">{v.variationName}</span>
//                                                                 <span className="text-[9px] text-white/90 font-mono">₹{v.price}</span>
//                                                             </div>
//                                                         ))
//                                                     ) : (
//                                                         <span className="text-[10px] text-white text-center block italic">No Variation</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
//                                 )}
//                             </div>

//                             {/* Info Section */}
//                             <div className="mt-4 flex justify-between items-start">
//                                 <div className="max-w-[75%]">
//                                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white truncate">
//                                         {product?.name}
//                                     </h3>
//                                     <p className="text-[9px] text-gray-400 mt-0.5">
//                                         {product?.category?.name || "Premium"}
//                                     </p>
//                                 </div>
//                                 <p className="text-[11px] font-medium text-black dark:text-white">
//                                     {product?.currencySymbol || "₹"}{product?.price}
//                                 </p>
//                             </div>

//                             {/* Animated Underline Triggered by Card Hover */}
//                             <div className="mt-2 h-[1.5px] w-0 group-hover:w-full bg-blue-600 transition-all duration-500 ease-out" />
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* Compact Footer Button */}
//                 <footer className="mt-24 flex justify-center">
//                     <motion.button
//                         whileHover={{ y: -3 }}
//                         className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-xl transition-all"
//                     >
//                         View Collection
//                     </motion.button>
//                 </footer>
//             </div>

//             <style jsx>{`
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 2px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background: rgba(255, 255, 255, 0.2);
//                     border-radius: 10px;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default ProductHomePage;



"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

const ProductHomePage = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const getProductImage = (imgData) => {
        if (Array.isArray(imgData) && imgData.length > 0) return imgData[0];
        if (typeof imgData === 'string' && imgData.length > 0) return imgData;
        return "/placeholder.png";
    };

    // Filter products for sliders (Sample logic - aap apni category name se change kar sakte hain)
    const filterByCategory = (catName) =>
        products?.filter(p => p.category?.name?.toLowerCase().includes(catName.toLowerCase())) || [];

    // Category Groups
    const categories = [
        { name: "Luxury Candles", data: filterByCategory("Candles Shop"), speed: 40 },
        { name: "Organic Herbs", data: filterByCategory("Herbs Shop"), speed: 55 },
        { name: "Essential Oils", data: filterByCategory("Oils Shop"), speed: 45 }
    ];

    return (
        <div className="bg-[#050505] text-white min-h-screen py-16 overflow-hidden font-sans">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Editorial Header */}
                <header className="mb-20 relative">
                    <div className="flex flex-col items-center text-center">
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: "0.2em" }}
                            animate={{ opacity: 1, letterSpacing: "0.7em" }}
                            className="text-[10px] uppercase text-amber-500 font-bold mb-4"
                        >
                            The Conscious Collection
                        </motion.span>
                        <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-[1] text-white">
                            Pure <span className="font-serif italic text-gray-500">Aura</span> & Space
                        </h2>
                    </div>
                </header>

                {/* MAIN GRID - Featured Products */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mb-32">
                    {(loading || !products ? Array.from({ length: 4 }) : products.slice(0, 4)).map((product, i) => (
                        <ProductCard key={product?.id || i} product={product} loading={loading} i={i} getProductImage={getProductImage} />
                    ))}
                </div>

                {/* AUTOMATIC CATEGORY SLIDERS */}
                <div className="space-y-32">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="relative">
                            <div className="px-6 mb-8 flex items-baseline justify-between">
                                <h3 className="text-2xl font-serif italic text-white/90">{cat.name}</h3>
                                <div className="h-[1px] flex-1 mx-8 bg-white/10 hidden md:block" />
                                <span className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Scroll to Explore</span>
                            </div>

                            {/* Infinite Slider Container */}
                            <div className="flex overflow-hidden group">
                                <motion.div
                                    className="flex gap-6 whitespace-nowrap"
                                    animate={{ x: [0, -1000] }}
                                    transition={{
                                        duration: cat.speed,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    {/* Double the data for seamless infinite loop */}
                                    {[...cat.data, ...cat.data, ...cat.data].map((product, i) => (
                                        <div key={i} className="w-[280px] shrink-0">
                                            <ProductCard product={product} loading={loading} i={i} getProductImage={getProductImage} isSlider />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Button */}
                <footer className="mt-32 flex flex-col items-center gap-6">
                    <div className="w-px h-24 bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-amber-500 hover:text-white transition-all duration-500"
                    >
                        Enter the Boutique
                    </motion.button>
                </footer>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;900&family=Playfair+Display:italic@100;400&display=swap');

                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(245, 158, 11, 0.4);
                    border-radius: 10px;
                }
                body { background-color: #050505; }
            `}</style>
        </div>
    );
};

// Reusable Product Card Component
const ProductCard = ({ product, loading, i, getProductImage, isSlider = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.05 }}
        className="group relative flex flex-col cursor-pointer"
    >
        <div className={`relative ${isSlider ? 'aspect-square' : 'aspect-[4/5]'} w-full overflow-hidden rounded-2xl bg-[#0d0d0d] border border-white/5 transition-all duration-500 group-hover:border-amber-500/30`}>
            {!loading && product ? (
                <>
                    <Image
                        src={getProductImage(product.image)}
                        alt={product.name}
                        fill
                        sizes="300px"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />

                    {/* Variation Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 backdrop-blur-[4px]">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {/* <p className="text-[8px] uppercase tracking-widest text-amber-500 mb-2 font-black text-center">Quick Add</p> */}
                            <div className="space-y-1 max-h-[120px] overflow-y-auto custom-scrollbar">
                                {product.variations?.map((v, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 hover:bg-amber-500/20 p-2 rounded-lg border border-white/10 transition-colors">
                                        <span className="text-[9px] text-white font-medium">{v.variationName}</span>
                                        <span className="text-[9px] text-amber-500 font-mono">₹{v.price}</span>
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

        <div className="mt-4 flex justify-between items-start px-1">
            <div className="max-w-[70%]">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-amber-500 transition-colors truncate">
                    {product?.name || "Premium Product"}
                </h3>
                <p className="text-[9px] text-gray-500 mt-1 italic font-serif">
                    {product?.category?.name || "Luxury Collection"}
                </p>
            </div>
            <p className="text-[11px] font-light text-white tracking-tighter">
                ₹{product?.price || "0.00"}
            </p>
        </div>
        <div className="mt-3 h-[1px] w-0 group-hover:w-full bg-amber-500 transition-all duration-700 ease-in-out opacity-50" />
    </motion.div>
);

export default ProductHomePage;




