"use client";
import { forwardRef } from "react";

// forwardRef lagana zaruri hai
const OrderDetailPrint = forwardRef(({ selectedOrder, generateInvoiceNumber, products }, ref) => {

    const getFnSkuForItem = (item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return { fnsku: "-", sku: "-" };

        if (item.variationId && product.variations) {
            const variation = product.variations.find(v => v.id === item.variationId);
            if (variation) return { fnsku: variation.barCode || "-", sku: variation.sku || "-" };
        }

        return { fnsku: product.barCode || "-", sku: product.sku || "-" };
    };


    const orderByLabelMap = {
        "hecate-quickgo": "Hecate QuickGo",
        "website": "Hecate Wizard Mall",
    };

    return (
        <div ref={ref} style={{ display: "none" }} className="p-8 bg-white">

            {/* HEADER */}
            <div className="border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold">Order Invoice</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Invoice No: <b>{generateInvoiceNumber(selectedOrder.id, selectedOrder.createdAt)}</b>
                </p>
                <p className="text-sm text-gray-500">Order Number: {selectedOrder.orderNumber}</p>
                <div className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">
                        Order By: {orderByLabelMap[selectedOrder.orderBy.toLowerCase()] || selectedOrder.orderBy}
                    </span>
                    <br />
                    <span>
                        Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* CUSTOMER, BILLING & SHIPPING */}
            <table className="w-full mb-6 border-collapse">
                <tbody>
                    <tr>
                        {/* Customer */}
                        <td className="p-4 border rounded-xl bg-gray-50 align-top">
                            <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>
                            <p className="font-medium">{selectedOrder.shippingName}</p>
                            <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
                        </td>

                        {/* Billing */}
                        <td className="p-4 border rounded-xl bg-gray-50 align-top">
                            <h3 className="font-semibold mb-1 text-gray-700">Billing Address</h3>
                            <p>{selectedOrder.billingAddress}</p>
                            <p>{selectedOrder.billingCity}, {selectedOrder.billingState}</p>
                            <p>{selectedOrder.billingPincode}</p>
                        </td>

                        {/* Shipping */}
                        <td className="p-4 border rounded-xl bg-gray-50 align-top">
                            <h3 className="font-semibold mb-1 text-gray-700">Shipping Address</h3>
                            <p>{selectedOrder.shippingAddress}</p>
                            <p>{selectedOrder.shippingCity}, {selectedOrder.shippingState}</p>
                            <p>{selectedOrder.shippingPincode}</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ITEMS TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                    <thead className="bg-gray-100">
                        <tr className="uppercase text-xs text-gray-700">
                            <th className="p-2 text-center">#</th>
                            <th className="p-2 text-center">Image</th>
                            <th className="p-2 text-center">Product</th>
                            <th className="p-2 text-center">Variation</th>
                            <th className="p-2 text-center">Qty</th>
                            <th className="p-2 text-center">FNSKU</th>
                            {/* <th className="p-2 text-center">SKU</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrder.items?.map((item, idx) => {
                            const { fnsku, sku } = getFnSkuForItem(item);
                            return (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="p-2 text-center">{idx + 1}</td>
                                    <td className="p-2 flex justify-center">
                                        <img src={item.image} alt={item.attributes?.color || "Product Image"} className="w-16 h-16 rounded-lg object-cover shadow" />
                                    </td>
                                    <td className="p-2 text-center font-medium">{item.productName}</td>
                                    <td className="p-2 text-center">
                                        {item.attributes && (
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(item.attributes).map(([k, v]) => (
                                                    <p key={k}><b>{k}:</b> {v}</p>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-center">{fnsku}</td>
                                    {/* <td className="p-2 text-center">{sku}</td> */}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default OrderDetailPrint;
