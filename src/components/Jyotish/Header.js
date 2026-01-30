"use client";
import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Horoscope', href: '#' },
        { name: 'Kundli', href: '#' },
        { name: 'Live Chat', href: '#' },
        { name: 'Vastu', href: '#' }
    ];

    return (
        <nav
            className={`w-full transition-all duration-300 border-b mt-10 md:mt-0 ${scrolled
                    ? "bg-[#0B0C10] border-transparent"
                    : "bg-[#0B0C10] border-transparent"
                }`}
        >


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 md:h-20 items-center">

                    {/* --- Premium Logo --- */}
                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                            <div className="absolute inset-0 border border-[#66FCF1]/30 rounded-full animate-[spin_15s_linear_infinite]"></div>
                            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-[#66FCF1] to-[#45A29E] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(102,252,241,0.4)]">
                                <span className="text-[#0B0C10] text-[10px] md:text-sm font-bold">ॐ</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase leading-none">
                                Jyotish<span className="text-[#66FCF1] animate-pulse">Veda</span>
                            </h1>
                            <p className="text-[7px] md:text-[9px] text-[#45A29E] tracking-[0.4em] font-bold uppercase mt-1">
                                Divine Wisdom
                            </p>
                        </div>
                    </div>

                    {/* --- Desktop Navigation --- */}
                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#66FCF1] transition-all relative group">
                                    {link.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#66FCF1] transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>
                        <button className="bg-[#66FCF1] text-[#0B0C10] px-7 py-2.5 rounded-full text-xs font-black hover:scale-105 transition-all">
                            CONSULT NOW
                        </button>
                    </div>

                    {/* --- Mobile Toggle --- */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="relative w-10 h-10 text-[#66FCF1]">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 my-1 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Full Screen Mobile Menu --- */}
            <div className={`fixed inset-0 z-[150] bg-[#0B0C10] transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-full pointer-events-none'}`}>
                <div className="flex flex-col h-full px-8 py-20">
                    <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-[#66FCF1] text-3xl">✕</button>
                    <div className="space-y-8">
                        {navLinks.map((link, i) => (
                            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block text-4xl font-bold text-white uppercase tracking-tighter">
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto">
                        <button className="w-full bg-[#66FCF1] text-[#0B0C10] py-5 rounded-2xl font-black text-xl">
                            CONSULT NOW
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;