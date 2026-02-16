"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Package, Zap, ShoppingCart } from "lucide-react";

const Loader = () => {
  const products = [
    { Icon: ShoppingBag, initialY: -20, delay: 0 },
    { Icon: Sparkles, initialY: 40, delay: 0.5 },
    { Icon: Package, initialY: -30, delay: 1 },
    { Icon: Zap, initialY: 20, delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-[9999] overflow-hidden">

      {/* 1. Side Floating Elements (Modern Product Vibes) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Side */}
        <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 flex flex-col gap-20">
          {products.slice(0, 2).map((item, i) => (
            <motion.div
              key={`left-${i}`}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
              className="text-[#66FCF1]/30"
            >
              <item.Icon size={40} />
            </motion.div>
          ))}
        </div>
        {/* Right Side */}
        <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 flex flex-col gap-20">
          {products.slice(2, 4).map((item, i) => (
            <motion.div
              key={`right-${i}`}
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
              className="text-[#66FCF1]/30"
            >
              <item.Icon size={40} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Background Pulsing Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border-2 border-[#66FCF1]/20 rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.02, 0.1, 0.02] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] border border-[#66FCF1]/10 rounded-full"
        />
      </div>

      <div className="relative flex flex-col items-center">

        {/* 3. Brand Name - Hecate Wizard Mall */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h2 className="text-[#66FCF1] font-black text-xl md:text-3xl tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
            Hecate Wizard <span className="text-white">Mall</span>
          </h2>
          <motion.div
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#66FCF1] to-transparent mt-2 w-full"
          />
        </motion.div>

        {/* 4. Main Logo Container */}
        <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center">
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-[#66FCF1]/20 blur-[60px] rounded-full animate-pulse" />

          {/* Rotating Loader Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 z-20">
            <motion.circle
              cx="50%" cy="50%" r="46%"
              stroke="#66FCF1"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100 150"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              strokeLinecap="round"
            />
          </svg>

          {/* Logo Glass Frame */}
          <div className="flex flex-col items-center text-center">

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/10 p-1 bg-black/40 backdrop-blur-sm"
            >
              <img
                src="/image/logo.png"
                alt="Logo"
                className="w-[80%] h-[80%] object-contain mx-auto"
              />

            </motion.div>

          </div>
        </div>

        {/* 5. Progress & Status */}
        <div className="mt-12 flex flex-col items-center z-40">
          <div className="flex gap-2">
            {["L", "O", "A", "D", "I", "N", "G"].map((l, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -5, 0],
                  color: ["#66FCF1", "#ffffff", "#66FCF1"]
                }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                className="text-[#66FCF1] text-xs font-bold tracking-widest"
              >
                {l}
              </motion.span>
            ))}
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-48 h-[2px] bg-white/5 mt-6 rounded-full overflow-hidden relative">
            <motion.div
              animate={{
                left: ["-100%", "100%"],
                backgroundColor: ["#66FCF1", "#45A29E", "#66FCF1"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 shadow-[0_0_15px_#66FCF1]"
            />
          </div>

          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/40 text-[10px] uppercase mt-4 tracking-[0.2em]"
          >
            Summoning the Magic of Shopping...
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Loader;