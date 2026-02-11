// "use client";
// import { use } from "react";
// import { astrologersData } from "@/data/astrologers";
// import { Star, CheckCircle, Phone, MessageSquare, ShieldCheck, Award, Users, Clock } from "lucide-react";
// import { notFound } from "next/navigation";
// import DefaultPageJyotish from "@/components/Jyotish/DefaultPageJyotish";
// import { motion } from "framer-motion";

// export default function AstrologerProfile({ params }) {
//     const resolvedParams = use(params);
//     const id = Number(resolvedParams.id);
//     const astro = astrologersData.find(a => a.id === id);

//     if (!astro) return notFound();

//     return (
//         <DefaultPageJyotish>
//             <div className="bg-[#0B0C10]  text-white pb-24 md:pb-12">
//                 {/* Hero Gradient Background */}
//                 <div className="h-48 md:h-64 bg-gradient-to-r from-[#1F2833] via-[#0B0C10] to-[#1F2833] w-full border-b border-white/5" />

//                 <div className="max-w-6xl mx-auto px-4 -mt-24 md:-mt-32">
//                     <div className="flex flex-col lg:flex-row gap-8">

//                         {/* LEFT COLUMN: Profile Info Card */}
//                         <div className="flex-1">
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="bg-[#1F2833]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl"
//                             >
//                                 <div className="flex flex-col md:flex-row gap-8 items-start">
//                                     {/* Avatar with Ring Animation */}
//                                     <div className="relative group mx-auto md:mx-0">
//                                         <div className="absolute -inset-1 bg-gradient-to-r from-[#66FCF1] to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
//                                         <img
//                                             src={astro.img}
//                                             alt={astro.name}
//                                             className="relative w-40 h-40 md:w-52 md:h-52 rounded-[2.2rem] object-cover border-2 border-white/10"
//                                         />
//                                         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#66FCF1] text-black px-4 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 font-black text-sm">
//                                             <Star size={16} fill="currentColor" /> {astro.rating}
//                                         </div>
//                                     </div>

//                                     {/* Header Info */}
//                                     <div className="flex-1 text-center md:text-left">
//                                         <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
//                                             <h1 className="text-3xl md:text-5xl font-black tracking-tight">{astro.name}</h1>
//                                             <CheckCircle size={24} className="text-[#66FCF1] fill-[#66FCF1]/10" />
//                                         </div>
//                                         <p className="text-[#66FCF1] font-medium text-lg md:text-xl mb-4 uppercase tracking-widest text-[12px]">
//                                             {astro.expertise}
//                                         </p>

//                                         {/* Quick Stats Grid */}
//                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//                                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
//                                                 <Award className="w-5 h-5 text-zinc-500 mb-1 mx-auto md:mx-0" />
//                                                 <p className="text-[10px] uppercase text-zinc-500 font-bold">Experience</p>
//                                                 <p className="font-bold">{astro.exp} Yrs</p>
//                                             </div>
//                                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
//                                                 <Users className="w-5 h-5 text-zinc-500 mb-1 mx-auto md:mx-0" />
//                                                 <p className="text-[10px] uppercase text-zinc-500 font-bold">Consults</p>
//                                                 <p className="font-bold">12K+</p>
//                                             </div>
//                                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
//                                                 <Clock className="w-5 h-5 text-zinc-500 mb-1 mx-auto md:mx-0" />
//                                                 <p className="text-[10px] uppercase text-zinc-500 font-bold">Wait Time</p>
//                                                 <p className="font-bold">~2 min</p>
//                                             </div>
//                                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
//                                                 <ShieldCheck className="w-5 h-5 text-zinc-500 mb-1 mx-auto md:mx-0" />
//                                                 <p className="text-[10px] uppercase text-zinc-500 font-bold">Verified</p>
//                                                 <p className="font-bold text-[#66FCF1]">Yes</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Main Description Section */}
//                                 <div className="mt-12 space-y-6">
//                                     <div>
//                                         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                                             <span className="w-8 h-[2px] bg-[#66FCF1]"></span> About Me
//                                         </h2>
//                                         <p className="text-zinc-400 leading-relaxed text-lg font-light">
//                                             {astro.about}
//                                         </p>
//                                     </div>

//                                     <div className="flex flex-wrap gap-2">
//                                         {astro.language.split(',').map((lang) => (
//                                             <span key={lang} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400">
//                                                 {lang.trim()}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </div>

//                         {/* RIGHT COLUMN: Sticky Pricing & Action Card */}
//                         <div className="lg:w-[380px]">
//                             <motion.div
//                                 initial={{ opacity: 0, x: 20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 className="sticky top-24 bg-gradient-to-b from-[#1F2833] to-[#0B0C10] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
//                             >
//                                 <div className="text-center mb-8">
//                                     <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Consultation Fee</p>
//                                     <h3 className="text-5xl font-black text-[#66FCF1]">₹{astro.price}<span className="text-lg text-zinc-500 font-normal">/min</span></h3>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <button className="w-full py-5 bg-[#66FCF1] text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(102,252,241,0.2)]">
//                                         <MessageSquare size={22} fill="currentColor" /> Chat with {astro.name.split(' ')[0]}
//                                     </button>

//                                     <button className="w-full py-5 border border-[#66FCF1]/30 bg-[#66FCF1]/5 text-[#66FCF1] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#66FCF1]/10 transition-all">
//                                         <Phone size={22} fill="currentColor" /> Voice Call
//                                     </button>
//                                 </div>

//                                 <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
//                                     <div className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
//                                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                                         Available Now (Online)
//                                     </div>
//                                     <div className="p-4 bg-white/5 rounded-2xl text-[11px] text-zinc-500 leading-tight">
//                                         *100% Secure & Confidential Consultation. Your data is protected with end-to-end encryption.
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </div>

//                     </div>
//                 </div>

//                 {/* Mobile Bottom Bar (Sticky) */}
//                 <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex gap-3">
//                     <button className="flex-1 py-4 bg-[#66FCF1] text-black rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-2xl">
//                         <MessageSquare size={18} /> Chat
//                     </button>
//                     <button className="flex-1 py-4 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-2xl">
//                         <Phone size={18} /> Call
//                     </button>
//                 </div>
//             </div>
//         </DefaultPageJyotish>
//     );
// }

"use client";
import { use, useState } from "react";
import { astrologersData } from "@/data/astrologers";
import { Star, CheckCircle, Phone, MessageSquare, ShieldCheck, Award, Users, Clock, Languages, MapPin, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import DefaultPageJyotish from "@/components/Jyotish/DefaultPageJyotish";
import { motion, AnimatePresence } from "framer-motion";

export default function AstrologerProfile({ params }) {
    const resolvedParams = use(params);
    const id = Number(resolvedParams.id);
    const astro = astrologersData.find(a => a.id === id);
    const [activeTab, setActiveTab] = useState("about");

    if (!astro) return notFound();

    return (
        <DefaultPageJyotish>
            <div className="bg-[#0B0C10]  text-zinc-100 font-sans selection:bg-[#66FCF1] selection:text-black">

                {/* 1. ANIMATED BACKGROUND MESH */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66FCF1]/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
                </div>

                {/* 2. HERO SECTION (Visual Header) */}
                <div className="relative h-40 md:h-60 bg-[#1F2833]/30 border-b border-white/5 flex items-end justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, size: '20px 20px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-28 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* --- LEFT: MAIN PROFILE CARD --- */}
                        <div className="lg:col-span-8 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden"
                            >
                                {/* Top Badge */}
                                <div className="absolute top-6 right-8 hidden md:flex items-center gap-2 bg-[#66FCF1]/10 text-[#66FCF1] px-4 py-1.5 rounded-full text-xs font-bold border border-[#66FCF1]/20">
                                    <Sparkles size={14} /> Top Rated Expert
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                    {/* Avatar with Glow */}
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-tr from-[#66FCF1] to-transparent rounded-[3rem] blur opacity-20" />
                                        <img
                                            src={astro.img}
                                            alt={astro.name}
                                            className="relative w-44 h-44 md:w-56 md:h-56 rounded-[2.8rem] object-cover border-4 border-[#0B0C10] shadow-2xl"
                                        />
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#66FCF1] text-black font-black px-5 py-1.5 rounded-2xl flex items-center gap-2 text-sm shadow-xl">
                                            <Star size={16} fill="currentColor" /> {astro.rating}
                                        </div>
                                    </div>

                                    {/* Name & Quick Info */}
                                    <div className="flex-1 pt-4">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent italic">
                                                {astro.name}
                                            </h1>
                                            <CheckCircle size={28} className="text-[#66FCF1] drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]" />
                                        </div>
                                        <p className="text-[#66FCF1] text-lg font-bold tracking-widest uppercase mb-6 flex items-center justify-center md:justify-start gap-2">
                                            <Languages size={18} /> {astro.language}
                                        </p>

                                        {/* Floating Stats Tiles */}
                                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                                            {[
                                                { icon: <Award className="text-orange-400" />, val: astro.exp + " Yrs", label: "Exp." },
                                                { icon: <Users className="text-blue-400" />, val: "15k+", label: "Happy Souls" },
                                                { icon: <Clock className="text-emerald-400" />, val: "24/7", label: "Available" }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/5 rounded-3xl p-3 border border-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="flex flex-col items-center">
                                                        {stat.icon}
                                                        <span className="text-sm font-black mt-1">{stat.val}</span>
                                                        <span className="text-[10px] uppercase text-zinc-500 font-bold">{stat.label}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Tab System */}
                                <div className="mt-16">
                                    <div className="flex gap-8 border-b border-white/5 mb-8">
                                        {['about', 'expertise', 'process'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`pb-4 text-sm font-black uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-[#66FCF1]' : 'text-zinc-500'}`}
                                            >
                                                {tab}
                                                {activeTab === tab && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#66FCF1]" />}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-zinc-400 leading-relaxed text-lg"
                                        >
                                            {activeTab === 'about' && (
                                                <div className="space-y-4">
                                                    <p>{astro.about}</p>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-[#66FCF1]">
                                                        <MapPin size={16} /> Based in India (Vedic Tradition)
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'expertise' && <p>{astro.expertise} Specialist with deep knowledge in planetary alignments and future predictions.</p>}
                                            {activeTab === 'process' && <p>Connect via Chat or Call, share your Birth Details, and get instant solutions to your life problems.</p>}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RIGHT: STICKY BILLING CARD --- */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1F2833]/40 border border-[#66FCF1]/20 rounded-[3rem] p-8 md:p-10 backdrop-blur-3xl shadow-[0_0_50px_rgba(102,252,241,0.05)]"
                            >
                                <div className="text-center mb-10">
                                    <span className="bg-[#66FCF1] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 inline-block">Special Offer Active</span>
                                    <div className="flex items-end justify-center gap-1 mt-2">
                                        <span className="text-5xl font-black text-[#66FCF1]">₹{astro.price}</span>
                                        <span className="text-zinc-500 text-lg font-bold mb-1">/min</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-2">Includes GST & Platform Fees</p>
                                </div>

                                <div className="space-y-4">
                                    <button className="group relative w-full py-5 bg-[#66FCF1] text-black rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-95 overflow-hidden shadow-[0_20px_40px_rgba(102,252,241,0.2)]">
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <MessageSquare size={22} className="relative z-10" />
                                        <span className="relative z-10">Start Consultation</span>
                                    </button>

                                    <button className="w-full py-5 border-2 border-[#66FCF1]/20 hover:border-[#66FCF1] bg-transparent text-[#66FCF1] rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#66FCF1]/5">
                                        <Phone size={22} /> Audio Call
                                    </button>
                                </div>

                                <div className="mt-10 space-y-5">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black uppercase text-white">Encrypted Chat</p>
                                            <p className="text-[10px] text-zinc-500">100% Privacy Guaranteed</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Trust Score: 98% Positive</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>

                {/* 3. MOBILE BOTTOM NAV (GLASS EFFECT) */}
                <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                    <div className="bg-[#1F2833]/80 backdrop-blur-xl border border-white/20 p-2 rounded-[2.2rem] flex gap-2 shadow-2xl">
                        <button className="flex-[2] py-4 bg-[#66FCF1] text-black rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-2">
                            Chat Now
                        </button>
                        <button className="flex-1 py-4 bg-white/10 text-white rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-2 border border-white/10">
                            <Phone size={18} />
                        </button>
                    </div>
                </div>

                <div className="h-20" /> {/* Spacer */}
            </div>
        </DefaultPageJyotish>
    );
}