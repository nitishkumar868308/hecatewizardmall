"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const services = ['Kundli Matching', 'Love Problems', 'Career Guidance', 'Tarot Reading', 'Marriage', 'Health', 'Numerology', 'Vastu'];

const Services = () => {
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-[#0B0C10]">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-2 text-[#66FCF1]">Our Services</h2>
                <div className="h-1 w-20 bg-[#66FCF1] rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {services.map((service, i) => (
                    <motion.div
                        key={service}
                        whileHover={{ y: -8, borderColor: '#66FCF1' }}
                        className="group bg-[#1F2833]/40 p-8 rounded-3xl border border-white/5 transition-all text-center cursor-pointer"
                    >
                        <div className="w-14 h-14 bg-[#0B0C10] rounded-2xl mx-auto mb-5 flex items-center justify-center text-[#66FCF1] group-hover:rotate-12 transition-transform shadow-lg">
                            <Star fill="currentColor" size={22} />
                        </div>
                        <h3 className="font-bold text-white text-md md:text-lg">{service}</h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Services;