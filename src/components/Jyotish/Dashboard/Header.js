import React from 'react';
import { Search, Menu, Bell, Command, Globe } from 'lucide-react';

const Header = ({ setMobileOpen, setDesktopCollapsed, isCollapsed }) => {
  return (
    <header className="h-24 bg-[#06080a]/60 backdrop-blur-3xl border-b border-purple-500/10 sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-3 bg-purple-600/10 rounded-2xl text-amber-400 border border-purple-500/20">
          <Menu size={24} />
        </button>

        {/* Desktop Toggle */}
        <button onClick={() => setDesktopCollapsed(!isCollapsed)} className="hidden lg:flex p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-amber-400 transition-all border border-white/5">
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-[#150b2b]/50 border border-purple-500/10 px-5 py-3 rounded-[20px] w-[400px] group focus-within:border-amber-400/40 transition-all">
          <Search size={20} className="text-slate-500 group-focus-within:text-amber-400" />
          <input type="text" placeholder="Search Kundli, Vastu, or Clients..." className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-200 ml-3 placeholder:text-slate-600" />
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Command size={10} /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="hidden sm:flex p-3 bg-white/5 text-slate-400 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
          <Globe size={22} />
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-sm font-black text-white tracking-tighter italic">Pt. Alex Johnson</span>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[2px]">Gold Member</span>
          </div>
          <div className="relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-[2px] shadow-xl group-hover:scale-105 transition-all cursor-pointer">
              <div className="w-full h-full bg-[#0a0514] rounded-[14px] flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#06080a] rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;