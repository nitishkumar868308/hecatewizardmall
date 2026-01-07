"use client";
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
    const bgImage = "/image/back1.jpg";

    const services = [
        { title: "Birth Chart Reading", desc: "Understand your personality, destiny and life patterns." },
        { title: "Love & Relationships", desc: "Clarity in love, marriage and emotional connections." },
        { title: "Career Guidance", desc: "Find direction, purpose and professional growth." },
    ];

    const consultants = [
        { name: "Sophia Williams", role: "Senior Astrologer", exp: "12+ Years Experience", img: "/image/Pratiek A jain.jpg" },
        { name: "Daniel Carter", role: "Vedic Astrology Expert", exp: "9+ Years Experience", img: "/image/koyal.jpeg" },
    ];

    // Generate stars for background
    const stars = Array.from({ length: 50 });

    return (
        <div className="w-full text-white overflow-x-hidden bg-black relative">
            {/* ================= HERO ================= */}
            <section
                className="relative  flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/90 z-0" />

                {/* Stars */}
                <div className="absolute inset-0 overflow-hidden">
                    {stars.map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full opacity-70 animate-blink"
                            style={{
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Floating consultant images */}
                {consultants.map((c, i) => (
                    <img
                        key={i}
                        src={c.img}
                        alt={c.name}
                        className={`absolute w-24 h-24 rounded-full border border-white/20  animate-float`}
                        style={{
                            top: `${10 + i * 15}%`,
                            left: `${i % 2 === 0 ? 5 : 85}%`,
                            animationDelay: `${i * 1.5}s`,
                        }}
                    />
                ))}

                {/* Hero content */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-6 leading-tight"
                    >
                        <span className="block text-white/80">Unlock the Secrets of the</span>
                        <span className="block text-white text-5xl md:text-6xl">Cosmos & Your Life</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-10"
                    >
                        Personalized astrology sessions for love, career, and destiny. Explore your cosmic blueprint with our expert guidance.
                    </motion.p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 border border-white rounded-full font-medium tracking-wide hover:bg-white hover:text-black transition"
                    >
                        Book Consultation
                    </motion.button>
                </div>
            </section>

            {/* ================= SERVICES ================= */}
            <section className="py-20 px-4 bg-black text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif mb-14">
                        Astrology Services
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {services.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6 }}
                                className="border border-white/10 rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-white/20 transition"
                            >
                                <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= EXPERTS ================= */}
            <section className="py-20 px-4 bg-black">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif mb-16">
                        Meet Our Experts
                    </h2>

                    <div className="grid gap-12 sm:grid-cols-2">
                        {consultants.map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col sm:flex-row items-center gap-8 border border-white/10 rounded-2xl p-8 hover:shadow-lg hover:shadow-white/20 transition"
                            >
                                <img
                                    src={c.img}
                                    alt={c.name}
                                    className="w-36 h-36 rounded-full object-cover border border-white"
                                />
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold">{c.name}</h3>
                                    <p className="text-gray-400 text-sm">{c.role}</p>
                                    <p className="text-gray-500 text-sm mt-1">{c.exp}</p>
                                    <button className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
                                        Book Session
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-20 px-4 bg-black text-white text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6">Begin Your Journey</h2>
                <p className="max-w-xl mx-auto text-gray-300 mb-8 text-sm sm:text-base">
                    Gain clarity, confidence and cosmic insight with a personal astrology session.
                </p>
                <button className="px-10 py-4 border border-white rounded-full hover:bg-white hover:text-black transition">
                    Get Started
                </button>
            </section>

            {/* ================= CSS Animations ================= */}
            <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 2s infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Page;
