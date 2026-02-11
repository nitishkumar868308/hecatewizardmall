"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Star, Filter, Search, CheckCircle } from 'lucide-react';
import { useRouter } from "next/navigation";
import { astrologersData } from "@/data/astrologers";

// const astrologersData = [
//     { id: 1, name: "Acharya Vardhan", expertise: "Vedic, Vastu", language: "Hindi, English", exp: 12, price: 25, rating: 4.9, reviews: "1.2k", status: "Online", img: "https://i.pravatar.cc/150?u=1" },
//     { id: 2, name: "Sonia Tarot", expertise: "Tarot, Face Reading", language: "English, Punjabi", exp: 8, price: 15, rating: 4.8, reviews: "850", status: "Online", img: "https://i.pravatar.cc/150?u=2" },
//     { id: 3, name: "Pt. Radhe Shyam", expertise: "Palmistry, Kundli", language: "Hindi", exp: 20, price: 50, rating: 5.0, reviews: "2.5k", status: "Busy", img: "https://i.pravatar.cc/150?u=3" },
//     { id: 4, name: "Astrologer Meera", expertise: "Numerology", language: "Hindi, English", exp: 5, price: 10, rating: 4.7, reviews: "400", status: "Online", img: "https://i.pravatar.cc/150?u=4" },
//     { id: 5, name: "Dr. Aditya", expertise: "Psychic, Vedic", language: "English", exp: 15, price: 40, rating: 4.9, reviews: "900", status: "Offline", img: "https://i.pravatar.cc/150?u=5" },
// ];

const categories = ["All", "Vedic", "Tarot", "Numerology", "Vastu", "Palmistry"];

const ConsultNow = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("All");
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Price");

    const FilterCheckbox = ({ label }) => (
        <label className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#66FCF1]/30 cursor-pointer transition-all">
            <span className="text-gray-200 group-hover:text-white transition-colors">{label}</span>
            <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-700 bg-transparent text-[#66FCF1] focus:ring-[#66FCF1] focus:ring-offset-0 accent-[#66FCF1]"
            />
        </label>
    );


    return (
        <div className=" bg-[#0B0C10] text-white pt-24 pb-12 px-4 md:px-8">

            {/* --- Search & Filter Header --- */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2">Consult <span className="text-[#66FCF1]">Astrologers</span></h1>
                        {/* <p className="text-gray-400">Directly connect with India's top spiritual experts</p> */}
                    </div>

                    {/* <div className="flex gap-3 items-center">
                        
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

                 
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="hidden lg:flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#66FCF1] text-[#0B0C10] font-bold hover:scale-95 transition"
                        >
                            <Filter size={24} />
                            Filters
                        </button>

                    </div> */}
                </div>

                <div className="flex gap-3 items-center w-full">

                    {/* Search */}
                    <div className="relative group flex-1">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#66FCF1]"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search by name or expertise..."
                            className="w-full bg-[#1F2833] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[#66FCF1]/50"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="hidden lg:flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#66FCF1] text-[#0B0C10] font-bold hover:scale-95 transition"
                    >
                        <Filter size={24} />
                        Filters
                    </button>

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
                    <div className="fixed inset-0 z-[9999] flex justify-end">
                        {/* Backdrop with Blur */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                            onClick={() => setFilterOpen(false)}
                        />

                        {/* Modal Container */}
                        <div className="relative h-full w-full md:w-[600px] bg-[#0B0C10] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#66FCF1]">Filters</h2>
                                <button
                                    onClick={() => setFilterOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                                {/* LEFT TABS - Responsive: Horizontal on Mobile, Vertical on MD+ */}
                                <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
                                    {["Price", "Experience", "Services", "Language"].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setActiveFilter(item)}
                                            className={`flex-1 md:flex-none text-center md:text-left px-6 py-4 text-sm font-medium transition-all whitespace-nowrap
                ${activeFilter === item
                                                    ? "bg-[#66FCF1]/10 text-[#66FCF1] border-b-2 md:border-b-0 md:border-l-4 border-[#66FCF1]"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>

                                {/* RIGHT OPTIONS - Scrollable */}
                                <div className="flex-1 p-6 overflow-y-auto bg-[#13151c]">
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">
                                            Select {activeFilter}
                                        </h3>

                                        {/* Dynamic Content Mapping */}
                                        <div className={`${activeFilter === "Services" || activeFilter === "Language" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}`}>

                                            {/* Price Filter */}
                                            {activeFilter === "Price" && ["₹0 - ₹100", "₹100 - ₹300", "₹300+"].map(p => (
                                                <FilterCheckbox key={p} label={p} />
                                            ))}

                                            {/* Experience Filter */}
                                            {activeFilter === "Experience" && ["1-3 Years", "3-5 Years", "5+ Years"].map(e => (
                                                <FilterCheckbox key={e} label={e} />
                                            ))}

                                            {/* Services Filter */}
                                            {activeFilter === "Services" && ["Vedic", "Tarot", "Palmistry", "Numerology", "Face Reading", "Vastu"].map(s => (
                                                <FilterCheckbox key={s} label={s} />
                                            ))}

                                            {/* Language Filter */}
                                            {activeFilter === "Language" && ["Hindi", "English", "Tamil", "Telugu", "Marathi"].map(l => (
                                                <FilterCheckbox key={l} label={l} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 flex items-center gap-4 bg-[#0B0C10]">
                                <button
                                    className="flex-1 py-3 text-gray-400 hover:text-white font-semibold transition"
                                    onClick={() => {/* Reset logic */ }}
                                >
                                    Clear All
                                </button>
                                <button
                                    className="flex-[2] py-3 bg-[#66FCF1] text-[#0B0C10] rounded-xl font-bold shadow-lg shadow-[#66FCF1]/20 hover:scale-[1.02] active:scale-95 transition"
                                    onClick={() => setFilterOpen(false)}
                                >
                                    Apply Filters
                                </button>
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
                            onClick={() => router.push(`/jyotish/astrologer/${astro.id}`)}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={astro.id}
                            className="bg-[#1F2833]/40 border border-white/5 rounded-[2rem] p-5 hover:border-[#66FCF1]/30 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full  backdrop-blur-md">
                                <span
                                    className={`w-2 h-2 rounded-full ${astro.status === "Online"
                                        ? "bg-green-500 animate-pulse"
                                        : astro.status === "Busy"
                                            ? "bg-red-500"
                                            : "bg-gray-500"
                                        }`}
                                ></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {astro.status}
                                </span>
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
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-lg md:text-xl group-hover:text-[#66FCF1] transition-colors">
                                            {astro.name}
                                        </h3>
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Chat clicked");
                                        }}
                                        className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-[#66FCF1] text-[#0B0C10] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all active:scale-95">
                                        <MessageSquare size={18} />
                                        <span className="text-sm">Chat</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Call clicked");
                                        }}
                                        className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-[#66FCF1] text-[#0B0C10] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all active:scale-95">
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
            <button onClick={() => setFilterOpen(true)} className="md:hidden fixed bottom-8 right-8 bg-[#66FCF1] text-[#0B0C10] p-4 rounded-full shadow-2xl z-50">
                <Filter size={24} />
            </button>

        </div>
    );
};

export default ConsultNow;