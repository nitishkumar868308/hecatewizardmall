"use client";
import { use, useEffect, useState } from "react";
import {
    Star, CheckCircle, Phone, MessageSquare, ShieldCheck,
    Award, Users, Clock, Languages, MapPin, Sparkles,
    Verified, Heart, Share2, Info
} from "lucide-react";
import { notFound } from "next/navigation";
import DefaultPageJyotish from "@/components/Jyotish/DefaultPageJyotish";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAstrologers } from "@/app/redux/slices/jyotish/Register/RegisterSlice";

export default function AstrologerProfile({ params }) {
    const dispatch = useDispatch();
    const { astrologers } = useSelector((state) => state.jyotishRegister);
    const [activeTab, setActiveTab] = useState("about");

    const resolvedParams = use(params);
    const id = Number(resolvedParams.id);

    useEffect(() => {
        if (!astrologers?.length) {
            dispatch(fetchAstrologers());
        }
    }, [dispatch, astrologers]);

    const astro = astrologers?.find((a) => a.id === id);

    if (!astrologers?.length) {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#66FCF1] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!astro) return notFound();

    const name = astro.displayName || astro.fullName;
    const image = astro?.profile?.image || `https://i.pravatar.cc/300?u=${astro.id}`;
    const experience = astro?.profile?.experience || 0;
    const languages = Array.isArray(astro?.profile?.languages)
        ? astro.profile.languages.join(", ")
        : astro?.profile?.languages || "Hindi, English";

    const services = astro?.services || [];
    const price = services[0]?.price || 0;
    const currency = services[0]?.currencySymbol || "₹";

    return (
        <DefaultPageJyotish>
            <div className="bg-[#0B0C10] text-zinc-100 min-h-screen pb-20">
                {/* Hero Banner Area */}
                <div className="h-48 md:h-72 bg-gradient-to-b from-[#1F2833] to-[#0B0C10] relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 md:-mt-32 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
                        
                        {/* LEFT COLUMN: Profile Info */}
                        <div className="lg:col-span-8 space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#161B22]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                    {/* Profile Image & Status */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#66FCF1] to-[#45A29E] rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                        <img 
                                            src={image} 
                                            alt={name} 
                                            className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] object-cover border-4 border-[#161B22]" 
                                        />
                                        <div className="absolute bottom-4 right-4 bg-green-500 w-5 h-5 rounded-full border-4 border-[#161B22] animate-pulse" />
                                    </div>

                                    {/* Identity Section */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3">
                                            <span className="bg-[#66FCF1]/10 text-[#66FCF1] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-[#66FCF1]/20">
                                                <Verified size={14} /> VERIFIED EXPERT
                                            </span>
                                            <span className="bg-white/5 text-yellow-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star size={14} fill="currentColor" /> 4.9 (1.2k+ Reviews)
                                            </span>
                                        </div>

                                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 leading-tight">
                                            {name}
                                        </h1>
                                        
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 text-sm md:text-base font-medium">
                                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#66FCF1]" /> India</span>
                                            <span className="flex items-center gap-1.5"><Languages size={16} className="text-[#66FCF1]" /> {languages}</span>
                                        </div>

                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8">
                                            {[
                                                { icon: <Award className="text-[#66FCF1]" />, label: "Experience", value: `${experience} Yrs` },
                                                { icon: <Users className="text-[#66FCF1]" />, label: "Consulted", value: "15k+" },
                                                { icon: <Clock className="text-[#66FCF1]" />, label: "Availability", value: "Online" }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/5 border border-white/5 p-3 md:p-4 rounded-3xl hover:bg-white/10 transition-colors">
                                                    <div className="flex justify-center md:justify-start mb-1">{stat.icon}</div>
                                                    <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">{stat.label}</p>
                                                    <p className="text-sm md:text-lg font-bold text-white">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Tabs */}
                                <div className="mt-12">
                                    <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
                                        {["about", "services", "reviews"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`pb-4 text-sm md:text-base font-bold uppercase tracking-widest transition-all relative ${
                                                    activeTab === tab ? "text-[#66FCF1]" : "text-gray-500 hover:text-gray-300"
                                                }`}
                                            >
                                                {tab}
                                                {activeTab === tab && (
                                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#66FCF1] rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="min-h-[200px]"
                                        >
                                            {activeTab === "about" && (
                                                <div className="prose prose-invert max-w-none">
                                                    <h4 className="text-white flex items-center gap-2 mb-4"><Info size={20} className="text-[#66FCF1]" /> Professional Bio</h4>
                                                    <p className="text-gray-400 leading-relaxed text-lg">
                                                        {astro?.profile?.bio || "Expert in Vedic Astrology, Kundli Matching, and Career guidance with over a decade of experience in helping people find their cosmic path."}
                                                    </p>
                                                </div>
                                            )}

                                            {activeTab === "services" && (
                                                <div className="grid gap-4">
                                                    {services.map((s) => (
                                                        <div key={s.id} className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-[#66FCF1]/30 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-[#66FCF1]/10 flex items-center justify-center text-[#66FCF1]">
                                                                    <Sparkles size={18} />
                                                                </div>
                                                                <span className="font-bold text-lg">{s.serviceName}</span>
                                                            </div>
                                                            <span className="text-xl font-black text-[#66FCF1]">{currency}{s.price}<small className="text-[10px] text-gray-500 ml-1">/MIN</small></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: Action Card */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-10 space-y-4">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#1F2833] p-8 rounded-[2.5rem] border border-[#66FCF1]/20 shadow-[0_0_50px_rgba(102,252,241,0.1)]"
                                >
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2">Consultation Fee</p>
                                    <div className="flex items-baseline gap-2 mb-8">
                                        <h2 className="text-5xl font-black text-white">{currency}{price}</h2>
                                        <span className="text-gray-400 font-medium">per minute</span>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full py-5 bg-[#66FCF1] text-[#0B0C10] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all active:scale-[0.98]">
                                            <MessageSquare fill="currentColor" /> START CHAT
                                        </button>

                                        <button className="w-full py-5 border-2 border-[#66FCF1] text-[#66FCF1] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#66FCF1]/5 transition-all active:scale-[0.98]">
                                            <Phone fill="currentColor" /> VOICE CALL
                                        </button>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <ShieldCheck size={18} className="text-[#66FCF1]" />
                                            <span>100% Private & Confidential</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <CheckCircle size={18} className="text-[#66FCF1]" />
                                            <span>Money-back Guarantee</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/10 transition-all">
                                        <Heart size={18} /> Favorite
                                    </button>
                                    <button className="flex-1 py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/10 transition-all">
                                        <Share2 size={18} /> Share
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DefaultPageJyotish>
    );
}