"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Clock, Award } from 'lucide-react';

const TrustSection = () => {
    const stats = [
        { icon: <ShieldCheck size={32} />, title: "100% Verified", desc: "Certified Astrologers" },
        { icon: <Clock size={32} />, title: "24x7 Online", desc: "Instant Consultation" },
        { icon: <Users size={32} />, title: "10 Lakh+", desc: "Satisfied Customers" },
        { icon: <Award size={32} />, title: "Top Rated", desc: "4.9/5 Average Rating" },
    ];

    return (
        <section className="py-16 bg-[#1F2833]/20 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/5 transition-colors"
                        >
                            <div className="text-[#66FCF1] bg-[#66FCF1]/10 p-4 rounded-full mb-2">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;