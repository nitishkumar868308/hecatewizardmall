"use client"
import React, { useState, useEffect, useRef } from 'react';
import { User, BookOpen, Award, CheckCircle, ChevronRight, ChevronLeft, UploadCloud, Sparkles, MapPin, Globe } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const [stars, setStars] = useState([]);
    const fileInputRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(0);



    useEffect(() => {
        const starCount = 60;
        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1 + 'px',
            delay: Math.random() * 5 + 's',
            duration: Math.random() * 3 + 2 + 's'
        }));
        setStars(newStars);
    }, []);

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((prev) => Math.min(prev + 1, totalSteps));
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((prev) => Math.max(prev - 1, 1));
    };

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, []);

    const progress = (step / totalSteps) * 100;

    const stepsInfo = [
        { id: 1, label: 'Identity', icon: <User size={16} /> },
        { id: 2, label: 'Experience', icon: <BookOpen size={16} /> },
        { id: 3, label: 'Verification', icon: <Award size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-[#082D3F] flex items-center justify-center p-0 md:p-6 lg:p-12 font-sans relative overflow-hidden">

            {/* Background Animations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                {stars.map((star) => (
                    <div key={star.id} className="absolute bg-white rounded-full opacity-0 animate-twinkle"
                        style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDelay: star.delay, animationDuration: star.duration }}
                    />
                ))}
            </div>

            <div className="z-10 w-full max-w-5xl bg-white md:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-[700px]">

                {/* --- SIDEBAR (Desktop) / TOP NAV (Mobile) --- */}
                <div className="md:w-1/3 bg-[#082D3F] p-6 md:p-10 text-white flex flex-col relative overflow-hidden">
                    {/* Brand Section */}
                    <div className="relative z-10 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4 mb-8 md:mb-12">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                            <Sparkles className="text-white" size={windowWidth < 768 ? 20 : 30} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-3xl font-bold leading-tight">Expert Portal</h2>
                            <p className="hidden md:block mt-3 text-slate-400 text-sm leading-relaxed">
                                Join the elite circle of cosmic guides and share your wisdom.
                            </p>
                        </div>
                    </div>

                    {/* Stepper - Desktop pe list, Mobile pe dots/icons */}
                    <div className="relative z-10 flex md:flex-col justify-between items-center md:items-start md:space-y-8 mb-4 md:mb-0">
                        {stepsInfo.map((s) => (
                            <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${step === s.id ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-bold transition-colors ${step >= s.id ? 'border-yellow-400 bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-white/30 text-white'}`}>
                                    {step > s.id ? <CheckCircle size={18} /> : s.id}
                                </div>
                                <span className="hidden md:block font-bold tracking-wide text-sm uppercase">{s.label}</span>
                            </div>
                        ))}
                        {/* Connecting line for mobile */}
                        <div className="absolute top-4 left-0 w-full h-[2px] bg-white/10 md:hidden -z-10"></div>
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                <div className="flex-1 bg-white p-6 md:p-12 lg:p-16 flex flex-col">

                    {/* Header for Form */}
                    <div className="mb-8 md:mb-10">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Progress</span>
                            <span className="text-xs font-bold text-[#082D3F]">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full">
                            <div className="h-full bg-[#082D3F] transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(8,45,63,0.2)]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#082D3F]">Personal Profile</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Basic details to set up your identity.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                        <input type="text" placeholder="e.g. Rahul Sharma" className="modern-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                        <input type="email" placeholder="rahul@example.com" className="modern-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                                        <input type="tel" placeholder="+91 00000 00000" className="modern-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                                        <select className="modern-input appearance-none bg-no-repeat bg-[right_1rem_center]">
                                            <option>Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Languages (Comma separated)</label>
                                        <input type="text" placeholder="Hindi, English, Marathi" className="modern-input" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#082D3F]">Professional Skills</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Let us know what you're best at.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Specialty</label>
                                        <select className="modern-input">
                                            <option>Vedic Astrology</option>
                                            <option>Palmistry</option>
                                            <option>Tarot Reading</option>
                                            <option>Numerology</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Years of Practice</label>
                                        <input type="number" placeholder="5" className="modern-input" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Detailed Bio</label>
                                        <textarea placeholder="Describe your experience and method..." className="modern-input h-32 resize-none py-4"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#082D3F]">Documentation</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Safe & secure verification.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div
                                        className="upload-card group"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-[#082D3F] group-hover:text-white transition-all">
                                            <UploadCloud size={24} />
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="font-bold text-[#082D3F]">Identity Proof (Aadhar/PAN)</p>
                                            <p className="text-xs text-slate-400">PDF, JPG up to 5MB</p>
                                        </div>

                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={(e) => console.log(e.target.files[0])}
                                        />

                                        <button
                                            type="button"
                                            className="ml-auto text-xs font-bold bg-[#082D3F] text-white px-4 py-2 rounded-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current.click();
                                            }}
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    <div
                                        className="upload-card group"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-[#082D3F] group-hover:text-white transition-all">
                                            <Award size={24} />
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="font-bold text-[#082D3F]">Professional Certificate</p>
                                            <p className="text-xs text-slate-400">Educational degrees or certifications</p>
                                        </div>

                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={(e) => console.log(e.target.files[0])}
                                        />

                                        <button
                                            type="button"
                                            className="ml-auto text-xs font-bold bg-[#082D3F] text-white px-4 py-2 rounded-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current.click();
                                            }}
                                        >
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
                        <button onClick={prevStep} disabled={step === 1} className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${step === 1 ? 'opacity-0' : 'text-[#082D3F] hover:bg-slate-50'}`}>
                            <ChevronLeft size={18} /> <span className="hidden md:inline">Back</span>
                        </button>

                        <button onClick={step === totalSteps ? undefined : nextStep} className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 ${step === totalSteps ? 'bg-emerald-600 shadow-emerald-200' : 'bg-[#082D3F] shadow-[#082D3F]/20'} text-white shadow-xl`}>
                            {step === totalSteps ? 'Complete Application' : 'Continue'}
                            {step !== totalSteps && <ChevronRight size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }
                .animate-twinkle { animation: twinkle infinite ease-in-out; }
                
                .modern-input {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background-color: #F8FAFC;
                    border: 2px solid #F1F5F9;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #082D3F;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .modern-input:focus {
                    background-color: #FFFFFF;
                    border-color: #082D3F;
                    box-shadow: 0 10px 20px -10px rgba(8, 45, 63, 0.2);
                }
                
                .upload-card {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.25rem;
                    border: 2px solid #F1F5F9;
                    border-radius: 24px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .upload-card:hover {
                    border-color: #082D3F;
                    background-color: #F8FAFC;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .upload-card {
                        flex-direction: column;
                        text-align: center;
                    }
                    .upload-card button {
                        width: 100%;
                        margin-top: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;