"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Globe } from 'lucide-react';

const ContactUs = () => {
    const contactMethods = [
        {
            icon: <Phone className="text-[#66FCF1]" />,
            title: "Call Anytime",
            detail: "+91 800-ASTRO-NOW",
            sub: "Mon-Sun, 24/7 Support"
        },
        {
            icon: <Mail className="text-blue-400" />,
            title: "Email Us",
            detail: "support@astroverse.com",
            sub: "Instant response in 2h"
        },
        {
            icon: <MessageCircle className="text-green-400" />,
            title: "Live Chat",
            detail: "WhatsApp Support",
            sub: "Fastest way to connect"
        }
    ];

    return (
        <div className="bg-[#0B0C10] text-white min-h-screen font-sans selection:bg-[#66FCF1] selection:text-black">

            {/* --- HEADER SECTION --- */}
            <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-[#66FCF1]/5 blur-[120px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <span className="text-[#66FCF1] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Get In Touch</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        We&apos;re Here To <br /> <span className="italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Guide Your Way</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl mx-auto text-lg">
                        Have questions about your stars? Our team and experts are available round the clock to assist you.
                    </p>
                </motion.div>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* --- LEFT: CONTACT INFO --- */}
                    <div className="lg:col-span-5 space-y-6">
                        {contactMethods.map((method, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 bg-[#1F2833]/30 border border-white/5 rounded-[2.5rem] hover:border-[#66FCF1]/30 transition-all flex items-center gap-6"
                            >
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {method.icon}
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{method.title}</p>
                                    <h3 className="text-xl font-bold text-white">{method.detail}</h3>
                                    <p className="text-zinc-600 text-xs mt-1">{method.sub}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Location Card */}
                        <div className="p-8 bg-gradient-to-br from-[#1F2833]/50 to-transparent border border-white/5 rounded-[2.5rem] mt-12">
                            <h4 className="font-black mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-[#66FCF1]" /> Corporate Office
                            </h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                12th Floor, Astral Tower, <br />
                                Cyber City, Gurugram, <br />
                                Haryana - 122002, India
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT: INTERACTIVE FORM --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-7 bg-[#1F2833]/20 border border-white/10 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl"
                    >
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#66FCF1]/50 transition-all text-white placeholder:text-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#66FCF1]/50 transition-all text-white placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Subject</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#66FCF1]/50 transition-all text-white appearance-none cursor-pointer">
                                    <option className="bg-[#0B0C10]">General Inquiry</option>
                                    <option className="bg-[#0B0C10]">Astrologer Verification</option>
                                    <option className="bg-[#0B0C10]">Payment Issue</option>
                                    <option className="bg-[#0B0C10]">Partnership</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="Write your cosmic query here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-[#66FCF1]/50 transition-all text-white placeholder:text-zinc-700 resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full py-5 bg-[#66FCF1] text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(102,252,241,0.2)] flex items-center justify-center gap-3">
                                <Send size={20} /> Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* --- MAP PLACEHOLDER / DECORATION --- */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="h-64 md:h-96 w-full bg-[#1F2833]/20 rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#66FCF1 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
                    <div className="text-center relative z-10">
                        <MapPin size={48} className="text-[#66FCF1] mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-black">Find Us In The Real World</h3>
                        <p className="text-zinc-500">Interactive Map Loading...</p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ContactUs;