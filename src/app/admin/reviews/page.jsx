"use client";

import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, updateReview } from "@/app/redux/slices/reviews/reviewsSlice";
import toast from "react-hot-toast";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";

const AdminReviewsPage = () => {
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector((state) => state.reviews);
    console.log("reviews", reviews)
    const { products } = useSelector((state) => state.products);

    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchReviews());
    }, [dispatch]);

    const handleStatusChange = async (id, status) => {
        try {
            setUpdatingId(id);

            const res = await dispatch(
                updateReview({ id, status })
            ).unwrap();

            toast.success(res.message);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const getProductName = (productId) => {
        if (!productId) return "N/A";

        const product = products?.find(
            (p) => p.id === productId
        );

        return product ? product.name : "Product not found";
    };


    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>

                {/* Loading */}
                {loading && (
                    <p className="text-gray-500 text-center">Loading reviews...</p>
                )}

                {/* No reviews */}
                {!loading && reviews.length === 0 && (
                    <p className="text-gray-500 text-center">No reviews found</p>
                )}

                {/* Reviews Table */}
                {!loading && reviews.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">User</th>
                                    <th className="px-4 py-3 text-left">Product Name</th>
                                    <th className="px-4 py-3 text-left">Rating</th>
                                    <th className="px-4 py-3 text-left">Comment</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reviews.map((review, idx) => (
                                    <tr
                                        key={review.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {idx + 1}.
                                        </td>
                                        {/* User */}
                                        <td className="px-4 py-3 font-medium">
                                            {review.userName}
                                        </td>

                                        {/* Product */}
                                        <td className="px-4 py-3 text-gray-700 font-medium">
                                            {getProductName(review.productId)}
                                        </td>


                                        {/* Rating */}
                                        <td className="px-4 py-3 text-yellow-500">
                                            {"⭐".repeat(review.rating)}
                                        </td>

                                        {/* Comment */}
                                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                            {review.comment}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold
                          ${review.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : review.status === "declined"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }
                        `}
                                            >
                                                {review.status}
                                            </span>
                                        </td>

                                        {/* Date column */}
                                        <td className="px-4 py-3 text-gray-500 text-sm">
                                            {new Date(review.createdAt).toLocaleString()}
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3">
                                            <select
                                                value={review.status}
                                                disabled={updatingId === review.id}
                                                onChange={(e) =>
                                                    handleStatusChange(review.id, e.target.value)
                                                }
                                                className="border rounded px-2 py-1 text-sm focus:outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="declined">Decline</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DefaultPageAdmin>
    );
};

export default AdminReviewsPage;
