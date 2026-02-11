"use client";
import { useState, useEffect } from "react";
import { FiX, FiPrinter } from "react-icons/fi";
// import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
// import JsBarcode from "jsbarcode";
// import dynamic from "next/dynamic";

// const styles = StyleSheet.create({
//     page: {
//         width: 595,
//         height: 842,
//         paddingTop: 15,
//         paddingLeft: 11,
//         paddingRight: 11,
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "flex-start",
//     },
//     labelsContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "flex-start",
//         gap: 7,
//     },
//     label: {
//         width: 180,
//         height: 128,
//         padding: 8,
//         marginRight: 5,
//         marginBottom: 3,
//         flexDirection: "column",
//         justifyContent: "flex-start",
//         alignItems: "center",
//     },
//     productName: { fontWeight: 'bold', fontSize: 11, textAlign: 'center' },
//     variation: { fontSize: 9, color: '#555', textAlign: 'center', lineHeight: 1.2, maxWidth: 170 },
//     price: { fontSize: 9, marginTop: 2 },
//     barcode: { marginTop: 2, width: 130, height: 40 },
//     fnsku: { marginTop: 2, fontSize: 10, textAlign: "center", lineHeight: 1.0 },
// });

// const LabelsPDF = ({ items, barcodes }) => {
//     const flatLabels = [];
//     items.forEach(item => {
//         item.colors?.forEach(c => {
//             for (let i = 0; i < (c.units || c.quantity || 1); i++) {
//                 flatLabels.push({ ...item, colorObj: c });
//             }
//         });
//     });

//     const pages = [];
//     const maxLabelsPerPage = 18;
//     for (let i = 0; i < flatLabels.length; i += maxLabelsPerPage) {
//         pages.push(flatLabels.slice(i, i + maxLabelsPerPage));
//     }

//     return (
//         <Document>
//             {pages.map((pageEntries, idx) => (
//                 <Page size="A4" style={styles.page} key={idx}>
//                     <View style={styles.labelsContainer}>
//                         {pageEntries.map((entry, i) => (
//                             <View key={`${entry.colorObj.FNSKU}-${i}`} style={styles.label}>
//                                 <Text style={styles.productName}>{entry.productName}</Text>
//                                 {entry.colorObj.color && <Text style={styles.variation}>{entry.colorObj.color}</Text>}
//                                 <Text style={styles.price}>MRP: ₹{entry.colorObj.pricePerItem}</Text>
//                                 {barcodes[entry.colorObj.FNSKU] && <Image src={barcodes[entry.colorObj.FNSKU]} style={styles.barcode} />}
//                                 <Text style={styles.fnsku}>{entry.colorObj.FNSKU}</Text>
//                             </View>
//                         ))}
//                     </View>
//                 </Page>
//             ))}
//         </Document>
//     );
// };

export default function EditOrderModal({ order, isOpen, onClose, onUpdateStatus }) {
    const [status, setStatus] = useState(order?.status || "");
    const [trackingLink, setTrackingLink] = useState(order?.trackingLink || "");

    // const [barcodeMap, setBarcodeMap] = useState({});

    // const PDFDownloadLinkNoSSR = dynamic(
    //     () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
    //     { ssr: false }
    // );

    console.log("orderEdit", order)

    // useEffect(() => {
    //     if (!order) return;

    //     const map = {};
    //     order.items?.forEach(item => {
    //         const canvas = document.createElement("canvas");
    //         JsBarcode(canvas, item.barCode, {
    //             format: "CODE128",
    //             displayValue: false,
    //             width: 2,
    //             height: 50,
    //         });
    //         map[item.barCode || item.productName] = canvas.toDataURL("image/png");

    //     });
    //     setBarcodeMap(map);
    // }, [order]);

    if (!isOpen || !order) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
                >
                    <FiX />
                </button>

                {/* Modal Header */}
                <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Edit Order #{order.orderNumber}</h2>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto rounded-xl shadow-sm border">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                            <tr>
                                <th className="p-3 border text-center">S.No</th>
                                <th className="p-3 border text-center">Image</th>
                                <th className="p-3 border text-center">Product</th>
                                <th className="p-3 border text-center">Qty</th>
                                <th className="p-3 border text-center">Price</th>
                                <th className="p-3 border text-center">Total</th>
                                <th className="p-3 border text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {order.items?.map((item, idx) => (
                                <tr key={item.itemId} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 text-center">{idx + 1}</td>

                                    <td className="p-3 text-center">
                                        <img
                                            src={item.image}
                                            alt="item"
                                            className="w-16 h-16 object-cover rounded-md mx-auto"
                                        />
                                    </td>

                                    <td className="p-3 text-center">
                                        {item.productName}
                                        {item.attributes && (
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(item.attributes).map(([k, v]) => (
                                                    <div key={k}>{k}: {v}</div>
                                                ))}
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-center">₹{item.pricePerItem}</td>
                                    <td className="p-3 text-center font-bold">₹{item.totalPrice}</td>

                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold 
        ${order.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {/* Status Change + Print */}
                {/* <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 flex-wrap">

                
                   PDFDownloadLinkNoSSR
                        document={<LabelsPDF items={order.items} barcodes={barcodeMap} />}
                        fileName={`Dispatch_${order.orderNumber}_Labels.pdf`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 justify-center cursor-pointer"
                    >
                        {({ loading }) => (loading ? "Generating PDF..." : <><FiPrinter /> Print Labels</>)}
                    </PDFDownloadLinkNoSSR> 


                   
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <label className="font-semibold text-gray-700">Order Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">FAILED</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="REFUND">Refund</option>
                        </select>
                        <button
                            onClick={() => onUpdateStatus(order.id, status)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
                        >
                            Update Status
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Enter Tracking Link"
                        value={trackingLink}
                        onChange={(e) => setTrackingLink(e.target.value)}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64 justify-end"
                    />

                 
                    <button
                        onClick={() => onUpdateStatus(order.id, status, trackingLink)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                    >
                        Save Tracking
                    </button>

                </div> */}


                <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">

                    {/* LEFT SIDE - Status Section */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <label className="font-semibold text-gray-700 whitespace-nowrap">
                            Order Status:
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">FAILED</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="REFUND">Refund</option>
                        </select>

                        {/* <button
                            onClick={() => onUpdateStatus(order.id, status)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
                        >
                            Update Status
                        </button> */}
                    </div>

                    {/* RIGHT SIDE - Tracking Section */}
                    <div className="flex items-center gap-3 ml-auto">
                        <input
                            type="text"
                            placeholder="Enter Tracking Link"
                            value={trackingLink}
                            onChange={(e) => setTrackingLink(e.target.value)}
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                        />

                        <button
                            onClick={() => onUpdateStatus(order.id, status, trackingLink)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                        >
                            Update
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
