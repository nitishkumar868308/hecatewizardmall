"use client";
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    Search, Menu, Plus, Settings, Maximize2,
    MousePointer2, Pencil, Type, Ruler, Eye,
    LayoutGrid
} from 'lucide-react';

// Static Chart Data
const chartData = [
    { time: '09:00', open: 100, close: 120, high: 125, low: 95 },
    { time: '10:00', open: 120, close: 110, high: 130, low: 105 },
    { time: '11:00', open: 110, close: 140, high: 145, low: 108 },
    { time: '12:00', open: 140, close: 135, high: 150, low: 130 },
    { time: '13:00', open: 135, close: 155, high: 160, low: 132 },
    { time: '14:00', open: 155, close: 145, high: 158, low: 140 },
    { time: '15:00', open: 145, close: 165, high: 170, low: 142 },
];

// Yahan aap apna data pass kar sakte hain
const TradingViewChart = ({
    watchlistData = [
        { s: 'BTCUSDT', p: '43,842.0', c: '+1.24%', up: true },
        { s: 'ETHUSDT', p: '2,245.1', c: '-0.52%', up: false },
    ]
}) => {
    return (
        <div className="flex flex-col h-screen w-full bg-[#131722] text-[#d1d4dc] font-sans overflow-hidden">

            {/* --- TOP NAV --- */}
            <div className="h-[48px] border-b border-[#2a2e39] flex items-center justify-between px-3 bg-[#131722] shrink-0">
                <div className="flex items-center gap-3 h-full">
                    <Menu className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#2a2e39] hover:bg-[#363a45] rounded cursor-pointer transition-all">
                        <span className="font-bold text-sm text-white">BTCUSDT</span>
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="hidden sm:flex items-center gap-1 border-l border-[#2a2e39] ml-2 pl-3">
                        {['1m', '5m', '15m', '1h', 'D'].map((tf) => (
                            <button key={tf} className={`px-2 py-1 rounded text-[13px] font-semibold hover:bg-[#2a2e39] ${tf === '1h' ? 'text-blue-500 bg-[#1e222d]' : ''}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Maximize2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <button className="bg-[#2962ff] hover:bg-[#1e4bd8] text-white px-4 py-1.5 rounded text-[12px] font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
                        Publish
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* --- LEFT TOOLS --- */}
                <div className="w-[48px] border-r border-[#2a2e39] flex flex-col items-center py-4 gap-6 bg-[#131722] shrink-0">
                    <div className="p-2 bg-[#1e222d] rounded-lg border border-blue-500/20 shadow-inner"><MousePointer2 className="w-5 h-5 text-blue-500" /></div>
                    <Pencil className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    <Type className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    <Plus className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    <Ruler className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </div>

                {/* --- CENTER CHART --- */}
                <div className="flex-1 relative bg-[#131722]">
                    <div className="absolute top-4 left-6 z-20 pointer-events-none select-none">
                        <h1 className="text-lg font-bold text-[#f0f3fa] flex items-center gap-2">
                            BITCOIN / TETHER US <span className="text-sm font-medium text-gray-500">1h</span>
                        </h1>
                        <div className="flex gap-4 mt-1 font-mono text-[12px]">
                            <span className="text-gray-500">O <span className="text-[#26a69a]">43842.1</span></span>
                            <span className="text-gray-500">H <span className="text-[#26a69a]">44100.5</span></span>
                            <span className="text-gray-500">L <span className="text-[#ef5350]">43700.0</span></span>
                            <span className="text-gray-500">C <span className="text-[#26a69a]">43950.2</span></span>
                        </div>
                    </div>

                    <div className="h-full w-full pt-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ right: 10, left: 10 }}>
                                <CartesianGrid strokeDasharray="0" stroke="#2a2e39" vertical horizontal />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#787b86', fontSize: 11 }} dy={10} />
                                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#787b86', fontSize: 11 }} domain={['auto', 'auto']} />
                                <Tooltip cursor={{ fill: '#2a2e39', opacity: 0.3 }} content={() => null} />
                                <Bar dataKey="close">
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={entry.close > entry.open ? '#26a69a' : '#ef5350'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- RIGHT WATCHLIST (Dynamic) --- */}
                <div className="w-[300px] border-l border-[#2a2e39] hidden lg:flex flex-col bg-[#131722]">
                    <div className="h-[48px] px-4 border-b border-[#2a2e39] flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Watchlist</span>
                        <div className="flex gap-3">
                            <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                            <LayoutGrid className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {watchlistData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center px-4 py-4 hover:bg-[#1e222d] border-b border-[#1e222d] cursor-pointer transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[#f0f3fa] group-hover:text-blue-400 transition-colors uppercase">
                                        {item.s}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">Binance</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[13px] font-semibold text-[#f0f3fa] font-mono">
                                        {item.p}
                                    </span>
                                    <span className={`text-[11px] font-bold px-1 rounded ${item.up ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                                        {item.c}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="h-[28px] border-t border-[#2a2e39] bg-[#131722] flex items-center justify-between px-3 text-[11px] text-gray-500 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#26a69a]">
                        <span className="w-2 h-2 bg-[#26a69a] rounded-full animate-pulse" />
                        MARKET OPEN
                    </div>
                    <span className="hover:text-white cursor-pointer transition-colors">Screener</span>
                </div>
                <div className="flex gap-4 font-medium uppercase tracking-tighter">
                    <span className="text-blue-500">UTC+5:30</span>
                    <span>%</span>
                    <span>log</span>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2e39; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #363a45; }
            `}</style>
        </div>
    );
};

export default TradingViewChart;