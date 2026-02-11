"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, FileCheck, CheckCircle2,
    ChevronRight, ChevronLeft, Upload, Star, Shield
} from 'lucide-react';

const JoinAstrologer = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="bg-[#0B0C10] text-white min-h-screen font-sans selection:bg-[#66FCF1] selection:text-black">

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#66FCF1]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-4">
                        <div className="bg-[#66FCF1]/10 p-3 rounded-2xl border border-[#66FCF1]/20">
                            <Star className="text-[#66FCF1] animate-pulse" size={32} />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">
                        Partner With <span className="text-[#66FCF1]">AstroVerse</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Empower lives with your cosmic wisdom. Join our elite circle of experts.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`flex items-center gap-2 ${step >= num ? 'text-[#66FCF1]' : 'text-zinc-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= num ? 'border-[#66FCF1] bg-[#66FCF1]/10' : 'border-zinc-800'}`}>
                                    {step > num ? <CheckCircle2 size={18} /> : num}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                                    {num === 1 ? "Personal" : num === 2 ? "Professional" : "Verification"}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#66FCF1]"
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Container */}
                <motion.div
                    layout
                    className="bg-[#1F2833]/30 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="text-[#66FCF1]" />
                                    <h2 className="text-2xl font-black italic">Personal Details</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputBlock label="Full Name" placeholder="Acharya Sharma" />
                                    <InputBlock label="Email Address" placeholder="sharma@astro.com" type="email" />
                                    <InputBlock label="Phone Number" placeholder="+91 98XXX XXXXX" />
                                    <InputBlock label="City" placeholder="Varanasi" />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Briefcase className="text-[#66FCF1]" />
                                    <h2 className="text-2xl font-black italic">Professional Expertise</h2>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Primary Specialization</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Vedic', 'Tarot', 'Vastu', 'Numerology', 'Palmistry'].map((skill) => (
                                            <button key={skill} className="px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:border-[#66FCF1] transition-all text-sm font-bold">
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    <InputBlock label="Experience (Years)" placeholder="e.g. 10" />
                                    <InputBlock label="Languages" placeholder="Hindi, English, Sanskrit" />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <FileCheck className="text-[#66FCF1]" />
                                    <h2 className="text-2xl font-black italic">Verification Docs</h2>
                                </div>
                                <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-[#66FCF1]/50 transition-colors cursor-pointer group">
                                    <Upload className="mx-auto text-zinc-600 mb-4 group-hover:text-[#66FCF1] transition-colors" size={40} />
                                    <p className="text-zinc-400 font-bold italic">Upload Identity Proof (Aadhar/Voter ID)</p>
                                    <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest">PDF or JPEG, Max 5MB</p>
                                </div>
                                <div className="p-6 bg-[#66FCF1]/5 rounded-2xl border border-[#66FCF1]/10 flex gap-4">
                                    <Shield className="text-[#66FCF1] shrink-0" />
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        By submitting, you agree to our Terms of Service and Verification Process. Our team will contact you within 48 hours for a mock interview.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={prevStep}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <ChevronLeft size={20} /> Back
                        </button>

                        {step < totalSteps ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-10 py-4 bg-[#66FCF1] text-black rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-[0_10px_30px_rgba(102,252,241,0.2)]"
                            >
                                Continue <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button className="px-10 py-4 bg-gradient-to-r from-[#66FCF1] to-blue-500 text-black rounded-2xl font-black text-sm hover:scale-105 transition-all">
                                Submit Application
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Benefits Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BenefitCard icon={<Star className="text-yellow-400" />} title="10M+ Users" desc="Reach a massive global audience seeking guidance." />
                    <BenefitCard icon={<Shield className="text-blue-400" />} title="Timely Payouts" desc="Get paid weekly with absolute transparency." />
                    <BenefitCard icon={<Briefcase className="text-[#66FCF1]" />} title="Expert Support" desc="24/7 dedicated support for our astrologer family." />
                </div>
            </div>
        </div>
    );
};

// Reusable Input Component
const InputBlock = ({ label, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
            {label}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#66FCF1]/50 transition-all text-white placeholder:text-zinc-700 font-medium"
        />
    </div>
);

// Reusable Benefit Card
const BenefitCard = ({ icon, title, desc }) => (
    <div className="text-center p-6 bg-white/5 rounded-[2rem] border border-white/5">
        <div className="flex justify-center mb-4">{icon}</div>
        <h4 className="font-black text-lg mb-2 italic">{title}</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default JoinAstrologer;