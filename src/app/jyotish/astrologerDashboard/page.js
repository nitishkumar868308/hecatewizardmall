"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Jyotish/Dashboard/Sidebar';
import Header from '@/components/Jyotish/Dashboard/Header';

const DashboardPage = () => {
    const [isMobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar - Desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header setMobileOpen={setMobileOpen} />

                <main className="p-4 lg:p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <p className="text-slate-500 text-sm font-medium">Total Balance</p>
                                <h3 className="text-2xl font-bold mt-2 text-slate-800">$24,500.00</h3>
                                <span className="text-green-500 text-xs font-bold mt-2 inline-block">+12.5% since last month</span>
                            </div>
                        ))}
                    </div>

                    {/* Table / Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 text-lg">Recent Transactions</h2>
                            <button className="text-blue-600 text-sm font-semibold">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <tr key={item} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">John Doe</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Success</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">Oct 24, 2023</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-700">$450.00</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;