"use client"
import React, { useState } from 'react';
import DefaultPageAdmin from '@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin';
import BlogTable from '@/components/Admin/Blog/BlogTable';
import AddBlogModal from '@/components/Admin/Blog/AddBlogModal';
import { Plus } from 'lucide-react';

const BlogPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
                        <p className="text-sm text-gray-500">Manage your articles, news, and updates</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gray-600 hover:bg-gray-900 text-white p-2.6 rounded-lg flex items-center gap-2 transition-colors px-4 py-2"
                        >
                            <Plus size={20} />
                            <span className="hidden md:inline">Add Blog</span>
                        </button>
                    </div>
                </div>

                {/* Table Component */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <BlogTable searchTerm={searchTerm} />
                </div>

                {/* Modals */}
                {isAddModalOpen && <AddBlogModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}
            </div>
        </DefaultPageAdmin>
    );
};

export default BlogPage;