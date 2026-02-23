// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import OrderChat from "@/components/Common/OrderChat";
// import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
// import { useDispatch, useSelector } from "react-redux";

// export default function OrderDetail({
//     selectedOrder,
//     isOpen,
//     onClose,
//     handleUpdateDetail,
//     generateInvoiceNumber
// }) {
//     console.log("selectedOrder", selectedOrder)
//     const dispatch = useDispatch();
//     const [status, setStatus] = useState(selectedOrder?.status || "");
//     const { user } = useSelector((state) => state.me);
//     console.log("user", user)

//     useEffect(() => {
//         dispatch(fetchMe());
//     }, [dispatch]);

//     if (!isOpen || !selectedOrder) return null;
//     const orderByLabelMap = {
//         "hecate-quickgo": "Hecate QuickGo",
//         "website": "Hecate Wizard Mall",
//     };
//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

//             {/* LEFT CHAT PANEL */}
//             <div className="w-80 bg-white border-r shadow-xl flex flex-col">

//                 {/* Chat Header */}
//                 <div className="border-b px-4 py-3 font-semibold text-lg bg-gray-50">
//                     Chat / Messages
//                 </div>
//                 <OrderChat
//                     orderId={selectedOrder.id}
//                     currentUser={user?.id}        // <- id bhejna
//                     currentUserRole={user?.role}
//                     receiverId={user?.role === "ADMIN" ? selectedOrder.userId : 1} // <--- customer id
//                     receiverRole={user?.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}
//                 />






//                 {/* Chat Messages */}
//                 {/* <div className="flex-1 p-4 space-y-3 overflow-y-auto">

//                     <div className="text-center text-gray-400 text-sm">
//                         No messages yet...
//                     </div>

//                 </div>


//                 <div className="border-t bg-gray-50 p-2 flex gap-2">
//                     <input
//                         type="text"
//                         placeholder="Type a message..."
//                         className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
//                     />
//                     <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
//                         Send
//                     </button>
//                 </div> */}

//                 {/* Notes */}
//                 <div className="border-t px-4 py-3 font-semibold text-lg bg-gray-50">
//                     Notes / Info
//                 </div>

//                 <textarea
//                     className="w-full h-40 border-none px-4 py-3 text-sm resize-none outline-none bg-white"
//                     placeholder="Add notes here..."
//                 ></textarea>

//             </div>

//             {/* RIGHT INVOICE PANEL */}
//             <div className="flex-1 bg-white overflow-y-auto p-8 relative">

//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-3xl font-bold cursor-pointer hover:text-red-500 transition"
//                 >
//                     ×
//                 </button>

//                 {/* Header */}
//                 <div className="border-b pb-4 mb-6 flex justify-between items-center">
//                     <div>
//                         <h2 className="text-3xl font-bold">Order Invoice</h2>

//                         <p className="text-sm text-gray-600 mt-1">
//                             Invoice No:{" "}
//                             <b>
//                                 {generateInvoiceNumber(
//                                     selectedOrder.id,
//                                     selectedOrder.createdAt
//                                 )}
//                             </b>
//                         </p>

//                         <p className="text-sm text-gray-500">
//                             Order Number: {selectedOrder.orderNumber}
//                         </p>
//                     </div>


//                     <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
//                         Order By: {orderByLabelMap[selectedOrder.orderBy.toLowerCase()] || selectedOrder.orderBy}
//                     </span>

//                     <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
//                         Order Status: {selectedOrder.status}
//                     </span>
//                 </div>

//                 {/* CUSTOMER DETAILS GRID */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

//                     {/* CUSTOMER */}
//                     <div className="p-4 border rounded-xl bg-gray-50">
//                         <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>
//                         <p className="font-medium">{selectedOrder.shippingName}</p>
//                         <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
//                     </div>

//                     {/* BILLING */}
//                     <div className="p-4 border rounded-xl bg-gray-50">
//                         <h3 className="font-semibold mb-1 text-gray-700">
//                             Billing Address
//                         </h3>
//                         <p>{selectedOrder.billingAddress}</p>
//                         <p>
//                             {selectedOrder.billingCity}, {selectedOrder.billingState}
//                         </p>
//                         <p>{selectedOrder.billingPincode}</p>
//                     </div>

//                     {/* SHIPPING */}
//                     <div className="p-4 border rounded-xl bg-gray-50">
//                         <h3 className="font-semibold mb-1 text-gray-700">
//                             Shipping Address
//                         </h3>
//                         <p>{selectedOrder.shippingAddress}</p>
//                         <p>
//                             {selectedOrder.shippingCity}, {selectedOrder.shippingState}
//                         </p>
//                         <p>{selectedOrder.shippingPincode}</p>
//                     </div>

//                     {/* PAYMENT */}
//                     <div className="p-4 border rounded-xl bg-gray-50">
//                         <h3 className="font-semibold mb-1 text-gray-700">Payment</h3>
//                         <p className="font-medium">
//                             Method: {selectedOrder.paymentMethod}
//                         </p>
//                         <p className="text-green-700 font-medium">
//                             Status: {selectedOrder.paymentStatus}
//                         </p>
//                     </div>



//                 </div>

//                 {/* TABLE */}
//                 <div className="mt-8 overflow-x-auto">
//                     <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
//                         <thead className="bg-gray-100">
//                             <tr className="uppercase text-xs text-gray-700">
//                                 <th className="p-2 text-center">#</th>
//                                 <th className="p-2 text-center">Image</th>
//                                 <th className="p-2 text-center">Product</th>
//                                 <th className="p-2 text-center">Variation</th>
//                                 <th className="p-2 text-center">Qty</th>
//                                 <th className="p-2 text-center">Rate</th>
//                                 <th className="p-2 text-center">Offer</th>
//                                 <th className="p-2 text-center">Amount</th>
//                                 <th className="p-2 text-center">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {selectedOrder.items?.map((item, idx) => (
//                                 <tr key={idx} className="border-b hover:bg-gray-50">
//                                     <td className="p-2 text-center">{idx + 1}</td>

//                                     <td className="p-2">
//                                         <div className="flex justify-center items-center">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.attributes?.color || "Product Image"}
//                                                 className="w-16 h-16 rounded-lg object-cover shadow"
//                                             />
//                                         </div>
//                                     </td>

//                                     <td className="p-2 font-medium text-center">{item.productName}</td>

//                                     <td className="p-2 text-center">
//                                         {item.attributes && (
//                                             <div className="text-xs text-gray-500">
//                                                 {Object.entries(item.attributes).map(([k, v]) => (
//                                                     <p key={k}>
//                                                         <b>{k}:</b> {v}
//                                                     </p>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </td>

//                                     <td className="p-2 text-center">{item.quantity}</td>
//                                     <td className="p-2 text-center">₹{item.pricePerItem}</td>

//                                     <td className="p-2 text-center">
//                                         {item.offerApplied ? (
//                                             <span className="text-green-600 font-semibold">Applied</span>
//                                         ) : (
//                                             <span className="text-gray-400">No</span>
//                                         )}
//                                     </td>

//                                     <td className="p-2 text-center font-bold">₹{item.totalPrice}</td>

//                                     <td className="p-2 text-center space-x-1">
//                                         <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
//                                             Query
//                                         </button>
//                                         <button className="px-2 py-1 text-xs bg-yellow-400 text-white rounded">
//                                             Update
//                                         </button>
//                                         <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {/* TOTAL ROW - ITEMS */}
//                             <tr className="bg-gray-200 font-semibold">
//                                 {/* Product column → TOTAL */}
//                                 <td className="p-3 text-left text-sm">Total</td>


//                                 {/* # column empty */}
//                                 <td></td>

//                                 {/* Image column empty */}
//                                 <td></td>

//                                 {/* Variation column empty */}
//                                 <td></td>

//                                 {/* Qty column → total qty */}
//                                 <td className="p-3 text-center text-sm">
//                                     {selectedOrder.quantity}
//                                 </td>

//                                 {/* Price column empty */}
//                                 <td></td>

//                                 {/* Offer column empty */}
//                                 <td></td>

//                                 {/* Total amount column */}
//                                 <td className="p-3 text-center text-sm">
//                                     ₹{selectedOrder.subtotal}
//                                 </td>

//                                 {/* Actions column empty */}
//                                 <td></td>
//                             </tr>



//                             {/* SHIPPING ROW */}
//                             <tr className="bg-gray-100 font-medium">
//                                 <td colSpan={7} className="text-left  p-3 text-sm">
//                                     Shipping Charges
//                                 </td>
//                                 <td className="text-center p-3 text-sm">
//                                     ₹{selectedOrder.shippingCharges}
//                                 </td>
//                                 <td></td>
//                             </tr>

//                             {/* GRAND TOTAL */}
//                             <tr className="bg-gray-300 font-bold">
//                                 <td colSpan={7} className="text-left  p-3 text-lg">
//                                     Grand Total
//                                 </td>
//                                 <td className="text-center p-3 text-lg">
//                                     ₹{selectedOrder.totalAmount}
//                                 </td>
//                                 <td></td>
//                             </tr>


//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </div>
//     );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import OrderChat from "@/components/Common/OrderChat";
import OrderDetailPrint from "./OrderDetailPrint";
import { useReactToPrint } from "react-to-print";
import OtherPricing from "./OtherPricing";
import { fetchOrderAdjustments } from "@/app/redux/slices/order-adjustments/orderAdjustmentsSlice";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderDetail({
    selectedOrder,
    isOpen,
    onClose,
    handleUpdateDetail,
    generateInvoiceNumber,
    appliedPromoCodes,
    products
}) {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(selectedOrder?.status || "");
    const { user } = useSelector((state) => state.me);
    const { adjustments } = useSelector(
        (state) => state.orderAdjustments
    );
    const printRef = useRef();
    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    const orderAdjustments = adjustments?.filter(
        (adj) => adj.orderId === selectedOrder.id
    );
    console.log("orderAdjustments", orderAdjustments)

    const latestAdjustment = orderAdjustments?.[0];
    console.log("latestAdjustment", latestAdjustment)

    useEffect(() => {
        if (selectedOrder?.id) {
            dispatch(fetchOrderAdjustments(selectedOrder.id))
        }
    }, [dispatch, selectedOrder?.id])

    if (!isOpen || !selectedOrder) return null;

    const orderByLabelMap = {
        "hecate-quickgo": "Hecate QuickGo",
        "website": "Hecate Wizard Mall",
    };
    console.log("selectedOrder", selectedOrder)
    // Promo calculation
    const appliedPromo = appliedPromoCodes?.find(p => p.orderId === selectedOrder.id);
    const promoDiscount = appliedPromo?.discountAmount || 0;
    const promoCodeName = appliedPromo?.promo?.code || selectedOrder.promoCode || '';

    const donationAmount = selectedOrder.donationAmount || 0;
    const shipping = selectedOrder.shippingCharges || 0;
    const tax = selectedOrder.taxAmount || 0;

    // Grand total
    const grandTotal = selectedOrder.totalAmount || 0;

    // Correct subtotal calculation from order object
    const subtotal = selectedOrder.subtotal || 0;

    // Calculate actual amount (price * qty)
    const actualAmount = selectedOrder.items?.reduce((acc, item) => {
        return acc + (item.pricePerItem * item.quantity);
    }, 0) || subtotal;

    const handlePrint = () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            console.log("printContents", printContents)
            const originalContents = document.body.innerHTML;
            console.log("originalContents", originalContents)
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // reload react app
        }
    };


    const getFnSkuForItem = (item) => {
        // Step 1: Find product
        const product = products.find(p => p.id === item.productId);
        if (!product) return { fnsku: "-", sku: "-" };

        // Step 2: Check if variation exists
        if (item.variationId && product.variations) {
            const variation = product.variations.find(v => v.id === item.variationId);
            if (variation) {
                return { fnsku: variation.barCode || "-", sku: variation.sku || "-" };
            }
        }
        console.log("Searching for:", item.productId);
        console.log("Available products:", products);
        console.log("Matched product:", product);
        console.log("Product variations:", product?.variations);
        console.log("Item variationId:", item.variationId);
        // Step 3: Fallback to product's main fnsku/sku
        return { fnsku: product.barCode || "-", sku: product.sku || "-" };

    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Payment link copied!");
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

            {/* LEFT PANEL - Chat + Notes */}
            <div className="w-80 bg-white border-r shadow-xl flex flex-col">

                {/* Chat Header */}
                <div className="border-b px-4 py-3 font-semibold text-lg bg-gray-50">
                    Chat / Messages
                </div>

                <OrderChat
                    orderId={selectedOrder.id}
                    currentUser={user?.id}
                    currentUserRole={user?.role}
                    receiverId={user?.role === "ADMIN" ? selectedOrder.userId : 1}
                    receiverRole={user?.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}
                />

                <div className="border-t border-b bg-gray-50">
                    <OtherPricing orderId={selectedOrder.id} />
                </div>

                {/* Notes */}
                <div className="border-t px-4 py-3 font-semibold text-lg bg-gray-50">
                    Notes / Info
                </div>

                <textarea
                    className="w-full h-40 border-none px-4 py-3 text-sm resize-none outline-none bg-white"
                    placeholder="Add notes here..."
                    defaultValue={selectedOrder.note || ""}
                />
            </div>

            {/* RIGHT PANEL - Invoice */}
            <div className="flex-1 bg-white overflow-y-auto p-8 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold cursor-pointer hover:text-red-500 transition"
                >
                    ×
                </button>

                {/* Header */}
                <div className="border-b pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">Order Invoice</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {/* Invoice No: <b>{generateInvoiceNumber(selectedOrder.id, selectedOrder.createdAt)}</b> */}
                            Invoice No: <b>{selectedOrder.invoiceNumber || "No Invoice Number"}</b>
                        </p>
                        <p className="text-sm text-gray-500">Order Number: {selectedOrder.orderNumber}</p>
                    </div>

                    <div className="flex flex-col">
                        <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                            Order By: {orderByLabelMap[selectedOrder.orderBy.toLowerCase()] || selectedOrder.orderBy}
                        </span>
                        <span className="mt-1 text-xs px-4 py-2 text-gray-500">
                            Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                        </span>
                    </div>


                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Order Status: {selectedOrder.status}
                    </span>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>
                        <p className="font-medium">{selectedOrder.shippingName}</p>
                        <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
                    </div>
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Billing Address</h3>
                        <p>{selectedOrder.billingAddress}</p>
                        <p>{selectedOrder.billingCity}, {selectedOrder.billingState}</p>
                        <p>{selectedOrder.billingPincode}</p>
                    </div>
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Shipping Address</h3>
                        <p>{selectedOrder.shippingAddress}</p>
                        <p>{selectedOrder.shippingCity}, {selectedOrder.shippingState}</p>
                        <p>{selectedOrder.shippingPincode}</p>
                    </div>
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Payment</h3>
                        <p className="font-medium">Method: {selectedOrder.paymentMethod}</p>
                        <p className="text-green-700 font-medium">Status: {selectedOrder.paymentStatus}</p>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                        <thead className="bg-gray-100">
                            <tr className="uppercase text-xs text-gray-700">
                                <th className="p-2 text-center">#</th>
                                <th className="p-2 text-center">Image</th>
                                <th className="p-2 text-center">Product</th>
                                <th className="p-2 text-center">Variation</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-center">Rate</th>
                                <th className="p-2 text-center">Offer</th>
                                <th className="p-2 text-center">FNSKU</th>
                                {/* <th className="p-2 text-center">SKU</th> */}
                                <th className="p-2 text-center">Amount</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.items?.map((item, idx) => {
                                const { fnsku, sku } = getFnSkuForItem(item);
                                return (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-2 text-center">{idx + 1}</td>
                                        <td className="p-2 flex justify-center">
                                            <img
                                                src={item.image}
                                                alt={item.attributes?.color || "Product Image"}
                                                className="w-16 h-16 rounded-lg object-cover shadow"
                                            />
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
                                        <td className="p-2 text-center">₹{item.pricePerItem}</td>
                                        {/* <td className="p-2 text-center">
                                            {item.productOfferApplied ? (
                                                <span className="text-green-600 font-semibold">
                                                    Yes ({item.productOffer?.name})
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No</span>
                                            )}
                                        </td> */}
                                        <td className="p-2 text-center">
                                            {item.offerApplied ? (
                                                <span className="text-green-600 font-semibold">
                                                    Yes (Bulk Price)
                                                </span>
                                            ) : item.productOfferApplied ? (
                                                <span className="text-green-600 font-semibold">
                                                    Yes ({item.productOffer?.name})
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No</span>
                                            )}
                                        </td>
                                        <td className="p-2 text-center">{fnsku}</td>
                                        {/* <td className="p-2 text-center">{sku}</td> */}
                                        <td className="p-2 text-center font-bold">
                                            ₹{item.pricePerItem * item.quantity}
                                        </td>

                                        <td className="p-2 text-center space-x-1">
                                            <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                                Query
                                            </button>
                                            <button className="px-2 py-1 text-xs bg-yellow-400 text-white rounded">
                                                Update
                                            </button>
                                            <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}

                            {/* SUBTOTAL */}
                            <tr className="bg-gray-200 font-semibold">
                                <td colSpan={8} className="p-3 text-left">Subtotal</td>
                                <td className="p-3 text-center">
                                    {actualAmount !== subtotal ? (
                                        <>
                                            <span className="line-through text-gray-400 mr-2">₹{actualAmount}</span>
                                            <span>₹{subtotal}</span>
                                        </>
                                    ) : (
                                        <span>₹{subtotal}</span>
                                    )}
                                </td>
                                <td></td>
                            </tr>


                            {/* Promo Discount */}
                            {promoDiscount > 0 && (
                                <tr className="bg-green-100 font-semibold">
                                    <td colSpan={8} className="p-3 text-left">
                                        Promo Applied: {promoCodeName} (-₹{promoDiscount})
                                    </td>
                                    <td className="p-3 text-center">-₹{promoDiscount}</td>
                                    <td></td>
                                </tr>
                            )}

                            {/* Donation */}
                            {donationAmount > 0 && (
                                <tr className="bg-yellow-100 font-semibold">
                                    <td colSpan={8} className="p-3 text-left">Donation</td>
                                    <td className="p-3 text-center">₹{donationAmount}</td>
                                    <td></td>
                                </tr>
                            )}

                            {/* Shipping */}
                            <tr className="bg-gray-100 font-medium">
                                <td colSpan={8} className="p-3 text-left">Shipping Charges</td>
                                <td className="p-3 text-center">₹{shipping}</td>
                                <td></td>
                            </tr>

                            {/* Tax */}
                            {tax > 0 && (
                                <tr className="bg-gray-100 font-medium">
                                    <td colSpan={8} className="p-3 text-left">Tax</td>
                                    <td className="p-3 text-center">₹{tax}</td>
                                    <td></td>
                                </tr>
                            )}

                            {/* GRAND TOTAL */}
                            <tr className="bg-gray-300 font-bold">
                                <td colSpan={8} className="p-3 text-left text-lg">Grand Total</td>
                                <td className="p-3 text-center text-lg">₹{grandTotal}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handlePrint}
                            className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 cursor-pointer mb-5"
                        >
                            Download / Print
                        </button>
                    </div>

                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Order Adjustments
                        </h3>

                        <div className="space-y-3">
                            {adjustments
                                ?.filter((adj) => adj.orderId === selectedOrder?.id)
                                ?.map((adj) => {
                                    const fullUrl = adj.paymentTxnId
                                        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/adjustments/payu-redirect?txnId=${adj.paymentTxnId}`
                                        : null;

                                    return (
                                        <div
                                            key={adj.id}
                                            className="p-3 bg-white border rounded-lg text-xs space-y-2"
                                        >
                                            {/* Top Row */}
                                            <div className="flex justify-between items-center">
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">
                                                        ₹ {adj.amount}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Created At : {new Date(adj.createdAt).toLocaleString()}
                                                    </p>
                                                </div>

                                                <span className="px-2 py-1 rounded-md text-[10px] bg-gray-100 text-gray-600">
                                                    Payment Status : {adj.status}
                                                    <p className="text-gray-500">
                                                        Paid At : {adj.paidAt
                                                            ? new Date(adj.paidAt).toLocaleString()
                                                            : "No"}
                                                    </p>

                                                </span>



                                                <span className="px-2 py-1 rounded-md text-[10px] bg-gray-100 text-gray-600">
                                                    {adj.adjustmentType}
                                                </span>
                                            </div>



                                            {/* Payment URL */}
                                            {fullUrl && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <a
                                                        href={fullUrl}
                                                        target="_blank"
                                                        className="text-blue-600 hover:underline break-all flex-1 text-left"
                                                    >
                                                        {fullUrl}
                                                    </a>

                                                    <button
                                                        onClick={() => handleCopy(fullUrl)}
                                                        className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                                                        title="Copy Link"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                </div>
                                            )}

                                            {(() => {
                                                const isExpired =
                                                    adj?.expiresAt && new Date() > new Date(adj.expiresAt);

                                                return (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[11px] font-medium
                                                                ${adj?.expiresAt
                                                                ? isExpired
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {adj?.expiresAt
                                                            ? isExpired
                                                                ? "Expired"
                                                                : `Expires: ${new Date(adj.expiresAt).toLocaleString()}`
                                                            : "No Expiry"}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                </div>
            </div>


            <OrderDetailPrint
                ref={printRef}
                selectedOrder={selectedOrder}
                generateInvoiceNumber={generateInvoiceNumber}
                products={products}
            />
        </div>
    );
}
