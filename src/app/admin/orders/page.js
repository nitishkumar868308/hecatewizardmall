"use client";
import React, { useEffect, useState, useMemo } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchOrders, updateOrder } from "@/app/redux/slices/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import EditOrderModal from "@/components/Admin/OrdersEdit/OrdersEdit";
import OrderDetail from "@/components/Admin/OrdersEdit/OrdersDetail";
import toast from 'react-hot-toast';
import { getApplyPromoCode } from "@/app/redux/slices/promoCode/promoCodeSlice";
import { fetchProducts } from "@/app/redux/slices/products/productSlice";
import Pagination from "@/components/Pagination";

const Page = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    console.log("orders", orders)
    const { list: users } = useSelector(
        (state) => state.getAllUser
    );
    const { products } = useSelector((state) => state.products);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSource, setFilterSource] = useState("ALL");
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { appliedPromoCodes } = useSelector((s) => s.promoCode);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 7;
    console.log("products", products)
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(getApplyPromoCode())
        dispatch(fetchAllUsers());
        dispatch(fetchOrders());
    }, [dispatch]);

    // 🔍 SEARCH + FILTER LOGIC
    const filteredOrders = useMemo(() => {
        return orders?.filter((order) => {
            const s = searchQuery.toLowerCase();
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(s) ||
                order.shippingName.toLowerCase().includes(s) ||
                order.shippingPhone.includes(s);

            const matchesSource =
                filterSource === "ALL" ||
                (filterSource === "WEBSITE" && order.orderBy.toLowerCase() === "website") ||
                (filterSource === "HECATE" && order.orderBy.toLowerCase() === "hecate-quickgo");



            return matchesSearch && matchesSource;
        });
    }, [orders, searchQuery, filterSource]);
    console.log("filteredOrders", filteredOrders)

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const generateInvoiceNumber = (orderId, createdAt) => {
        const year = new Date(createdAt).getFullYear();
        return `${orderId}/${year}`;
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setOpenModalEdit(true);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleUpdateStatus = (orderId, newStatus, trackingLink) => {
        dispatch(updateOrder({ id: orderId, status: newStatus, trackingLink: trackingLink }))
            .unwrap()
            .then((res) => {
                const message = res?.message || "Status updated successfully!";
                toast.success(message);
                setOpenModalEdit(false);
                dispatch(fetchOrders());
            })
            .catch((err) => {
                const errorMsg = err?.message || "Failed to update status";
                toast.error(errorMsg);
            });
    };



    const handleUpdateDetail = () => {

        console.log("handleUpdateDetail")
    }

    const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        SHIPPED: "bg-indigo-100 text-indigo-700",
        DELIVERED: "bg-green-100 text-green-700",
        COMPLETED: "bg-emerald-100 text-emerald-700",
        FAILED: "bg-red-100 text-red-700",
        CANCELED: "bg-gray-200 text-gray-700",
        REFUND: "bg-purple-100 text-purple-700",
        PAID: "bg-emerald-100 text-emerald-700",
    };


    return (
        <DefaultPageAdmin>
            <div className="p-5">
                <h1 className="text-2xl font-semibold mb-5">User Orders</h1>

                {/* 🔍 SEARCH + FILTER */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, phone, order number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                    />

                    <select
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="ALL">All Orders</option>
                        <option value="WEBSITE">Website Orders</option>
                        <option value="HECATE">Hecate QuickGo Orders</option>
                    </select>
                </div>

                {/* 📦 ORDERS TABLE */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Orders</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-xl rounded-xl border border-gray-200">
                            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                                <tr>
                                    <th className="p-4 text-center">S.No</th>
                                    <th className="p-4 text-center">Item</th>
                                    <th className="p-4 text-center">Order #</th>
                                    <th className="p-4 text-center">Invoice No.</th>
                                    <th className="p-4 text-center">User</th>
                                    <th className="p-4 text-center">Total</th>
                                    <th className="p-4 text-center">Payment Status</th>
                                    <th className="p-4 text-center">Order Status</th>
                                    <th className="p-4 text-center">Order By</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-800 text-sm">
                                {currentOrders?.map((order, idx) => (
                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50 transition-all"
                                    >
                                        {/* S.No */}
                                        <td className="p-4 text-center font-medium">{indexOfFirstOrder + idx + 1}.</td>


                                        {/* First Item Image */}
                                        <td className="p-4 text-center">
                                            {order.items && order.items.length > 0 && order.items[0].image ? (
                                                <div className="w-14 h-14 rounded-md overflow-hidden mx-auto shadow-sm">
                                                    <img
                                                        src={order.items[0].image}
                                                        alt={order.items[0].attributes?.color || "item"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-100 rounded-md mx-auto flex items-center justify-center text-gray-400">
                                                    N/A
                                                </div>
                                            )}
                                        </td>


                                        {/* Order Number */}
                                        <td className="p-4 font-semibold text-center">
                                            <div>{order.orderNumber}</div>
                                            <div className="text-sm text-gray-500 font-normal">
                                                ({new Date(order.createdAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })})
                                            </div>
                                        </td>

                                        {/* Invoice Number */}
                                        <td className="p-4 font-semibold text-center">
                                            {order.invoiceNumber && order.invoiceDate ? (
                                                <>
                                                    <div>{order.invoiceNumber}</div>
                                                    <div className="text-sm text-gray-500 font-normal">
                                                        ({new Date(order.invoiceDate).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                        })})
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 text-sm">
                                                    {/* Icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5 mb-1 text-red-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>

                                                    {/* Message */}
                                                    <span className="font-medium">
                                                        {order.paymentStatus === "Failed" || order.status === "Failed"
                                                            ? "Payment Failed"
                                                            : order.status === "Canceled"
                                                                ? "Order Cancelled"
                                                                : "Invoice Not Generated"}
                                                    </span>
                                                </div>
                                            )}
                                        </td>



                                        {/* User Name and Email */}
                                        <td className="p-4 font-semibold text-center">
                                            {(() => {
                                                const user = users.find(u => u.id === order.userId);
                                                return user ? `${user.name} (${user.email})` : "N/A";
                                            })()}
                                        </td>


                                        {/* Total Amount */}
                                        <td className="p-4 text-center font-semibold ">
                                            ₹{order.totalAmount}
                                        </td>

                                        {/* Payment Status */}
                                        <td className="p-4 text-center font-semibold ">
                                            <div>
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyles[order.paymentStatus] ||
                                                        "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Payment Method */}
                                        {/* <td className="p-4 text-center font-semibold">{order.paymentMethod || "-"}</td> */}
                                        {/* Order Status */}
                                        <td className="p-4 text-center">
                                            <div>
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyles[order.status] ||
                                                        "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>


                                            {/* Updated Date */}
                                            {order.updatedAt && (
                                                <div className="text-xs text-gray-500 mt-2">
                                                    ({new Date(order.updatedAt).toLocaleString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })})
                                                </div>
                                            )}
                                        </td>


                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center">
                                                <span className="px-3 py-1 bg-black text-white rounded-full text-md font-semibold shadow-sm">
                                                    {order.orderBy}
                                                </span>
                                            </div>
                                        </td>



                                        {/* Action */}
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* VIEW BUTTON */}
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition text-sm cursor-pointer"
                                                    title="View"
                                                >
                                                    <FiEye size={16} />
                                                </button>

                                                {/* EDIT BUTTON */}
                                                <button
                                                    onClick={() => handleEditOrder(order)}
                                                    className="p-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-800 transition cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <FiEdit size={16} />
                                                </button>

                                                {/* DELETE BUTTON */}
                                                {/* <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button> */}
                                            </div>
                                        </td>

                                    </tr>
                                ))}

                                {filteredOrders?.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}

                    {/* MOBILE VIEW STACKED CARDS */}
                    {/* <div className="md:hidden mt-4 space-y-4">
                        {filteredOrders?.map((order, idx) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">#{idx + 1}</span>
                                    <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                                </div>

                                <p className="text-gray-700 mb-1">{order.orderNumber}</p>

                                <div className="flex items-center gap-3 mb-2">
                                    {order.items && order.items.length > 0 && order.items[0].colors?.[0]?.image ? (
                                        <img
                                            src={order.items[0].colors[0].image}
                                            alt="item"
                                            className="w-16 h-16 rounded-md object-cover border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                            N/A
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium">{order.items?.[0]?.productName}</p>
                                        <p className="text-xs text-gray-500">{order.paymentMethod || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-3 gap-2">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditOrder(order)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                                            title="View"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => handleEditOrder(order)}
                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                                            title="Edit"
                                        >
                                            <FiEdit size={14} />
                                        </button>

                                        button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={14} />
                                        </button> 
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}

                </div>



                {/* 🔍 MODAL (ORDER DETAILS) */}
                {openModal && selectedOrder && (
                    <OrderDetail
                        selectedOrder={selectedOrder}
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        handleUpdateDetail={handleUpdateDetail}
                        generateInvoiceNumber={generateInvoiceNumber}
                        appliedPromoCodes={appliedPromoCodes}
                        products={products}
                    />
                )}

                {openModalEdit && selectedOrder && (
                    <EditOrderModal
                        order={selectedOrder}
                        isOpen={openModalEdit}
                        onClose={() => setOpenModalEdit(false)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}

            </div>
        </DefaultPageAdmin>
    );
};

export default Page;
