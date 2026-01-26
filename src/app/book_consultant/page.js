"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Moon, Home, Gem, ShieldCheck, Hand, Hash, Heart, Briefcase,
    Star, MessageSquare, CheckCircle2, Sparkles, ChevronRight, X, Clock, Calendar
} from "lucide-react";

const AstrologyPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);

    // --- Selection States ---
    const [selectedService, setSelectedService] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");

    const consultants = [
        {
            name: "Pratiek A Jain",
            role: "Vedic & KP Astrology Specialist",
            exp: "15+ Years",
            img: "/image/Pratiek A jain.jpg",
            rating: "4.9",
            skills: ["Marriage Issues", "Corporate Vastu", "Financial Growth"],
            isOnline: true
        },
        {
            name: "Kakullie A Jain",
            role: "Master Numerologist & Tarot Reader",
            exp: "10+ Years",
            img: "/image/koyal.jpeg",
            rating: "4.8",
            skills: ["Name Correction", "Relationship Healing", "Career Path"],
            isOnline: true
        },
    ];

    const services = [
        { title: "Kundli Reading", icon: <Moon />, desc: "Detailed analysis of your birth chart." },
        { title: "Vastu Shastra", icon: <Home />, desc: "Balance energies in your living space." },
        { title: "Gemology", icon: <Gem />, desc: "Find the right stone for your destiny." },
        { title: "Remedial Puja", icon: <ShieldCheck />, desc: "Custom rituals to remove life obstacles." },
        { title: "Palmistry", icon: <Hand />, desc: "Insights hidden in your palm lines." },
        { title: "Numerology", icon: <Hash />, desc: "The power of numbers in your name." },
        { title: "Love & Marriage", icon: <Heart />, desc: "Compatibility and relationship guidance." },
        { title: "Career Growth", icon: <Briefcase />, desc: "Timing for business and job success." },
    ];

    const stars = useMemo(() => Array.from({ length: 100 }), []);

    const openBooking = (expert) => {
        setSelectedExpert(expert);
        setIsModalOpen(true);
        // Reset selections when opening for a new expert
        setSelectedService("");
        setSelectedDuration(null);
        setSelectedSlot("");
    };

    return (
        <div className="w-full min-h-screen text-white bg-[#020202] relative font-sans overflow-x-hidden selection:bg-[#66FCF1] selection:text-black">

            {/* GLOBAL STAR BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {stars.map((_, i) => (
                    <div key={i} className="star-blink" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${1 + Math.random() * 1.5}px`,
                        height: `${1 + Math.random() * 1.5}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        background: i % 3 === 0 ? "#66FCF1" : "white",
                    }} />
                ))}
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-10 pb-20 px-6 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-tight mb-6">
                        Decode Your <br />
                        <span className="text-[#66FCF1]">Destiny.</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed tracking-wide font-medium">
                        India’s top-rated Vedic experts help you navigate life’s biggest
                        questions with <span className="text-white">astrological precision.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="px-8 py-4 bg-[#66FCF1] text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all">
                            Talk to an Expert
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* EXPERTS SECTION */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {consultants.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group p-6 rounded-[3rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-[#66FCF1]/30 transition-all duration-500 overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                <div className="relative w-full lg:w-48 aspect-[4/5] lg:h-64 shrink-0 overflow-hidden rounded-[2rem] bg-zinc-800">
                                    <Image
                                        src={c.img} alt={c.name} fill
                                        className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {c.isOnline && (
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#66FCF1]/30 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" />
                                            <span className="text-[8px] font-black">LIVE</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                                        <h3 className="text-2xl font-black uppercase tracking-tight">{c.name}</h3>
                                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                            <Star size={12} fill="#66FCF1" className="text-[#66FCF1]" />
                                            <span className="text-xs font-bold">{c.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-[#66FCF1] text-[10px] font-bold uppercase tracking-widest mb-4">{c.role}</p>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                        {c.skills.map((s, idx) => (
                                            <span key={idx} className="text-[9px] px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-full text-zinc-400">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openBooking(c)} className="flex-1 py-4 bg-[#66FCF1] text-black font-black text-[10px] uppercase rounded-2xl active:scale-95 transition-transform">Start Session</button>
                                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl"><MessageSquare size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- BOOKING MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Book Your <span className="text-[#66FCF1]">Session</span></h2>
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">Consulting with {selectedExpert?.name}</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6 text-left">
                                    {/* Service Selection */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Choose Service</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Vedic Reading", "Numerology", "Vastu Advice", "Tarot Guide"].map((s) => (
                                                <div
                                                    key={s}
                                                    onClick={() => setSelectedService(s)}
                                                    className={`p-3 border rounded-xl text-xs font-bold cursor-pointer transition-all text-center ${selectedService === s
                                                            ? "border-[#66FCF1] bg-[#66FCF1]/10 text-[#66FCF1]"
                                                            : "border-white/5 bg-white/[0.02] text-white hover:border-white/20"
                                                        }`}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Duration Selection */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Session Duration</label>
                                        <div className="flex gap-4">
                                            {[15, 30, 60].map((min) => (
                                                <button
                                                    key={min}
                                                    onClick={() => setSelectedDuration(min)}
                                                    className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${selectedDuration === min
                                                            ? "bg-[#66FCF1] text-black border-[#66FCF1]"
                                                            : "border-white/5 bg-white/[0.02] text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    <Clock size={14} /> {min} Mins
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Slot Selection */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Available Slots (Today)</label>
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {["10:30 AM", "12:00 PM", "02:30 PM", "05:00 PM", "07:30 PM"].map((time) => (
                                                <div
                                                    key={time}
                                                    onClick={() => setSelectedSlot(time)}
                                                    className={`shrink-0 px-5 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedSlot === time
                                                            ? "border-[#66FCF1] bg-[#66FCF1]/10 text-[#66FCF1]"
                                                            : "border-white/5 bg-white/[0.02] text-white hover:border-[#66FCF1]/50"
                                                        }`}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SELECTION SUMMARY (Dynamic Display) */}
                                    {(selectedService || selectedDuration || selectedSlot) && (
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mt-4">
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">Your Selection</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium">
                                                {selectedService && <span className="text-[#66FCF1]">● {selectedService}</span>}
                                                {selectedDuration && <span className="text-white">● {selectedDuration} Mins</span>}
                                                {selectedSlot && <span className="text-white">● {selectedSlot}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full mt-8 py-5 bg-[#66FCF1] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(102,252,241,0.2)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                    disabled={!selectedService || !selectedDuration || !selectedSlot}
                                    onClick={() => {
                                        alert(`Booking ${selectedService} for ${selectedDuration} mins at ${selectedSlot}`);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Confirm & Pay
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DYNAMIC SERVICE SECTION */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/image/back1.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-40 grayscale-[20%]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Our <span className="text-[#66FCF1]">Services</span>
                        </h2>
                        <p className="text-zinc-400 text-xs md:text-sm mt-4 max-w-xl uppercase tracking-widest">
                            Ancient wisdom meet modern technology to guide your path.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="group p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#66FCF1]/40 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#66FCF1]/10 flex items-center justify-center text-[#66FCF1] mb-6 group-hover:bg-[#66FCF1] group-hover:text-black transition-colors duration-500">
                                    {React.cloneElement(service.icon, { size: 24 })}
                                </div>
                                <h3 className="text-lg font-bold uppercase mb-2 group-hover:text-[#66FCF1] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-zinc-500 text-[11px] leading-relaxed mb-6">
                                    {service.desc}
                                </p>
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#66FCF1] cursor-pointer">
                                    Explore <ChevronRight size={12} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .star-blink { position: absolute; border-radius: 50%; animation: twinkle linear infinite; z-index: 0; }
                @keyframes twinkle { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: #66FCF1; border-radius: 10px; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default AstrologyPage;