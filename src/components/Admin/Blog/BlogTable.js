"use client"
import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, MoreVertical, Calendar, User, Tag, Inbox } from 'lucide-react';
import ViewBlogModal from './ViewBlogModal';
import EditBlogModal from './EditBlogModal';
import DeleteBlogModal from './DeleteBlogModal';
import Loader from '@/components/Include/Loader';
import { fetchBlogs, updateBlog } from "@/app/redux/slices/blog/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';

const BlogTable = ({ searchTerm }) => {
    const dispatch = useDispatch();
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { blogs, loading, error } = useSelector((state) => state.blogs);
    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    if (error) return <div className="text-red-500 text-center mt-4">{error.message || error}</div>;

    return (
        <div className="w-full">
            {filteredBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                    <Inbox size={48} className="mb-4" />
                    <h3 className="text-lg font-semibold">No Blogs Found</h3>
                    <p className="text-sm mt-1">There are no blogs matching your search or no blogs have been created yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Blog Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Publish Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 flex-shrink-0">
                                                <img src={blog.image} alt="" className="h-full w-full rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-200" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{blog.title}</div>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                    <User size={12} /> {blog.authorName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                            <Tag size={12} className="text-gray-400" />
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <label className="relative inline-flex items-center cursor-pointer group-btn">
                                                <input
                                                    type="checkbox"
                                                    checked={blog.active}
                                                    className="sr-only peer"
                                                    onChange={async () => {
                                                        try {
                                                            await dispatch(
                                                                updateBlog({ id: blog.id, active: !blog.active })
                                                            ).unwrap();

                                                            toast.success(`Blog ${!blog.active ? "activated" : "deactivated"} successfully`);
                                                        } catch (err) {
                                                            toast.error(err.message || "Failed to update blog status");
                                                        }
                                                    }}
                                                />
                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                            </label>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setSelectedBlog(blog); setIsViewOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedBlog(blog); setIsEditOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                                                title="Edit Blog"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedBlog(blog); setIsDeleteOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                title="Delete Blog"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="group-hover:hidden">
                                            <MoreVertical size={18} className="ml-auto text-gray-300" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* --- Modals --- */}
            <ViewBlogModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} blog={selectedBlog} />
            <EditBlogModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} blog={selectedBlog} />
            <DeleteBlogModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} blogId={selectedBlog?.id} blogTitle={selectedBlog?.title} />
        </div>
    );
};

export default BlogTable;