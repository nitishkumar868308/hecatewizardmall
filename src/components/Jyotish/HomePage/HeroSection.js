"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone,Sparkles  } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { useRouter } from "next/navigation";

const HeroSection = () => {
    const router = useRouter();

    return (
        <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden bg-[#0B0C10]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#66FCF1] opacity-10 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase border border-[#66FCF1]/30 rounded-full text-[#66FCF1] bg-[#66FCF1]/5">
                    ✨ Trusted by 1M+ Seekers
                </span>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
                    Consult India&apos;s Best <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66FCF1] to-[#45A29E]">
                        <Typewriter
                            words={[
                                'Astrologers Live',
                                'Tarot Experts',
                                'Vedic Astrologers',
                                'Numerology Experts',
                            ]}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={80}
                            deleteSpeed={50}
                            delaySpeed={1200}
                        />
                    </span>
                </h1>

                {/* <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                    Chat with experts starting at just <span className="text-[#66FCF1] font-bold">₹1</span>.
                    Reveal your destiny through Vedic Astrology & Tarot.
                </p> */}

                {/* BUTTONS */}
                {/* <div className="flex flex-wrap justify-center gap-5">
                    
              
                    <button className="relative flex items-center gap-2 bg-[#66FCF1] text-[#0B0C10] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(102,252,241,0.3)]">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <MessageSquare size={20} /> Chat Now
                    </button>

                
                    <button className="relative flex items-center gap-2 bg-[#1F2833] border border-[#45A29E]/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-[#45A29E]/10 transition-all">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <Phone size={20} /> Call Now
                    </button>

                </div> */}

                <div className="flex flex-wrap justify-center gap-5">
                    {/* Consult Button */}
                    <button  onClick={() => router.push("/jyotish/consult-now")} className="cursor-pointer relative flex items-center gap-2 bg-[#66FCF1] text-[#0B0C10] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(102,252,241,0.3)]">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-700"></span>
                        </span>
                        <Sparkles size={20} /> Consult Now
                    </button>                    

                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
