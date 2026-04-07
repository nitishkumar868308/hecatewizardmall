import React from 'react';
import { Search, Menu, Bell, Compass } from 'lucide-react';

const Header = ({ setMobileOpen }) => {
    return (
        <header className="h-20 bg-[#06080a]/40 backdrop-blur-2xl border-b border-purple-900/20 sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="lg:hidden p-2.5 bg-purple-900/30 rounded-xl text-amber-400 border border-purple-500/20"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden md:flex items-center bg-[#1a1129]/50 border border-purple-900/50 px-4 py-2.5 rounded-2xl w-[350px] focus-within:border-amber-400/50 transition-all">
                    <Search size={18} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search Kundli or Clients..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-200 ml-3 placeholder:text-slate-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-3 bg-purple-900/20 text-amber-400 rounded-xl border border-purple-900/30 hover:bg-purple-900/40 transition-all">
                    <Bell size={20} />
                </button>
                
                <div className="flex items-center gap-3 pl-4 border-l border-purple-900/30">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-black text-white tracking-tight">Pt. Alex Johnson</span>
                        <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Expert Astrologer</span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-[2px] shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full bg-[#0f091a] rounded-[14px] flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;