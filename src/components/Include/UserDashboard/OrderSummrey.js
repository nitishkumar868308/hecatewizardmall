import React from 'react'
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { useDispatch, useSelector } from "react-redux";

const OrderSummrey = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    console.log("userOrder", user)

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
                <ul className="space-y-4">
                    <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl shadow-sm hover:shadow-lg transition bg-white">
                        <div className="flex items-start md:items-center space-x-4">
                            {/* Placeholder image */}
                            <img
                                src="/products/product1.webp"
                                alt="Order"
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <span className="font-semibold text-gray-800 text-lg">Order #1234</span>
                                <p className="text-gray-500 text-sm mt-1">Placed on 1 Aug 2025</p>
                            </div>
                        </div>
                        <span className="mt-3 md:mt-0 px-3 py-1 rounded-full font-medium text-green-700 bg-green-100">
                            Delivered
                        </span>
                    </li>
                    <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl shadow-sm hover:shadow-lg transition bg-white">
                        <div className="flex items-start md:items-center space-x-4">
                            {/* Placeholder image */}
                            <img
                                src="/products/product2.webp"
                                alt="Order"
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <span className="font-semibold text-gray-800 text-lg">Order #1235</span>
                                <p className="text-gray-500 text-sm mt-1">Placed on 3 Aug 2025</p>
                            </div>
                        </div>
                        <span className="mt-3 md:mt-0 px-3 py-1 rounded-full font-medium text-yellow-700 bg-yellow-100">
                            Processing
                        </span>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default OrderSummrey