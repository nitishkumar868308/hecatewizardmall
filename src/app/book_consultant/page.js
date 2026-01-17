"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    User, Calendar, Moon, Sun, Compass, Hash, Gem, Hand,
    Sparkles, Heart, Briefcase, Home, ShieldCheck, Award, MessageSquare
} from "lucide-react";

const Page = () => {
    const services = [
        { title: "Kundli Matching", desc: "Detailed Guna Milan for marriage.", icon: <Moon size={22} /> },
        { title: "Vastu Shastra", desc: "Energize your living space.", icon: <Home size={22} /> },
        { title: "Numerology", desc: "Luck through numbers.", icon: <Hash size={22} /> },
        { title: "Career Guidance", desc: "Success in job & business.", icon: <Briefcase size={22} /> },
        { title: "Gemology", desc: "Right stones for planets.", icon: <Gem size={22} /> },
        { title: "Palmistry", desc: "Destiny in your hands.", icon: <Hand size={22} /> },
        { title: "Love Astrology", desc: "Fix relationship issues.", icon: <Heart size={22} /> },
        { title: "Lal Kitab", desc: "Ancient effective remedies.", icon: <ShieldCheck size={22} /> },
    ];

    const consultants = [
        {
            name: " Prateek Jain",
            role: "Vedic & KP Astrologer",
            exp: "15+ Years",
            img: "/image/Pratiek A jain.jpg",
            specialty: "Marriage & Career Specialist",
            rating: "4.9/5"
        },
        {
            name: "Koyal Sharma",
            role: "Numerology Expert",
            exp: "10+ Years",
            img: "/image/koyal.jpeg",
            specialty: "Business Growth Expert",
            rating: "4.8/5"
        },
    ];

    // Star background generation
    const stars = useMemo(() => Array.from({ length: 400 }), []);

    return (
        <div className="w-full min-h-screen text-white bg-[#020202] relative font-sans overflow-x-hidden">

            {/* ================= GLOBAL STAR BACKGROUND (Strictly Behind Everything) ================= */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {stars.map((_, i) => (
                    <div
                        key={i}
                        className="star-blink"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            animationDuration: `${Math.random() * 2 + 1}s`,
                            animationDelay: `${Math.random() * 3}s`,
                            background: Math.random() > 0.7 ? "#66FCF1" : "white",
                        }}
                    />
                ))}
            </div>

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen flex items-center justify-center px-6 z-10">
                <div className="text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66FCF1] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#66FCF1]"></span>
                        </span>
                        <span className="text-[#66FCF1] text-[10px] font-black tracking-widest uppercase">Live Consultations Available</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-9xl font-black mb-8 leading-none uppercase tracking-tighter"
                    >
                        Align Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66FCF1] via-[#45A29E] to-white">Stars</span>
                    </motion.h1>

                    <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base mb-12 uppercase tracking-[0.2em] font-light leading-loose">
                        Decode the cosmic blueprint of your life with India&apos;s most accurate predictors.
                    </p>

                    <div className="relative inline-block group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#66FCF1] to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <button className="relative px-12 py-6 bg-black rounded-xl text-white font-black text-xs uppercase tracking-widest border border-white/10 group-hover:border-[#66FCF1]/50 transition-all">
                            Start Consultation
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= SERVICES SECTION ================= */}
            <section className="py-32 px-6 relative z-10 bg-[#050505]/50 backdrop-blur-sm border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col mb-16">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Cosmic <span className="text-[#66FCF1]">Specializations</span></h2>
                        <div className="h-1 w-40 bg-gradient-to-r from-[#66FCF1] to-transparent mt-4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 rounded-3xl group hover:border-[#66FCF1]/20 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-[#66FCF1] mb-6 group-hover:bg-[#66FCF1] group-hover:text-black transition-all">
                                    {s.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{s.title}</h3>
                                <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-300">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= EXPERTS SECTION (Updated & Responsive) ================= */}
            <section className="py-32 px-6 relative z-10 overflow-hidden">
                {/* Background Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#66FCF1]/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <span className="text-[#66FCF1] text-[10px] font-black tracking-[0.5em] uppercase block mb-4">World Class Guidance</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                            Our Top <span className="italic text-zinc-500 underline decoration-[#66FCF1] decoration-4 underline-offset-8">Predictors</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                        {consultants.map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col md:flex-row items-center md:items-stretch gap-8 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-[#66FCF1]/30 transition-all duration-500 group"
                            >
                                {/* Left Side: Image Container (Fixed Scaling) */}
                                <div className="relative w-full md:w-64 h-80 shrink-0 overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/5 shadow-2xl">
                                    {/* Decorative background behind image */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#66FCF1_1px,transparent_1px)] [background-size:16px_16px]" />

                                    <img
                                        src={c.img}
                                        alt={c.name}
                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700 relative z-10"
                                    />

                                    {/* Rating Tag Overlay */}
                                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[#66FCF1] text-[10px] font-black tracking-tighter">
                                        <Award size={12} fill="#66FCF1" /> {c.rating}
                                    </div>
                                </div>

                                {/* Right Side: Content */}
                                <div className="flex flex-col justify-between flex-grow text-center md:text-left py-2">
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase mb-1 tracking-tight group-hover:text-[#66FCF1] transition-colors line-clamp-1">
                                            {c.name}
                                        </h3>
                                        <p className="text-[#66FCF1]/70 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                            {c.role}
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                    <Calendar size={14} className="text-[#66FCF1]" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                    {c.exp} Experience
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                    <Sparkles size={14} className="text-[#66FCF1]" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 line-clamp-1">
                                                    {c.specialty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <button className="flex-[3] px-6 py-4 bg-[#66FCF1] text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_10px_30px_rgba(102,252,241,0.2)] active:scale-95">
                                            Chat Now
                                        </button>
                                        <button className="flex-1 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group/btn flex justify-center">
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-5xl mx-auto rounded-[4rem] p-1 bg-gradient-to-r from-transparent via-[#66FCF1]/50 to-transparent">
                    <div className="bg-[#080808] rounded-[3.9rem] p-12 md:p-24 text-center">
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">Don&apos;t Wait For <br /> <span className="text-[#66FCF1]">A Miracle.</span></h2>
                        <p className="text-zinc-500 mb-12 max-w-lg mx-auto uppercase text-xs tracking-[0.3em]">Make it happen with expert celestial guidance.</p>
                        <button className="px-16 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-full hover:bg-[#66FCF1] transition-all hover:scale-105 active:scale-95">
                            Book Today
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= CSS ANIMATIONS ================= */}
            <style jsx global>{`
                .star-blink {
                    position: absolute;
                    border-radius: 50%;
                    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                    animation: twinkle-vibrant 2s infinite alternate ease-in-out;
                    z-index: 0; /* Ensures stars stay in the back */
                }

                @keyframes twinkle-vibrant {
                    0% { opacity: 0.1; transform: scale(0.5); }
                    100% { 
                        opacity: 0.8; 
                        transform: scale(1.2);
                        box-shadow: 0 0 12px #66FCF1;
                    }
                }

                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: #020202; }
                ::-webkit-scrollbar-thumb { background: #66FCF1; border-radius: 10px; }

                body {
                    background-color: #020202;
                    margin: 0;
                    padding: 0;
                }

                html { scroll-behavior: smooth; }
            `}</style>
        </div>
    );
};

export default Page;