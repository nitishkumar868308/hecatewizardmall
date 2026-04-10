"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Star, Calendar, Settings, X, Moon, Sparkles, Zap } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Kundli Overview', active: true },
    { icon: <Users size={22} />, label: 'My Clients' },
    { icon: <Star size={22} />, label: 'Horoscope' },
    { icon: <Calendar size={22} />, label: 'Consultations' },
    { icon: <Zap size={22} />, label: 'Astro Tools' },
    { icon: <Settings size={22} />, label: 'Settings' },
  ];

  return (
    <>
      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className="fixed top-0 left-0 h-screen w-80 bg-[#0a0514] border-r border-purple-500/20 z-[110] lg:hidden flex flex-col shadow-2xl shadow-purple-500/20"
      >
        <div className="p-8 flex items-center justify-between border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-amber-400 rounded-xl flex items-center justify-center">
              <Moon size={22} className="text-white fill-current" />
            </div>
            <span className="text-2xl font-black text-white italic tracking-tighter">Jyotish<span className="text-amber-400">AI</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-lg text-slate-400"><X size={24} /></button>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          {menuItems.map((item, index) => (
            <div key={index} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-purple-600/20 text-amber-400 border border-purple-500/30 shadow-lg shadow-purple-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon} <span className="font-bold text-lg">{item.label}</span>
            </div>
          ))}
        </nav>
      </motion.div>

      {/* DESKTOP SIDEBAR (Collapsible) */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 100 : 300 }}
        className="hidden lg:flex fixed top-0 left-0 h-screen bg-[#0a0514] border-r border-purple-500/10 z-50 flex-col transition-all duration-500 ease-in-out"
      >
        <div className="h-24 flex items-center px-8 border-b border-purple-500/5">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="min-w-[48px] w-12 h-12 bg-gradient-to-tr from-purple-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20 shrink-0">
              <Moon size={24} className="text-white fill-current" />
            </div>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-white italic tracking-tighter">
                Jyotish<span className="text-amber-400">AI</span>
              </motion.span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: isCollapsed ? 0 : 5 }}
              className={`flex items-center gap-4 rounded-2xl cursor-pointer transition-all ${isCollapsed ? 'justify-center h-16' : 'px-5 h-16'} ${
                item.active ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-amber-400 border-l-4 border-amber-400 shadow-xl shadow-purple-900/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-[15px] uppercase tracking-wider">{item.label}</motion.span>}
            </motion.div>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="p-6">
            <div className="bg-[#150b2b] rounded-[32px] p-6 border border-purple-500/20 relative overflow-hidden group">
              <Sparkles className="absolute -right-4 -top-4 text-amber-400/10" size={100} />
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Premium</p>
              <h4 className="text-white font-bold mt-1 leading-tight">Master the Stars</h4>
              <button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-amber-600/20 uppercase tracking-widest">Upgrade Now</button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;