"use client"
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { step: "01", title: "Select Service", desc: "Choose from Kundli, Tarot, or Career guidance." },
    { step: "02", title: "Pick Astrologer", desc: "Browse profiles and check ratings of experts." },
    { step: "03", title: "Start Session", desc: "Click Chat/Call and get your answers instantly." },
];

const HowItWorks = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-[#0B0C10]">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-16 underline decoration-[#66FCF1] decoration-4 underline-offset-[12px]">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Background Decorative Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#66FCF1]/20 to-transparent -z-0"></div>

                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="relative z-10 bg-[#1F2833]/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10"
                        >
                            <div className="text-5xl font-black text-[#66FCF1] opacity-20 mb-4">{item.step}</div>
                            <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;