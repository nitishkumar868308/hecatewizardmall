"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Globe, ShieldCheck, Heart, Star, Compass, Zap } from 'lucide-react';

const AboutUs = () => {
    const stats = [
        { label: "Verified Astrologers", value: "500+", icon: <Users className="text-[#66FCF1]" /> },
        { label: "Consultations Provided", value: "10M+", icon: <Sparkles className="text-yellow-400" /> },
        { label: "Global Reach", value: "120+", icon: <Globe className="text-blue-400" /> },
        { label: "Customer Satisfaction", value: "4.9/5", icon: <Star className="text-orange-400" /> },
    ];

    const values = [
        {
            title: "Ancient Wisdom",
            desc: "We preserve the sanctity of Vedic Astrology, keeping the original scriptures at the heart of our predictions.",
            icon: <Compass className="w-6 h-6 text-[#66FCF1]" />
        },
        {
            title: "Modern Precision",
            desc: "Our proprietary algorithms ensure that planetary positions are calculated with astronomical accuracy.",
            icon: <Zap className="w-6 h-6 text-[#66FCF1]" />
        },
        {
            title: "Uncompromising Privacy",
            desc: "Your spiritual journey is personal. We ensure end-to-end encryption for every chat and call.",
            icon: <ShieldCheck className="w-6 h-6 text-[#66FCF1]" />
        }
    ];

    return (
        <div className="bg-[#0B0C10] text-white min-h-screen font-sans selection:bg-[#66FCF1] selection:text-black">

            {/* --- HERO SECTION: Minimal & Deep --- */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#66FCF115_0%,_transparent_70%)] blur-3xl" />

                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#66FCF1]/30 bg-[#66FCF1]/5 text-[#66FCF1] text-[10px] font-black uppercase tracking-[0.4em]"
                    >
                        Our cosmic story
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
                    >
                        Bridging The Gap <br />
                        <span className="bg-gradient-to-r from-[#66FCF1] to-blue-500 bg-clip-text text-transparent italic">Between Stars & You</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
                    >
                        We are a digital sanctuary for spiritual seekers, blending centuries-old Vedic tradition with the speed of tomorrow&apos;s technology.
                    </motion.p>
                </div>
            </section>

            {/* --- BENTO STATS SECTION --- */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1F2833]/20 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-[#66FCF1]/30 transition-all"
                        >
                            <div className="mb-4 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <h2 className="text-4xl font-black text-white mb-1">{stat.value}</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- CORE PHILOSOPHY: THE MODERN GRID --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#66FCF1]/20 to-blue-500/20 blur-3xl opacity-50 rounded-[4rem] group-hover:opacity-80 transition-opacity" />
                        <img
                            src="https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=2000&auto=format&fit=crop"
                            alt="The Universe"
                            className="relative rounded-[3.5rem] grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 shadow-2xl"
                        />
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Empowering Lives <br />Through <span className="text-[#66FCF1]">Cosmic Clarity.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                Founded with the vision to democratize spiritual guidance, our platform serves as a bridge between world-class Vedic experts and seekers across the globe. We believe that astrology is not just about predictions—it&apos;s about preparation.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {values.map((v, i) => (
                                <div key={i} className="flex gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/[0.08] transition-all">
                                    <div className="shrink-0 w-12 h-12 bg-[#66FCF1]/10 rounded-2xl flex items-center justify-center">
                                        {v.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-white mb-2">{v.title}</h4>
                                        <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TRUST BANNER --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto border-y border-white/5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
                    <p className="text-center font-black tracking-widest text-sm italic">TRUSTED BY 1M+</p>
                    <p className="text-center font-black tracking-widest text-sm italic">ISO CERTIFIED</p>
                    <p className="text-center font-black tracking-widest text-sm italic">24/7 SUPPORT</p>
                    <p className="text-center font-black tracking-widest text-sm italic">SECURE PAYMENTS</p>
                </div>
            </section>

            {/* --- MODERN CALL TO ACTION --- */}
            <section className="py-32 px-6">
                <motion.div
                    whileInView={{ scale: [0.95, 1] }}
                    className="max-w-6xl mx-auto bg-gradient-to-b from-[#1F2833] to-[#0B0C10] rounded-[4rem] p-12 md:p-24 text-center border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#66FCF1] to-transparent" />

                    <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-none">
                        Ready to navigate <br /> your <span className="text-[#66FCF1]">Destiny?</span>
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button className="w-full md:w-auto px-12 py-6 bg-[#66FCF1] text-black font-black rounded-2xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(102,252,241,0.2)]">
                            Talk to an Astrologer
                        </button>
                        <button className="w-full md:w-auto px-12 py-6 border border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition-all">
                            View Our Story
                        </button>
                    </div>
                </motion.div>
            </section>

        </div>
    );
};

export default AboutUs;