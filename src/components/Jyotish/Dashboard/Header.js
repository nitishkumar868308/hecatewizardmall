import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Header = ({ setMobileOpen }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-slate-100 px-3 py-2 rounded-lg w-80">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search anything..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">User Name</p>
            <p className="text-xs text-slate-500">Admin Account</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;