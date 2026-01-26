"use client"
import React from 'react';
import { X, Calendar, User, ShieldCheck, Mail, Phone, Eye } from 'lucide-react';

const ViewModal = ({ isOpen, onClose, title, subtitle, children, footerAction }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Top Header Section (Premium Black) */}
                <div className="bg-black p-6 md:p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition-all group"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold italic">Viewing Details</p>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {title || "Information Detail"}
                        </h2>
                        {subtitle && <p className="text-sm text-gray-400 font-medium">{subtitle}</p>}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto bg-gray-50/50">
                    <div className="space-y-6">
                        {/* Ye 'children' prop humein allow karta hai ki hum iske andar 
                            kuch bhi daal sakein (Table, Text, Images etc.)
                        */}
                        {children}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-8 py-2.5 border border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all text-sm"
                    >
                        Close View
                    </button>
                    {footerAction && (
                        <div className="w-full sm:w-auto">{footerAction}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewModal;