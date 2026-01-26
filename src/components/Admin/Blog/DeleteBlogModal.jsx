"use client";
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { deleteBlog } from '@/app/redux/slices/blog/blogSlice';
import Loader from '@/components/Include/Loader';

const DeleteBlogModal = ({ isOpen, onClose, blogId, blogTitle }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            const resultAction = await dispatch(deleteBlog(blogId));

            if (deleteBlog.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Blog deleted successfully");
                onClose();
            } else {
                toast.error(resultAction.payload?.message || "Failed to delete blog");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 relative">

                {/* Loader */}
                {loading && <Loader />}

                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
                    <AlertTriangle className="text-red-600" size={24} />
                </div>

                <h2 className="text-xl font-bold text-center text-gray-900">
                    Are you sure?
                </h2>

                <p className="text-gray-500 text-center mt-2">
                    Do you really want to delete{" "}
                    <span className="font-semibold text-gray-800">
                        "{blogTitle}"
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Delete Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBlogModal;
