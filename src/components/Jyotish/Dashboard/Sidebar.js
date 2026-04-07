import React from 'react';
import { Home, Wallet, PieChart, Settings, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <Home size={20} />, label: 'Dashboard' },
        { icon: <Wallet size={20} />, label: 'Transactions' },
        { icon: <PieChart size={20} />, label: 'Analytics' },
        { icon: <Users size={20} />, label: 'Astrologers' },
        { icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className="hidden lg:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 border-r border-slate-800">
            <div className="p-6 text-2xl font-bold tracking-wider text-blue-400">
                Jyotish
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item, index) => (
                    <button key={index} className="flex items-center gap-4 w-full px-4 py-3 text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;