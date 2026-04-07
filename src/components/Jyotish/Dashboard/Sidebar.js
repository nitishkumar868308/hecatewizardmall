"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Star, Calendar, Settings, X, Moon, Sparkles } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {
    const menuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Kundli Overview', active: true },
        { icon: <Users size={22} />, label: 'My Clients' },
        { icon: <Star size={22} />, label: 'Daily Horoscope' },
        { icon: <Calendar size={22} />, label: 'Consultations' },
        { icon: <Settings size={22} />, label: 'Settings' },
    ];

    return (
        <>
            {/* --- MOBILE SIDEBAR (Drawer Style) --- */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

            <motion.div
                initial={false}
                animate={{ x: isOpen ? 0 : -300 }}
                className="fixed top-0 left-0 h-screen w-72 bg-[#0f091a] border-r border-purple-900/30 z-[110] lg:hidden flex flex-col"
            >
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-amber-400 rounded-full flex items-center justify-center">
                            <Moon size={22} className="text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold text-white italic">Jyotish<span className="text-amber-400">AI</span></span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400"><X size={24} /></button>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <div key={index} className={`flex items-center gap-4 px-5 py-4 rounded-2xl ${item.active ? 'bg-purple-600/20 text-amber-400 border-l-4 border-amber-400' : 'text-slate-400'}`}>
                            {item.icon} <span className="font-bold">{item.label}</span>
                        </div>
                    ))}
                </nav>
            </motion.div>

            {/* --- DESKTOP SIDEBAR (Collapsible Style) --- */}
            <motion.div
                initial={false}
                animate={{ width: isCollapsed ? 88 : 288 }}
                className="hidden lg:flex fixed top-0 left-0 h-screen bg-[#0f091a] border-r border-purple-900/30 z-50 flex-col transition-all duration-300"
            >
                <div className="p-6 flex items-center gap-4 overflow-hidden whitespace-nowrap">
                    <div className="min-w-[40px] w-10 h-10 bg-gradient-to-tr from-purple-600 to-amber-400 rounded-full flex items-center justify-center shrink-0">
                        <Moon size={22} className="text-white fill-current" />
                    </div>
                    {!isCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-white italic">
                            Jyotish<span className="text-amber-400 font-black">AI</span>
                        </motion.span>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-4 mt-6">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-4 rounded-2xl cursor-pointer transition-all ${isCollapsed ? 'justify-center py-4' : 'px-5 py-4'} ${item.active ? 'bg-purple-600/20 text-amber-400 shadow-lg shadow-purple-900/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className="shrink-0">{item.icon}</div>
                            {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold whitespace-nowrap">{item.label}</motion.span>}
                        </div>
                    ))}
                </nav>

                {!isCollapsed && (
                    <div className="p-4">
                        <div className="bg-[#1a1129] rounded-[24px] p-5 border border-purple-500/10 relative overflow-hidden group">
                            <Sparkles className="absolute -right-2 -top-2 text-amber-400/20" size={50} />
                            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest relative z-10">Pro</p>
                            <button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-xl text-xs font-bold">Upgrade</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default Sidebar;