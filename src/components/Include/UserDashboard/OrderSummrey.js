"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "@/app/redux/slices/order/orderSlice";
import { FiEye, FiX, FiTruck } from "react-icons/fi";
import OrderDetail from "@/components/Custom/OrderDetailUser";
import { getApplyPromoCode } from "@/app/redux/slices/promoCode/promoCodeSlice";
import Pagination from "@/components/Pagination";
import { RxCross2 } from "react-icons/rx";
import { fetchOrderAdjustments } from "@/app/redux/slices/order-adjustments/orderAdjustmentsSlice";

const statusStyles = {
    PENDING: "text-yellow-700 bg-yellow-100",
    PROCESSING: "text-orange-700 bg-orange-100",
    INTRANSIT: "text-blue-700 bg-blue-100",
    SHIPPED: "text-indigo-700 bg-indigo-100",
    DELIVERED: "text-green-700 bg-green-100",
    CANCELLED: "text-red-700 bg-red-100",
    FAILED: "text-red-700 bg-red-100",
};


const OrderSummary = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    const { orders } = useSelector((state) => state.order);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { appliedPromoCodes } = useSelector((s) => s.promoCode);
    const { adjustments } = useSelector(
        (state) => state.orderAdjustments
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // ek page me kitne orders


    useEffect(() => {
        dispatch(getApplyPromoCode())
        dispatch(fetchOrders());
    }, [dispatch]);

    const userOrders = orders.filter((order) => order.userId === user.id);
    console.log("userOrders", userOrders)

    useEffect(() => {
        if (userOrders?.id) {
            dispatch(fetchOrderAdjustments(userOrders.id))
        }
    }, [dispatch, userOrders?.id])

    const totalPages = Math.ceil(userOrders.length / itemsPerPage);

    const paginatedOrders = userOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const generateInvoiceNumber = (orderId, createdAt) => {
        const year = new Date(createdAt).getFullYear();
        return `${orderId}/${year}`;
    };

    const handleViewOrder = (order) => {
        console.log("order", order)
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleUpdateDetail = () => {
        console.log("handleUpdateDetail");
    };

    return (
        <>
            <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>

                {userOrders.length > 0 ? (
                    <>
                        <ul className="space-y-4">
                            {paginatedOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                >
                                    <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 sm:mb-0">
                                        <span className="font-semibold text-lg text-gray-800">
                                            Order Id : {order.orderNumber || "N/A"}
                                            {/* (ID: {order.id}) */}
                                        </span>
                                        <span
                                            className={`mt-2 sm:mt-0 px-3 py-1 rounded-full font-medium text-sm ${statusStyles[order.status] || "text-gray-700 bg-gray-100"
                                                }`}
                                        >
                                            Order status : {order.status || "PENDING"}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-3 sm:mb-0">
                                        Order Date: {order.createdAt
                                            ? new Date(order.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })
                                            : "-"}
                                    </p>

                                    <p className="text-gray-500 text-sm mb-3 sm:mb-0">
                                        Order From: {order.orderBy === "website" ? "Hecate Wizard Mall ( Website )" : "Hecate QuickGo"}
                                    </p>


                                    {/* View Button */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
                                        >
                                            <FiEye /> View
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (order?.trackingLink) {
                                                    window.open(order.trackingLink, "_blank", "noopener,noreferrer");
                                                }
                                            }}
                                            disabled={!order?.trackingLink}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition 
                                                    ${order?.trackingLink
                                                    ? "bg-gray-700 text-white hover:bg-gray-900 cursor-pointer"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {order?.trackingLink ? <FiTruck /> : <FiTruck />}
                                            {order?.trackingLink ? "Track" : "Track"}
                                        </button>
                                    </div>


                                </li>
                            ))}
                        </ul>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                ) : (
                    <p className="text-gray-500">You have no orders yet.</p>
                )}

                {adjustments ? "Yes" : "No"}


            </div>

            {/* Modal */}
            {openModal && selectedOrder && (
                <OrderDetail
                    selectedOrder={selectedOrder}
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    handleUpdateDetail={handleUpdateDetail}
                    generateInvoiceNumber={generateInvoiceNumber}
                    appliedPromoCodes={appliedPromoCodes}
                />
            )}
        </>

    );
};

export default OrderSummary;