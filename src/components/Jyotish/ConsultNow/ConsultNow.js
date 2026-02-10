"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Star, Filter, Search, CheckCircle } from 'lucide-react';

const astrologersData = [
    { id: 1, name: "Acharya Vardhan", expertise: "Vedic, Vastu", language: "Hindi, English", exp: 12, price: 25, rating: 4.9, reviews: "1.2k", status: "Online", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Sonia Tarot", expertise: "Tarot, Face Reading", language: "English, Punjabi", exp: 8, price: 15, rating: 4.8, reviews: "850", status: "Online", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Pt. Radhe Shyam", expertise: "Palmistry, Kundli", language: "Hindi", exp: 20, price: 50, rating: 5.0, reviews: "2.5k", status: "Busy", img: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Astrologer Meera", expertise: "Numerology", language: "Hindi, English", exp: 5, price: 10, rating: 4.7, reviews: "400", status: "Online", img: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Dr. Aditya", expertise: "Psychic, Vedic", language: "English", exp: 15, price: 40, rating: 4.9, reviews: "900", status: "Offline", img: "https://i.pravatar.cc/150?u=5" },
];

const categories = ["All", "Vedic", "Tarot", "Numerology", "Vastu", "Palmistry"];

const ConsultNow = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Price");


    return (
        <div className="min-h-screen bg-[#0B0C10] text-white pt-24 pb-12 px-4 md:px-8">

            {/* --- Search & Filter Header --- */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2">Consult <span className="text-[#66FCF1]">Astrologers</span></h1>
                        <p className="text-gray-400">Directly connect with India's top spiritual experts</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        {/* Search */}
                        <div className="relative group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#66FCF1]"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or expertise..."
                                className="bg-[#1F2833] border border-white/10 rounded-2xl py-4 pl-12 pr-6 w-full md:w-72 focus:outline-none focus:border-[#66FCF1]/50"
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="px-6 py-4 rounded-2xl bg-[#66FCF1] text-[#0B0C10] font-bold hover:scale-95 transition"
                        >
                            Filters
                        </button>
                    </div>

                </div>

                {/* --- Category Chips --- */}
                {/* <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all border ${activeTab === cat
                                ? "bg-[#66FCF1] text-[#0B0C10] border-[#66FCF1]"
                                : "bg-transparent border-white/10 text-gray-400 hover:border-[#66FCF1]/50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div> */}

                {filterOpen && (
                    <div className="fixed inset-0 z-[9999]">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setFilterOpen(false)}
                        />

                        {/* Modal */}
                        <div className="absolute right-0 top-0 h-full w-full md:w-[700px] bg-[#0B0C10] text-white flex">

                            {/* LEFT FILTER TABS */}
                            <div className="w-1/3 border-r border-white/10 p-6 space-y-4">
                                {["Price", "Experience", "Services", "Language"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveFilter(item)}
                                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition
              ${activeFilter === item
                                                ? "bg-[#66FCF1] text-[#0B0C10]"
                                                : "hover:bg-white/5 text-gray-300"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            {/* RIGHT OPTIONS */}
                            <div className="w-2/3 p-6 overflow-y-auto">
                                {activeFilter === "Price" && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg mb-4">Price Range</h3>
                                        {["₹0 - ₹100", "₹100 - ₹300", "₹300+"].map(p => (
                                            <label key={p} className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" className="accent-[#66FCF1]" />
                                                {p}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {activeFilter === "Experience" && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg mb-4">Experience</h3>
                                        {["1-3 Years", "3-5 Years", "5+ Years"].map(e => (
                                            <label key={e} className="flex items-center gap-3">
                                                <input type="checkbox" className="accent-[#66FCF1]" />
                                                {e}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {activeFilter === "Services" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Vedic", "Tarot", "Palmistry", "Numerology"].map(s => (
                                            <label key={s} className="flex items-center gap-3">
                                                <input type="checkbox" className="accent-[#66FCF1]" />
                                                {s}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {activeFilter === "Language" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Hindi", "English", "Tamil", "Telugu"].map(l => (
                                            <label key={l} className="flex items-center gap-3">
                                                <input type="checkbox" className="accent-[#66FCF1]" />
                                                {l}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* --- Astrologer Cards Grid --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {astrologersData.map((astro) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={astro.id}
                            className="bg-[#1F2833]/40 border border-white/5 rounded-[2rem] p-5 hover:border-[#66FCF1]/30 transition-all group relative overflow-hidden"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0C10]/60 backdrop-blur-md">
                                <span className={`w-2 h-2 rounded-full ${astro.status === 'Online' ? 'bg-green-500 animate-pulse' : astro.status === 'Busy' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{astro.status}</span>
                            </div>

                            <div className="flex gap-5">
                                {/* Image Section */}
                                <div className="relative">
                                    <img src={astro.img} alt={astro.name} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-[#66FCF1]/30 transition-all" />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#66FCF1] text-[#0B0C10] text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> {astro.rating}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-1">
                                        <h3 className="font-bold text-lg md:text-xl group-hover:text-[#66FCF1] transition-colors">{astro.name}</h3>
                                        <CheckCircle size={16} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">{astro.expertise}</p>
                                    <p className="text-[11px] text-gray-500 mb-2">{astro.language}</p>
                                    <p className="text-xs font-bold text-gray-300">Exp: {astro.exp} Years</p>
                                </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Charge</p>
                                    <p className="font-black text-[#66FCF1]">₹{astro.price}<span className="text-[10px] text-gray-500 font-normal">/min</span></p>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-[#66FCF1] hover:text-[#0B0C10] rounded-xl transition-all border border-white/5 group/btn">
                                        <MessageSquare size={20} />
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-[#66FCF1] text-[#0B0C10] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all active:scale-95">
                                        <Phone size={18} />
                                        <span className="text-sm">Call</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Filter Button for Mobile */}
            <button className="md:hidden fixed bottom-8 right-8 bg-[#66FCF1] text-[#0B0C10] p-4 rounded-full shadow-2xl z-50">
                <Filter size={24} />
            </button>

        </div>
    );
};

export default ConsultNow;