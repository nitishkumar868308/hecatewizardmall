"use client";
import React from 'react';
import { X, Calendar, Tag, FileText, Layout, User, Clock, AlignLeft } from 'lucide-react';

const ViewBlogModal = ({ isOpen, onClose, blog }) => {
    if (!isOpen || !blog) return null;

    // Helper component for Label-Value pair
    const DetailItem = ({ icon: Icon, label, value, colorClass }) => (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Icon size={12} className={colorClass} /> {label}
            </span>
            <span className="text-sm font-semibold text-gray-700">{value || "N/A"}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">

                {/* Header */}
                <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">Blog Overview</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full max-h-[60vh] overflow-y-auto">

                    {/* Left: Image Section */}
                    <div className="w-full md:w-2/5 p-6 bg-gray-50/30">
                        <div className="sticky top-0">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 block ml-1">Featured Cover</label>
                            <div className="relative group overflow-hidden rounded-[1.5rem] shadow-xl border-4 border-white">
                                <img
                                    src={blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80"}
                                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt="blog"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details Section */}
                    <div className="w-full md:w-3/5 p-6 md:p-8 space-y-6">

                        {/* Title Section */}
                        <div className="flex justify-between items-start">
                            {/* Left: Blog Title (existing, untouched) */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                                    Blog Title
                                </label>
                                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                                    {blog.title}
                                </h1>
                            </div>

                            {/* Right: Dates */}
                            <div className="flex flex-col items-end text-xs text-gray-400 mt-1 space-y-0.5">
                                <div>
                                    <span className="font-semibold">Published:</span>{" "}
                                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                                <div>
                                    <span className="font-semibold">Updated:</span>{" "}
                                    {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>



                        {/* Grid Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                icon={Layout}
                                label="Category"
                                value={blog.category}
                                colorClass="text-blue-500"
                            />
                            <DetailItem
                                icon={Clock}
                                label="Status"
                                value={blog.active ? "Published" : "Draft"}
                                colorClass={blog.status ? "text-green-500" : "text-amber-500"}
                            />
                            <DetailItem
                                icon={User}
                                label="Author"
                                value={blog.authorName}
                                colorClass="text-purple-500"
                            />
                            <DetailItem
                                icon={AlignLeft}
                                label="Short Description"
                                value={blog.excerpt}
                                colorClass="text-emerald-500"
                            />
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Full Description</label>
                            <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {blog.description || "No detailed description available for this post. Please update the blog content in the edit section to see more information here."}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 text-sm"
                    >
                        Dismiss View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewBlogModal;