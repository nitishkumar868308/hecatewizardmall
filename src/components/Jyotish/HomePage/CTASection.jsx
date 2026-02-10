"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 px-6">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-[#1F2833] to-[#0B0C10] border border-[#66FCF1]/20 p-12 md:p-20 text-center"
            >
                {/* Abstract Glow Shapes */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#66FCF1] opacity-10 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#45A29E] opacity-10 blur-[100px] rounded-full"></div>

                <div className="relative z-10">
                    <Sparkles className="mx-auto text-[#66FCF1] mb-6" size={48} />
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Stop Worrying, <br />
                        <span className="text-[#66FCF1]">Start Consulting.</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Your first 5 minutes are absolutely **FREE** with our top-rated astrologers.
                        Get the clarity you deserve today.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-[#66FCF1] text-[#0B0C10] px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(102,252,241,0.5)] transition-all">
                            Claim Free Minutes
                        </button>
                        <button className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-[#0B0C10] transition-all">
                            Check Experts Online
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTASection;