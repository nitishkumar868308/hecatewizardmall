// "use client";

// export default function OrderDetail({
//     selectedOrder,
//     isOpen,
//     onClose,
//     handleUpdateDetail,
//     generateInvoiceNumber
// }) {
//     if (!isOpen || !selectedOrder) return null;
//     console.log("selectedOrder", selectedOrder)
//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">

//             {/* LEFT CHAT PANEL */}
//             {/* <div className="w-80 bg-white border-r shadow-xl flex flex-col">

//                 <div className="border-b px-4 py-3 font-semibold text-lg bg-gray-50">
//                     Chat / Messages
//                 </div>



//                 <div className="flex-1 p-4 space-y-3 overflow-y-auto">

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
//                 </div>

//                 <div className="border-t px-4 py-3 font-semibold text-lg bg-gray-50">
//                     Notes / Info
//                 </div>

//                 <textarea
//                     className="w-full h-40 border-none px-4 py-3 text-sm resize-none outline-none bg-white"
//                     placeholder="Add notes here..."
//                 ></textarea>

//             </div> */}
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
//                         <thead className="bg-gray-900">
//                             <tr className="uppercase text-xs text-gray-100">
//                                 <th className="p-2 text-center">#</th>
//                                 <th className="p-2 text-center">Image</th>
//                                 <th className="p-2 text-center">Product</th>
//                                 <th className="p-2 text-center">Variation</th>
//                                 <th className="p-2 text-center">Qty</th>
//                                 <th className="p-2 text-center">Rate</th>
//                                 <th className="p-2 text-center">Offer</th>
//                                 <th className="p-2 text-center">Amount</th>
//                                 {/* <th className="p-2 text-center">Actions</th> */}
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

export default function OrderDetail({
    selectedOrder,
    isOpen,
    onClose,
    handleUpdateDetail,
    generateInvoiceNumber,
    appliedPromoCodes
}) {
    if (!isOpen || !selectedOrder) return null;
    console.log("selectedOrder", selectedOrder)
    // Find applied promo for this order
    const appliedPromo = appliedPromoCodes?.find(p => p.orderId === selectedOrder.id);
    const promoDiscount = appliedPromo?.discountAmount || 0;
    const promoCodeName = appliedPromo?.promo?.code || selectedOrder.promoCode || '';

    const donationAmount = selectedOrder.donationAmount || 0;
    const subtotal = selectedOrder.subtotal || 0;
    const shipping = selectedOrder.shippingCharges || 0;
    const tax = selectedOrder.taxAmount || 0;

    // Use backend totalAmount directly to avoid mismatch
    const grandTotal = selectedOrder.totalAmount || subtotal - promoDiscount + shipping + tax + donationAmount;

    // Calculate actual amount (price * qty)
    const actualAmount = selectedOrder.items?.reduce((acc, item) => {
        return acc + (item.pricePerItem * item.quantity);
    }, 0) || subtotal;


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
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
                            Invoice No: <b>{selectedOrder.invoiceNumber || "No Invoice Number"}</b>
                        </p>
                        <p className="text-sm text-gray-500">Order Number: {selectedOrder.orderNumber}</p>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        Order Status: {selectedOrder.status}
                    </span>
                </div>

                {/* Customer / Billing / Shipping / Payment */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    {/* Customer */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Customer</h3>
                        <p className="font-medium">{selectedOrder.shippingName}</p>
                        <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
                    </div>
                    {/* Billing */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Billing Address</h3>
                        <p>{selectedOrder.billingAddress}</p>
                        <p>{selectedOrder.billingCity}, {selectedOrder.billingState}</p>
                        <p>{selectedOrder.billingPincode}</p>
                    </div>
                    {/* Shipping */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Shipping Address</h3>
                        <p>{selectedOrder.shippingAddress}</p>
                        <p>{selectedOrder.shippingCity}, {selectedOrder.shippingState}</p>
                        <p>{selectedOrder.shippingPincode}</p>
                    </div>
                    {/* Payment */}
                    <div className="p-4 border rounded-xl bg-gray-50">
                        <h3 className="font-semibold mb-1 text-gray-700">Payment</h3>
                        <p className="font-medium">Method: {selectedOrder.paymentMethod}</p>
                        <p className="text-green-700 font-medium">Status: {selectedOrder.paymentStatus}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm shadow-md">
                        <thead className="bg-gray-900 text-xs text-gray-100 uppercase">
                            <tr>
                                <th className="p-2 text-center">#</th>
                                <th className="p-2 text-center">Image</th>
                                <th className="p-2 text-center">Product</th>
                                <th className="p-2 text-center">Variation</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-center">Rate</th>
                                <th className="p-2 text-center">Offer</th>
                                <th className="p-2 text-center">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.items?.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="p-2 text-center">{idx + 1}</td>
                                    <td className="p-2 flex justify-center">
                                        <img
                                            src={item.image}
                                            alt={item.attributes?.color || "Product Image"}
                                            className="w-16 h-16 rounded-lg object-cover shadow"
                                        />
                                    </td>
                                    <td className="p-2 text-center">{item.productName}</td>
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

                                    <td className="p-2 text-center font-bold">₹{item.totalPrice}</td>
                                </tr>
                            ))}

                            {/* Subtotal */}
                            {/* <tr className="bg-gray-200 font-semibold">
                                <td colSpan={7} className="p-3 text-left">Subtotal</td>
                                <td className="p-3 text-center">₹{subtotal}</td>
                            </tr> */}
                            {/* SUBTOTAL */}
                            <tr className="bg-gray-200 font-semibold">
                                <td colSpan={7} className="p-3 text-left">Subtotal</td>
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
                                    <td colSpan={7} className="p-3 text-left">
                                        Promo Applied: {promoCodeName} (-₹{promoDiscount})
                                    </td>
                                    <td className="p-3 text-center">-₹{promoDiscount}</td>
                                </tr>
                            )}

                            {/* Donation */}
                            {donationAmount > 0 && (
                                <tr className="bg-yellow-100 font-semibold">
                                    <td colSpan={7} className="p-3 text-left">Donation</td>
                                    <td className="p-3 text-center">₹{donationAmount}</td>
                                </tr>
                            )}

                            {/* Shipping */}
                            <tr className="bg-gray-100 font-medium">
                                <td colSpan={7} className="p-3 text-left">Shipping Charges</td>
                                <td className="p-3 text-center">₹{shipping}</td>
                            </tr>

                            {/* Tax */}
                            {tax > 0 && (
                                <tr className="bg-gray-100 font-medium">
                                    <td colSpan={7} className="p-3 text-left">Tax</td>
                                    <td className="p-3 text-center">₹{tax}</td>
                                </tr>
                            )}

                            {/* Grand Total */}
                            <tr className="bg-gray-300 font-bold">
                                <td colSpan={7} className="p-3 text-left text-lg">Grand Total</td>
                                <td className="p-3 text-center text-lg">₹{grandTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Notes */}
                {selectedOrder.note && (
                    <div className="border-t px-4 py-3 font-semibold text-lg bg-gray-50 mt-6">
                        Notes / Info
                        <p className="text-sm font-normal mt-2">{selectedOrder.note}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
