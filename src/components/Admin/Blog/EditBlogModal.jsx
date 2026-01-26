"use client"
import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateBlog } from '@/app/redux/slices/blog/blogSlice';
import Loader from '@/components/Include/Loader';

const EditBlogModal = ({ isOpen, onClose, blog }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: "",
        authorName: "",
        slug: "",
        category: "",
        excerpt: "",
        description: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateSlug = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    // Initialize form with blog data
    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                authorName: blog.authorName || "",
                slug: blog.slug || generateSlug(blog.title || ""),
                category: blog.category || "",
                excerpt: blog.excerpt || "",
                description: blog.description || "",
                image: blog.image || null,
            });
            setPreview(blog.image || null);
        }
    }, [blog]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setPreview(null);
        setSelectedFile(null);
        setFormData({ ...formData, image: null });
    };

    // Upload image function
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return Array.isArray(data.urls) ? data.urls[0] : data.urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedImage = formData.image;

            // If new file selected, upload it
            if (selectedFile) {
                uploadedImage = await handleImageUpload(selectedFile);
            }

            // Dispatch Redux action to update blog
            const payload = {
                id: blog.id,
                ...formData,
                image: uploadedImage,
            };

            const resultAction = await dispatch(updateBlog(payload));

            if (updateBlog.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Blog updated successfully");
                onClose();
            } else {
                toast.error(resultAction.payload?.message || "Failed to update blog");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Edit Blog Post</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Update your content and featured image</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form className="p-6 space-y-5 overflow-y-auto max-h-[80vh]" onSubmit={handleSubmit}>
                    {/* Loader */}
                    {loading && <Loader />}

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <ImageIcon size={16} className="text-blue-500" /> Featured Image
                        </label>

                        {!preview ? (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-3 bg-blue-50 rounded-full mb-3 text-blue-500">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 h-48 shadow-inner">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-3 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-all"
                                        title="Remove Image"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                            <input
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                        slug: generateSlug(e.target.value),
                                    })
                                }
                                placeholder="E.g. Future of Adtology"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                            <input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="E-commerce, Tech, etc."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Excerpt</label>
                            <textarea
                                rows="2"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Author Name</label>
                            <input
                                value={formData.authorName}
                                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                placeholder="Author name"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Write something amazing..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black hover:shadow-lg active:scale-95 transition-all shadow-md shadow-gray-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlogModal;
