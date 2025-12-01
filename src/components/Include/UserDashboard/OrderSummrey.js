"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "@/app/redux/slices/order/orderSlice";
import { FiEye, FiX } from "react-icons/fi";
import OrderDetail from "@/components/Custom/OrderDetailUser";

const statusStyles = {
    PENDING: "text-yellow-700 bg-yellow-100",
    PROCESSING: "text-orange-700 bg-orange-100",
    INTRANSIT: "text-blue-700 bg-blue-100",
    SHIPPED: "text-indigo-700 bg-indigo-100",
    DELIVERED: "text-green-700 bg-green-100",
    CANCELLED: "text-red-700 bg-red-100",
};


const OrderSummary = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    const { orders } = useSelector((state) => state.order);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const userOrders = orders.filter((order) => order.userId === user.id);

    const generateInvoiceNumber = (orderId, createdAt) => {
        const year = new Date(createdAt).getFullYear();
        return `${orderId}/${year}`;
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleUpdateDetail = () => {
        console.log("handleUpdateDetail");
    };

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>

            {userOrders.length > 0 ? (
                <ul className="space-y-4">
                    {userOrders.map((order) => (
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
                                    {order.status || "PENDING"}
                                </span>
                            </div>

                            <p className="text-gray-500 text-sm mb-3 sm:mb-0">
                                Order Date :  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                            </p>

                            {/* View Button */}
                            <button
                                onClick={() => handleViewOrder(order)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition self-start sm:self-auto cursor-pointer"
                            >
                                <FiEye /> View
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You have no orders yet.</p>
            )}

            {/* Modal */}
            {openModal && selectedOrder && (
                <OrderDetail
                    selectedOrder={selectedOrder}
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    handleUpdateDetail={handleUpdateDetail}
                    generateInvoiceNumber={generateInvoiceNumber}
                />
            )}
        </div>
    );
};

export default OrderSummary;




{/* Items */ }
{/* <div className="space-y-3 mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col space-y-2 border-t pt-3">
                                        <p className="font-semibold text-gray-800">{item.productName}</p>
                                        <div className="flex flex-wrap items-center space-x-4">
                                            {item.colors && item.colors.length > 0 ? (
                                                item.colors.map((c, i) => (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <img
                                                            src={c.image}
                                                            alt={`${c.productName} - ${c.color}`}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <span className="text-gray-500 text-sm">{c.color}</span>


                                                        <div className="ml-4">
                                                            <p className="text-gray-500 text-sm">
                                                                Qty: {c.quantity} × {c.currencySymbol || "₹"}
                                                                {c.pricePerItem || c.totalPrice} = {c.totalPrice || c.pricePerItem}
                                                            </p>
                                                            {item.attributes && (
                                                                <div className="text-gray-500 text-sm">
                                                                    {Object.entries(item.attributes).map(([key, value], idx) => (
                                                                        <span key={idx} className="mr-2">
                                                                            {key}: {value}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}

                                        </div>
                                    </div>
                                ))}

                            </div> */}

{/* Totals */ }
{/* <div className="flex justify-end space-x-6 font-bold text-gray-800 mb-3">
                                <span>Subtotal: ₹{order.subtotal || 0}</span>
                                <span>Shipping: ₹{order.shippingCharges || 0}</span>
                                <span>Total: ₹{order.totalAmount || 0}</span>
                            </div> */}