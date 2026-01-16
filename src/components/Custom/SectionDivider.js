"use client";
import { motion } from "framer-motion";

const SectionDivider = () => {
    return (
        <div className="relative w-full py-12 md:py-20 flex items-center justify-center overflow-hidden">
            {/* 1. Background Glow - Line ke piche halki si light */}
            <div className="absolute w-[60%] h-[1px] bg-amber-500/10 blur-sm" />

            {/* 2. Main Animated Line */}
            <div className="relative w-full max-w-[1200px] px-10 flex items-center">

                {/* Left Side Line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: "50%", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500"
                />

                {/* Center Element - Luxury Diamond */}
                <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 45 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                    className="relative z-10 mx-4"
                >
                    {/* Diamond Outer Glow */}
                    <div className="absolute inset-0 w-3 h-3 bg-amber-500 blur-[6px] opacity-50" />
                    {/* Diamond Core */}
                    <div className="w-3 h-3 bg-black border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                </motion.div>

                {/* Right Side Line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: "50%", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-[1px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500"
                />
            </div>

            {/* 3. Subtle Bottom Label (Optional) */}
            {/* <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 text-[8px] tracking-[0.8em] uppercase text-amber-500/30 font-bold"
            >
                Aura Edition
            </motion.div> */}
        </div>
    );
};

export default SectionDivider;