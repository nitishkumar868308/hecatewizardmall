import React from 'react'
import { useSelector } from "react-redux";

const OrderSummrey = () => {
    const { user } = useSelector((state) => state.me);
    const orders = user?.orders || [];

    if (!user) return <p>Loading...</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="flex flex-col md:flex-col items-start justify-between p-5 border rounded-xl shadow-sm hover:shadow-lg transition bg-white">
                        {/* Order Header */}
                        <div className="flex justify-between w-full items-center">
                            <span className="font-semibold text-gray-800 text-lg">{order.orderNumber}</span>
                            <span className={`px-3 py-1 rounded-full font-medium ${order.status === 'DELIVERED' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">{`Placed on ${new Date(order.createdAt).toLocaleDateString()}`}</p>

                        {/* Items */}
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 border-t pt-3">
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.productName}</p>
                                    <p className="text-gray-500 text-sm">{`Qty: ${item.quantity} × ${item.currencySymbol}${item.price}`}</p>
                                </div>
                                <div className="font-semibold text-gray-800">
                                    {item.total}
                                </div>
                            </div>
                        ))}

                        {/* Order totals */}
                        <div className="flex justify-end mt-3 font-bold text-gray-800 space-x-4">
                            <span>Subtotal: ₹{order.subtotal}</span>
                            <span>Shipping: ₹{order.shippingCharges}</span>
                            <span>Total: ₹{order.totalAmount}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrderSummrey;
