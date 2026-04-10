"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Jyotish/Dashboard/Sidebar';
import Header from '@/components/Jyotish/Dashboard/Header';
import { TrendingUp, Users, Calendar, Star, Sun, ArrowUpRight, Clock, MapPin } from 'lucide-react';

const DashboardPage = () => {
    const [isMobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);

    const stats = [
        { label: 'Consultations', value: '1,284', growth: '+12%', icon: <Calendar />, color: 'from-amber-500/20' },
        { label: 'Active Clients', value: '450', growth: '+5%', icon: <Users />, color: 'from-purple-500/20' },
        { label: 'Net Revenue', value: '₹84,300', growth: '+18%', icon: <TrendingUp />, color: 'from-emerald-500/20' },
    ];

    return (
        <div className="min-h-screen bg-[#06080a] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden">
            <Sidebar isOpen={isMobileOpen} setIsOpen={setMobileOpen} isCollapsed={isCollapsed} />

            <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:ml-[100px]' : 'lg:ml-[300px]'} flex flex-col min-h-screen`}>
                <Header setMobileOpen={setMobileOpen} setDesktopCollapsed={setCollapsed} isCollapsed={isCollapsed} />

                <main className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full space-y-12">

                    {/* WELCOME SECTION */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-amber-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#110820]/40 backdrop-blur-xl p-10 rounded-[48px] border border-purple-500/10 shadow-2xl">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <h1 className="text-4xl font-black text-white tracking-tighter italic flex items-center gap-4">
                                    <Sun className="text-amber-400 size-10 animate-spin-slow" /> Namaste, Pandit Ji
                                </h1>
                                <p className="text-slate-400 mt-3 text-lg font-medium max-w-md">Your cosmic alignment is strong today. You have <span className="text-amber-400 font-black italic underline">8 upcoming sessions</span>.</p>
                            </motion.div>
                            <button className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-[#0f091a] font-black rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-500/30 uppercase tracking-[2px] italic text-sm">
                                Open Daily Patrika
                            </button>
                        </div>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className={`bg-gradient-to-br ${stat.color} to-[#0d1117]/80 backdrop-blur-md p-8 rounded-[40px] border border-white/5 group hover:border-amber-400/30 transition-all shadow-xl`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="bg-[#0a0514] w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all text-amber-400">
                                        {React.cloneElement(stat.icon, { size: 28 })}
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 font-black text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        <ArrowUpRight size={14} /> {stat.growth}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-slate-500 font-black text-[11px] uppercase tracking-[3px] mb-2">{stat.label}</p>
                                    <h3 className="text-5xl font-black text-white tracking-tighter italic">{stat.value}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* BOTTOM GRID: RECENT CLIENTS & TASKS */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* TABLE AREA */}
                        <div className="xl:col-span-2 bg-[#0d1117]/60 backdrop-blur-xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h2 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                                    <Star className="text-amber-400 size-6 fill-amber-400" /> Next Consultations
                                </h2>
                                <button className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-amber-400 transition-colors">View Schedule</button>
                            </div>
                            <div className="overflow-x-auto p-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-slate-600 text-[11px] uppercase tracking-[3px] font-black border-b border-white/5">
                                            <th className="px-6 py-6 text-left">Client</th>
                                            <th className="px-6 py-6 text-left">Birth Sign</th>
                                            <th className="px-6 py-6 text-left">Time</th>
                                            <th className="px-6 py-6 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[1, 2, 3, 4].map((item) => (
                                            <tr key={item} className="group hover:bg-white/5 transition-all">
                                                <td className="px-6 py-8 flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-2xl flex items-center justify-center font-black text-white shadow-lg border border-white/5">
                                                        RK
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-white">Rahul K. Sharma</p>
                                                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1 font-bold">
                                                            <MapPin size={10} /> Mumbai, IN
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8">
                                                    <span className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-amber-500/20 italic">
                                                        Leo (Simha)
                                                    </span>
                                                </td>
                                                <td className="px-6 py-8">
                                                    <div className="flex items-center gap-2 text-white font-black text-sm italic">
                                                        <Clock size={14} className="text-purple-400" /> 12:30 PM
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 text-right">
                                                    <button className="text-[10px] font-black text-white bg-purple-600/20 hover:bg-purple-600 px-6 py-3 rounded-2xl border border-purple-500/30 transition-all uppercase tracking-widest italic shadow-lg shadow-purple-900/20">
                                                        Join Call
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SIDE CARDS */}
                        <div className="space-y-8">
                            <div className="bg-[#1a0b35] p-10 rounded-[48px] border border-purple-500/20 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[80px]" />
                                <h3 className="text-xl font-black text-white italic tracking-tighter mb-6 underline decoration-amber-500 underline-offset-8">Cosmic Alerts</h3>
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-400/20 transition-all cursor-pointer">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-ping" />
                                            <p className="text-sm font-medium text-slate-300">Mercury is in retrograde. Advise clients to avoid new contracts.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;