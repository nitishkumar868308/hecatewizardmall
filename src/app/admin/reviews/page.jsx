"use client";

import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, updateReview } from "@/app/redux/slices/reviews/reviewsSlice";
import { fetchBlogReviews, updateBlogReview } from "@/app/redux/slices/blogReviews/blogReviewsSlice";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import toast from "react-hot-toast";
import { MessageSquare, ShoppingBag, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";

const AdminReviewsPage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("product"); // "product" or "blog"
    const [updatingId, setUpdatingId] = useState(null);

    // Redux Data
    const { reviews: productReviews, loading: pLoading } = useSelector((state) => state.reviews);
    const { reviews: blogReviews, loading: bLoading } = useSelector((state) => state.blogReviews);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchReviews());
        dispatch(fetchBlogReviews());
    }, [dispatch]);

    // Product Review Status Change
    const handleProductStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            const res = await dispatch(updateReview({ id, status })).unwrap();
            toast.success(res.message || "Product review updated");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // Blog Review Status Change (Assuming you have an update action for blogs)
    const handleBlogStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            // Make sure updateBlogReview exists in your slice
            const res = await dispatch(updateBlogReview({ id, status })).unwrap();
            toast.success(res.message || "Blog review updated");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const getProductName = (productId) => {
        const product = products?.find((p) => p.id === productId);
        return product ? product.name : "N/A";
    };

    // Helper for Status Badges
    const StatusBadge = ({ status }) => {
        const styles = {
            approved: "bg-green-100 text-green-700",
            declined: "bg-red-100 text-red-700",
            pending: "bg-yellow-100 text-yellow-700",
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">REVIEWS MANAGEMENT</h1>
                        <p className="text-gray-500 text-sm">Approve or moderate user feedback across the platform.</p>
                    </div>

                    {/* Tabs Switcher */}
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                        <button
                            onClick={() => setActiveTab("product")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "product" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-black"}`}
                        >
                            <ShoppingBag size={16} /> Products
                        </button>
                        <button
                            onClick={() => setActiveTab("blog")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "blog" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-black"}`}
                        >
                            <BookOpen size={16} /> Blogs
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {(activeTab === "product" ? pLoading : bLoading) ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium">Fetching {activeTab} reviews...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User / Date</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{activeTab === "product" ? "Product" : "Blog ID"}</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Feedback</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(activeTab === "product" ? productReviews : blogReviews).map((review, idx) => (
                                        <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{idx+1}.</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{review.userName}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                                    <Clock size={10} /> {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                                                    {activeTab === "product" ? getProductName(review.productId) : `Blog #${review.blogId}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="flex gap-0.5 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 italic">"{review.comment}"</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={review.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    value={review.status}
                                                    disabled={updatingId === review.id}
                                                    onChange={(e) => activeTab === "product" 
                                                        ? handleProductStatus(review.id, e.target.value)
                                                        : handleBlogStatus(review.id, e.target.value)
                                                    }
                                                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-black outline-none cursor-pointer"
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="approved">✅ Approve</option>
                                                    <option value="declined">❌ Decline</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(activeTab === "product" ? productReviews : blogReviews).length === 0 && (
                                <div className="p-20 text-center text-gray-400">
                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No {activeTab} reviews found yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DefaultPageAdmin>
    );
};

export default AdminReviewsPage;