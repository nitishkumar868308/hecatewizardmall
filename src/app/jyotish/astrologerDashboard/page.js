"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Jyotish/Dashboard/Sidebar';
import Header from '@/components/Jyotish/Dashboard/Header';
import { Menu } from 'lucide-react'; // Desktop toggle ke liye

const DashboardPage = () => {
    const [isMobileOpen, setMobileOpen] = useState(false); // Mobile Drawer
    const [isDesktopCollapsed, setDesktopCollapsed] = useState(false); // Desktop Mini Mode

    return (
        <div className="min-h-screen bg-[#06080a] text-slate-300">
            <Sidebar
                isOpen={isMobileOpen}
                setIsOpen={setMobileOpen}
                isCollapsed={isDesktopCollapsed}
            />

            {/* Desktop dynamic margin: jab mini sidebar ho toh margin kam ho jaye */}
            <div className={`transition-all duration-300 ${isDesktopCollapsed ? 'lg:ml-[88px]' : 'lg:ml-72'} flex flex-col min-h-screen`}>

                {/* Header with extra Toggle for Desktop */}
                <Header setMobileOpen={setMobileOpen} />

                <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {/* Aapka Content Yahan Aayega */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-[#0d1117] rounded-[32px] border border-purple-900/30"></div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;