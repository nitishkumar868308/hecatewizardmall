"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Loader from "@/components/Include/Loader";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "@/app/redux/slices/blog/blogSlice";

const AddBlogModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.blogs); // Redux loader

    const [preview, setPreview] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [authorImageFile, setAuthorImageFile] = useState(null);
    const [authorImagePreview, setAuthorImagePreview] = useState(null);


    // slug generator
    const generateSlug = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        setSlug(generateSlug(value));
    };

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // ---------------- IMAGE UPLOAD FUNCTION ----------------
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
        if (!title || !authorName || !category || !excerpt || !description) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            let imageUrl = null;
            if (coverFile) {
                toast.loading("Uploading image...");
                imageUrl = await handleImageUpload(coverFile);
                toast.dismiss();
            }

            let authorImageUrl = null;

            if (authorImageFile) {
                toast.loading("Uploading author image...");
                authorImageUrl = await handleImageUpload(authorImageFile);
                toast.dismiss();
            }

            const payload = {
                title,
                authorName,
                authorImage: authorImageUrl,
                slug,
                category,
                excerpt,
                description,
                image: imageUrl,
            };

            const resultAction = await dispatch(createBlog(payload));

            if (createBlog.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload?.message || "Blog created successfully");
                onClose();
                // reset fields
                setTitle("");
                setAuthorName("");
                setSlug("");
                setCategory("");
                setExcerpt("");
                setDescription("");
                setCoverFile(null);
                setPreview(null);
            } else {
                toast.error(resultAction.payload?.message || "Failed to create blog");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Create New Blog</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Blog Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Enter title"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Author Name</label>
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Enter author name"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Slug (Auto)</label>
                            <input
                                type="text"
                                value={slug}
                                readOnly
                                className="p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Enter category"
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Author Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setAuthorImageFile(file);
                                    setAuthorImagePreview(URL.createObjectURL(file));
                                }
                            }}
                            className="p-2 border border-dashed rounded-lg bg-gray-50"
                        />

                        {authorImagePreview && (
                            <img
                                src={authorImagePreview}
                                className="w-24 h-24 rounded-full object-cover border"
                                alt="Author Preview"
                            />
                        )}
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Excerpt (Short Summary)</label>
                        <textarea
                            rows="2"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short summary for blog cards & SEO"
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="p-2 border border-dashed rounded-lg bg-gray-50"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write blog content here..."
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {loading && <Loader />}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-900 font-medium"
                        >
                            Publish Blog
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlogModal;
