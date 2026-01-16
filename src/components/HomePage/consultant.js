"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ConsultantSection = () => {
    const services = [
        { title: "Birth Chart Reading", desc: "Understand your personality, destiny and life patterns.", icon: "◈", img: "https://images.unsplash.com/photo-1506318137071-a8e063b4b47e?q=80&w=800" },
        { title: "Love & Relationships", desc: "Clarity in love, marriage and emotional connections.", icon: "✧", img: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=800" },
        { title: "Career Guidance", desc: "Find direction, purpose and professional growth.", icon: "✦", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800" },
        { title: "Vastu Consultation", desc: "Align your living space with positive cosmic energies.", icon: "⊛", img: "https://images.unsplash.com/photo-1585336139118-b31920ad10ff?q=80&w=800" },
        { title: "Numerology", desc: "Unlock the hidden power and meaning behind numbers.", icon: "⌬", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800" },
    ];

    return (
        <section className="relative bg-[#080808] py-28 overflow-hidden">
            {/* Background Ambient Light */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-amber-500 text-[10px] font-black uppercase tracking-[0.6em] block mb-4">Divine Wisdom</motion.span>
                    <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-light text-white tracking-tighter leading-none">
                        Consult the <span className="font-serif italic text-gray-500">Stars</span>
                    </motion.h2>
                </div>
                <p className="text-gray-500 text-sm max-w-[300px] font-light leading-relaxed">
                    Deep dive into the mystical arts with our expert practitioners. Personalized sessions for your soul.
                </p>
            </div>

            {/* HORIZONTAL SLIDING AREA */}
            <div className="relative group">
                <motion.div
                    className="flex gap-8 px-6 cursor-grab active:cursor-grabbing"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    style={{ width: "fit-content" }}
                >
                    {/* Mapping twice for infinite effect */}
                    {[...services, ...services].map((service, i) => (
                        <div key={i} className="w-[300px] md:w-[450px] shrink-0 group/card relative aspect-[16/10] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                            <img src={service.img} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-[2s]" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <span className="text-amber-500 text-3xl mb-4">{service.icon}</span>
                                <h3 className="text-2xl md:text-3xl font-serif italic text-white mb-2">{service.title}</h3>
                                <p className="text-gray-400 text-sm font-light max-w-[280px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* THE ATTRACTIVE BUTTON */}
            <div className="mt-24 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-block relative"
                >
                    {/* Outer Pulsing Glow */}
                    <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse rounded-full" />

                    <button className="relative z-10 px-16 py-6 bg-gradient-to-r from-amber-600 to-amber-400 text-black text-[12px] font-black uppercase tracking-[0.5em] rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_60px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <span className="relative z-10 flex items-center gap-4">
                            Book Your Sacred Session
                            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </span>

                        {/* Shine effect on hover */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[25deg] group-hover:left-[100%] transition-all duration-1000" />
                    </button>

                    <p className="mt-6 text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">Limited slots available for January</p>
                </motion.div>
            </div>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
        </section>
    );
};

export default ConsultantSection;