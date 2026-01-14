// import React, { useState } from "react";
// import { Eye } from "lucide-react";

// const CompletedTab = ({ dispatches, warehouses }) => {
//     const [modalData, setModalData] = useState(null);

//     // resolve warehouse name
//     const getWarehouseInfo = (id) => {
//         const w = warehouses.find((x) => x.id.toString() === id.toString());
//         return w ? `${w.code} - ${w.address}` : "Unknown";
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">

//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
//                 Completed Dispatches
//             </h1>

//             {/* Main Table */}
//             <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
//                 <table className="w-full text-left text-sm">
//                     <thead className="bg-gray-100 text-gray-700 text-sm">
//                         <tr>
//                             <th className="p-3">Dispatch ID</th>
//                             <th className="p-3">Shipping ID</th>
//                             <th className="p-3">Image</th>
//                             <th className="p-3">Product Name</th>
//                             <th className="p-3">Variation Name</th>
//                             <th className="p-3">Warehouse</th>
//                             <th className="p-3">Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {dispatches
//                             .filter((d) => d.status === "completed")
//                             .map((item) => (
//                                 <tr
//                                     key={item.id}
//                                     className="border-b hover:bg-gray-50 transition"
//                                 >
//                                     {/* Dispatch ID */}
//                                     <td className="p-3 font-semibold text-gray-700">
//                                         #{item.id}
//                                     </td>

//                                     {/* Shipping ID */}
//                                     <td className="p-3">{item.shippingId || "—"}</td>

//                                     {/* Image */}
//                                     <td className="p-2">
//                                         <img
//                                             src={item.entries[0]?.image}
//                                             className="w-14 h-14 rounded object-cover border"
//                                             alt=""
//                                         />
//                                     </td>

//                                     {/* Product Name */}
//                                     <td className="p-3 font-medium text-gray-700">
//                                         {item.entries[0]?.productName}
//                                     </td>

//                                     {/* Variation */}
//                                     <td className="p-3 text-gray-600">
//                                         {item.entries[0]?.variationName || "—"}
//                                     </td>

//                                     {/* Created At */}
//                                     {/* <td className="p-3">
//                                         {new Date(item.createdAt).toLocaleString()}
//                                     </td> */}

//                                     <td className="p-3">
//                                         {Array.from(new Set(item.entries.map(e => e.entries[0].warehouseId)))
//                                             .map((wid) => {
//                                                 const warehouse = warehouses.find(w => w.id.toString() === wid.toString());
//                                                 if (!warehouse) return null;
//                                                 return (
//                                                     <div key={wid} className="text-sm font-medium text-gray-700">
//                                                         {warehouse.code} - {warehouse.state}
//                                                     </div>
//                                                 );
//                                             })}
//                                     </td>

//                                     {/* View Button */}
//                                     <td className="p-3">
//                                         <button
//                                             onClick={() => setModalData(item)}
//                                             className="flex items-center gap-1 px-3 py-1 bg-gray-700 
//                                 text-white rounded-lg hover:bg-gray-800 text-xs cursor-pointer"
//                                         >
//                                             <Eye size={14} /> View
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                     </tbody>
//                 </table>
//             </div>


//             {/* View Modal */}
//             {modalData && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-6">

//                         {/* Close Button */}
//                         <button
//                             className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
//                             onClick={() => setModalData(null)}
//                         >
//                             ✕
//                         </button>

//                         {/* HEADER */}
//                         <div className="mb-6 border-b pb-4">
//                             <h2 className="text-3xl font-bold text-gray-900">
//                                 Dispatch #{modalData.id}
//                             </h2>
//                             <p className="text-gray-500">Completed Dispatch Details</p>
//                         </div>

//                         {/* BASIC INFO */}
//                         <div className="grid md:grid-cols-2 gap-4 mb-8">
//                             <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
//                                 <h4 className="text-lg font-semibold mb-3 text-gray-800">Shipping Info</h4>
//                                 <p><span className="font-medium">Shipping ID:</span> {modalData.shippingId || "Not Added"}</p>
//                                 <p><span className="font-medium">Tracking ID:</span> {modalData.trackingId || "—"}</p>
//                                 <p>
//                                     <span className="font-medium">Tracking Link:</span>{" "}
//                                     {modalData.trackingLink ? (
//                                         <a href={modalData.trackingLink} target="_blank"
//                                             className="text-blue-600 underline font-medium">
//                                             Open Link
//                                         </a>
//                                     ) : "—"}
//                                 </p>
//                             </div>

//                             <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
//                                 <h4 className="text-lg font-semibold mb-3 text-gray-800">Status & Timestamps</h4>
//                                 <p><span className="font-medium">Created:</span> {new Date(modalData.createdAt).toLocaleString()}</p>
//                                 <p><span className="font-medium">Updated:</span> {new Date(modalData.updatedAt).toLocaleString()}</p>
//                                 <p>
//                                     <span className="font-medium">Status:</span>{" "}
//                                     <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
//                                         {modalData.status}
//                                     </span>
//                                 </p>
//                             </div>
//                         </div>

//                         {/* TOTALS SECTION */}
//                         <h3 className="text-xl font-bold mb-3 text-gray-900">Totals</h3>
//                         <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">

//                             {/* Card */}
//                             <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-gray-500 text-sm">Total Boxes</p>
//                                 <p className="text-2xl font-bold">
//                                     {modalData.dimensions.reduce((a, b) => a + (b.boxes || 0), 0)}
//                                 </p>
//                             </div>

//                             <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-gray-500 text-sm">Total Weight</p>
//                                 <p className="text-2xl font-bold">
//                                     {modalData.dimensions.reduce((a, b) => a + (b.weight || 0), 0)} kg
//                                 </p>
//                             </div>

//                             <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-gray-500 text-sm">Total Volume</p>
//                                 <p className="text-2xl font-bold">
//                                     {modalData.dimensions
//                                         .reduce(
//                                             (sum, row) =>
//                                                 sum + parseFloat(((row.length * row.breadth * row.height) / 5000).toFixed(2)),
//                                             0
//                                         )
//                                         .toFixed(2)}
//                                     {" "}kg
//                                 </p>
//                             </div>

//                             <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-gray-500 text-sm">Total Units</p>
//                                 <p className="text-2xl font-bold">{modalData.totalUnits}</p>
//                             </div>

//                             <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
//                                 <p className="text-gray-500 text-sm">Total FNSKU</p>
//                                 <p className="text-2xl font-bold">{modalData.totalFNSKU}</p>
//                             </div>

//                         </div>

//                         {/* WAREHOUSES */}
//                         <h3 className="text-xl font-bold mb-3 text-gray-900">Warehouses</h3>
//                         <div className="flex flex-wrap gap-3 mb-10">
//                             {Array.from(new Set(modalData.entries.map(e => e.entries[0].warehouseId))).map((wid) => (
//                                 <span
//                                     key={wid}
//                                     className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm shadow"
//                                 >
//                                     {getWarehouseInfo(wid)}
//                                 </span>
//                             ))}
//                         </div>

//                         {/* DIMENSIONS */}
//                         <h3 className="text-xl font-bold mb-3 text-gray-900">Dimensions</h3>
//                         <div className="overflow-x-auto mb-10">
//                             <table className="w-full text-sm border rounded-xl overflow-hidden">
//                                 <thead className="bg-gray-100 border-b">
//                                     <tr>
//                                         <th className="p-3">Boxes</th>
//                                         <th className="p-3">Weight</th>
//                                         <th className="p-3">Length</th>
//                                         <th className="p-3">Breadth</th>
//                                         <th className="p-3">Height</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {modalData.dimensions?.map((dim, i) => (
//                                         <tr key={i} className="border-b hover:bg-gray-50 text-center">
//                                             <td className="p-3">{dim.boxes}</td>
//                                             <td className="p-3">{dim.weight}</td>
//                                             <td className="p-3">{dim.length}</td>
//                                             <td className="p-3">{dim.breadth}</td>
//                                             <td className="p-3">{dim.height}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* PRODUCTS */}
//                         <h3 className="text-xl font-bold mb-3 text-gray-900">Products</h3>
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left text-sm border rounded-xl overflow-hidden">
//                                 <thead className="bg-gray-100 border-b">
//                                     <tr>
//                                         <th className="p-3">Product</th>
//                                         <th className="p-3">Variation</th>
//                                         <th className="p-3">FNSKU</th>
//                                         <th className="p-3">Price</th>
//                                         <th className="p-3">MRP</th>
//                                         <th className="p-3">Units</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {modalData.entries.map((p, idx) => (
//                                         <tr key={idx} className="border-b hover:bg-gray-50">
//                                             <td className="p-3 flex items-center gap-3">
//                                                 <img src={p.image} className="w-14 h-14 rounded-xl object-cover border shadow-sm" />
//                                                 <p className="font-semibold text-gray-800">{p.productName}</p>
//                                             </td>

//                                             <td className="p-3">{p.variationName}</td>
//                                             <td className="p-3">{p.FNSKU}</td>
//                                             <td className="p-3 font-medium">₹{p.price}</td>
//                                             <td className="p-3">₹{p.MRP}</td>
//                                             <td className="p-3 font-semibold">{p.entries[0].units}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* FOOTER */}
//                         <div className="flex justify-end mt-8">
//                             <button
//                                 onClick={() => setModalData(null)}
//                                 className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black shadow"
//                             >
//                                 Close
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             )}



//         </div>
//     );
// };

// export default CompletedTab;



"use client";
import React, { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import Pagination from "@/components/Pagination";

const CompletedTab = ({ dispatches, warehouses }) => {
    const [modalData, setModalData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 7;
    // resolve warehouse info
    const getWarehouseInfo = (id) => {
        const w = warehouses.find((x) => x.id.toString() === id.toString());
        return w ? `${w.code} - ${w.address}` : "Unknown";
    };

    // filter warehouses by state
    const filteredWarehousesByState = useMemo(() => {
        return selectedState
            ? warehouses.filter((w) => w.state === selectedState)
            : warehouses;
    }, [selectedState, warehouses]);

    // filtered dispatches based on search, state, and warehouse
    const filteredDispatches = useMemo(() => {
        let result = dispatches.filter((d) => d.status === "completed");

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter((d) => {
                const matchesDispatchID = d.id.toString().includes(term);
                const matchesShippingID = (d.shippingId || "").toLowerCase().includes(term);
                const matchesVariation = d.entries.some((e) =>
                    (e.variationName || "").toLowerCase().includes(term)
                );
                const matchesFNSKU = d.entries.some((e) =>
                    (e.FNSKU || "").toLowerCase().includes(term)
                );
                return matchesDispatchID || matchesShippingID || matchesVariation || matchesFNSKU;
            });
        }

        if (selectedState) {
            result = result.filter((d) =>
                d.entries.some((e) =>
                    e.entries[0]?.warehouseId
                        ? warehouses.find((w) => w.id.toString() === e.entries[0].warehouseId.toString())?.state === selectedState
                        : false
                )
            );
        }

        if (selectedWarehouse) {
            result = result.filter((d) =>
                d.entries.some((e) =>
                    e.entries[0]?.warehouseId.toString() === selectedWarehouse.toString()
                )
            );
        }

        return result;
    }, [dispatches, searchTerm, selectedState, selectedWarehouse, warehouses]);

    const totalPages = Math.ceil(filteredDispatches.length / productsPerPage);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProduct = filteredDispatches.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // unique states for dropdown
    const states = useMemo(() => {
        return Array.from(new Set(warehouses.map((w) => w.state)));
    }, [warehouses]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
                Completed Dispatches
            </h1>

            {/* SEARCH + FILTERS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Dispatch ID, Shipping ID, Variation, FNSKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={selectedState}
                    onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedWarehouse(""); // reset warehouse on state change
                    }}
                    className="p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select State</option>
                    {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedState}
                >
                    <option value="">Select Warehouse</option>
                    {filteredWarehousesByState.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.code} - {w.address}
                        </option>
                    ))}
                </select>
            </div>

            {/* MAIN TABLE */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Dispatch ID</th>
                            <th className="p-3">Shipping ID</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3">Updated At</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Warehouse</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentProduct.map((item, idx) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4  font-medium">{indexOfFirstProduct + idx + 1}.</td>
                                <td className="p-3 font-semibold text-gray-700">#{item.id}</td>
                                <td className="p-3">{item.shippingId || "—"}</td>
                                {/* <td className="p-2">
                                    <img
                                        src={item.entries[0]?.image}
                                        className="w-14 h-14 rounded object-cover border"
                                        alt=""
                                    />
                                </td>
                                <td className="p-3 font-medium text-gray-700">{item.entries[0]?.productName}</td>
                                <td className="p-3 text-gray-600">{item.entries[0]?.variationName || "—"}</td> */}
                                <td className="p-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                                <td className="p-3 text-gray-600">{new Date(item.updatedAt).toLocaleString()}</td>
                                <td className="p-3 text-gray-600">{item.status}</td>
                                <td className="p-3">
                                    {Array.from(new Set(item.entries.map(e => e.entries[0]?.warehouseId)))
                                        .map((wid) => {
                                            const warehouse = warehouses.find(w => w.id.toString() === wid?.toString());
                                            if (!warehouse) return null;
                                            return (
                                                <div key={wid} className="text-sm font-medium text-gray-700">
                                                    {warehouse.code} - {warehouse.state}
                                                </div>
                                            );
                                        })}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setModalData(item)}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-xs cursor-pointer"
                                    >
                                        <Eye size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentProduct.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No dispatches found</div>
                )}
            </div>

            {/* VIEW MODAL */}
            {/* {modalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-6">

                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                            onClick={() => setModalData(null)}
                        >
                            ✕
                        </button>

                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Dispatch #{modalData.id}
                            </h2>
                            <p className="text-gray-500">Completed Dispatch Details</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
                                <h4 className="text-lg font-semibold mb-3 text-gray-800">Shipping Info</h4>
                                <p><span className="font-medium">Shipping ID:</span> {modalData.shippingId || "Not Added"}</p>
                                <p><span className="font-medium">Tracking ID:</span> {modalData.trackingId || "—"}</p>
                                <p>
                                    <span className="font-medium">Tracking Link:</span>{" "}
                                    {modalData.trackingLink ? (
                                        <a href={modalData.trackingLink} target="_blank"
                                            className="text-blue-600 underline font-medium">
                                            Open Link
                                        </a>
                                    ) : "—"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
                                <h4 className="text-lg font-semibold mb-3 text-gray-800">Status & Timestamps</h4>
                                <p><span className="font-medium">Created:</span> {new Date(modalData.createdAt).toLocaleString()}</p>
                                <p><span className="font-medium">Updated:</span> {new Date(modalData.updatedAt).toLocaleString()}</p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                                        {modalData.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-900">Totals</h3>
                        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">

                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                <p className="text-gray-500 text-sm">Total Boxes</p>
                                <p className="text-2xl font-bold">
                                    {modalData.dimensions.reduce((a, b) => a + (b.boxes || 0), 0)}
                                </p>
                            </div>

                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                <p className="text-gray-500 text-sm">Total Weight</p>
                                <p className="text-2xl font-bold">
                                    {modalData.dimensions.reduce((a, b) => a + (b.weight || 0), 0)} kg
                                </p>
                            </div>

                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                <p className="text-gray-500 text-sm">Total Volume</p>
                                <p className="text-2xl font-bold">
                                    {modalData.dimensions
                                        .reduce(
                                            (sum, row) =>
                                                sum + parseFloat(((row.length * row.breadth * row.height) / 5000).toFixed(2)),
                                            0
                                        )
                                        .toFixed(2)}
                                    {" "}kg
                                </p>
                            </div>

                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                <p className="text-gray-500 text-sm">Total Units</p>
                                <p className="text-2xl font-bold">{modalData.totalUnits}</p>
                            </div>

                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                <p className="text-gray-500 text-sm">Total FNSKU</p>
                                <p className="text-2xl font-bold">{modalData.totalFNSKU}</p>
                            </div>

                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-900">Warehouses</h3>
                        <div className="flex flex-wrap gap-3 mb-10">
                            {Array.from(new Set(modalData.entries.map(e => e.entries[0].warehouseId))).map((wid) => (
                                <span
                                    key={wid}
                                    className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm shadow"
                                >
                                    {getWarehouseInfo(wid)}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-900">Dimensions</h3>
                        <div className="overflow-x-auto mb-10">
                            <table className="w-full text-sm border rounded-xl overflow-hidden">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3">Boxes</th>
                                        <th className="p-3">Weight</th>
                                        <th className="p-3">Length</th>
                                        <th className="p-3">Breadth</th>
                                        <th className="p-3">Height</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.dimensions?.map((dim, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50 text-center">
                                            <td className="p-3">{dim.boxes}</td>
                                            <td className="p-3">{dim.weight}</td>
                                            <td className="p-3">{dim.length}</td>
                                            <td className="p-3">{dim.breadth}</td>
                                            <td className="p-3">{dim.height}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-900">Products</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border rounded-xl overflow-hidden">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-3">Product</th>
                                        <th className="p-3">Variation</th>
                                        <th className="p-3">FNSKU</th>
                                        <th className="p-3">Price</th>
                                        <th className="p-3">MRP</th>
                                        <th className="p-3">Units</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {modalData.entries.map((p, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="p-3 flex items-center gap-3">
                                                <img src={p.image} className="w-14 h-14 rounded-xl object-cover border shadow-sm" />
                                                <p className="font-semibold text-gray-800">{p.productName}</p>
                                            </td>

                                            <td className="p-3">{p.variationName}</td>
                                            <td className="p-3">{p.FNSKU}</td>
                                            <td className="p-3 font-medium">₹{p.price}</td>
                                            <td className="p-3">₹{p.MRP}</td>
                                            <td className="p-3 font-semibold">{p.entries[0].units}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setModalData(null)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black shadow"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )} */}
            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            {modalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-6">

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                            onClick={() => setModalData(null)}
                        >
                            ✕
                        </button>

                        {/* HEADER */}
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Dispatch #{modalData.id}
                            </h2>
                            <p className="text-gray-500">Completed Dispatch Details</p>
                        </div>

                        {/* Tabs */}
                        <div>
                            <div className="flex border-b border-gray-200 mb-4">
                                {["Shipping & Status", "Details & Totals", "Products"].map((tab, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`px-4 py-2 font-medium -mb-px border-b-2 transition ${activeTab === index
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Panels */}
                            <div>
                                {/* TAB 1: Shipping & Status */}
                                {activeTab === 0 && (
                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
                                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Shipping Info</h4>
                                            <p><span className="font-medium">Shipping ID:</span> {modalData.shippingId || "Not Added"}</p>
                                            <p><span className="font-medium">Tracking ID:</span> {modalData.trackingId || "—"}</p>
                                            <p>
                                                <span className="font-medium">Tracking Link:</span>{" "}
                                                {modalData.trackingLink ? (
                                                    <a href={modalData.trackingLink} target="_blank" className="text-blue-600 underline font-medium">
                                                        Open Link
                                                    </a>
                                                ) : "—"}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-5 rounded-xl border shadow-sm">
                                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Status & Timestamps</h4>
                                            <p><span className="font-medium">Created:</span> {new Date(modalData.createdAt).toLocaleString()}</p>
                                            <p><span className="font-medium">Updated:</span> {new Date(modalData.updatedAt).toLocaleString()}</p>
                                            <p>
                                                <span className="font-medium">Status:</span>{" "}
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${modalData.status === "dispatched" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {modalData.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: Details & Totals */}
                                {activeTab === 1 && (
                                    <>
                                        {/* Warehouses */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">Warehouses</h3>
                                            <div className="flex flex-wrap gap-3 mb-6">
                                                {Array.from(new Set(modalData.entries.map(e => e.entries[0].warehouseId))).map((wid) => (
                                                    <span key={wid} className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm shadow">
                                                        {getWarehouseInfo(wid)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dimensions */}
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">Dimensions</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm border rounded-xl overflow-hidden">
                                                    <thead className="bg-gray-100 border-b">
                                                        <tr className="text-center">
                                                            <th className="p-3">S.No</th>
                                                            <th className="p-3">Boxes</th>
                                                            <th className="p-3">Weight</th>
                                                            <th className="p-3">Length</th>
                                                            <th className="p-3">Breadth</th>
                                                            <th className="p-3">Height</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {modalData.dimensions?.map((dim, i) => (
                                                            <tr key={i} className="border-b hover:bg-gray-50 text-center">
                                                                <td className="p-3">{i + 1}</td>
                                                                <td className="p-3">{dim.boxes}</td>
                                                                <td className="p-3">{dim.weight}</td>
                                                                <td className="p-3">{dim.length}</td>
                                                                <td className="p-3">{dim.breadth}</td>
                                                                <td className="p-3">{dim.height}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Totals */}
                                        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                                <p className="text-gray-500 text-sm">Total Boxes</p>
                                                <p className="text-2xl font-bold">{modalData.dimensions.reduce((a, b) => a + (b.boxes || 0), 0)}</p>
                                            </div>
                                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                                <p className="text-gray-500 text-sm">Total Weight</p>
                                                <p className="text-2xl font-bold">{modalData.dimensions.reduce((a, b) => a + (b.weight || 0), 0)} kg</p>
                                            </div>
                                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                                <p className="text-gray-500 text-sm">Total Volume</p>
                                                <p className="text-2xl font-bold">
                                                    {modalData.dimensions
                                                        .reduce((sum, row) => sum + parseFloat(((row.length * row.breadth * row.height) / 5000).toFixed(2)), 0)
                                                        .toFixed(2)} kg
                                                </p>
                                            </div>
                                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                                <p className="text-gray-500 text-sm">Total Units</p>
                                                <p className="text-2xl font-bold">{modalData.totalUnits}</p>
                                            </div>
                                            <div className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition">
                                                <p className="text-gray-500 text-sm">Total FNSKU</p>
                                                <p className="text-2xl font-bold">{modalData.totalFNSKU}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* TAB 3: Products */}
                                {activeTab === 2 && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border rounded-xl overflow-hidden">
                                            <thead className="bg-gray-100 border-b">
                                                <tr>
                                                    <th className="p-3">S.No</th>
                                                    <th className="p-3">Product</th>
                                                    <th className="p-3">Variation</th>
                                                    <th className="p-3">FNSKU</th>
                                                    <th className="p-3">Price</th>
                                                    <th className="p-3">MRP</th>
                                                    <th className="p-3">Units</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalData.entries.map((p, idx) => (
                                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                                        <td className="p-3">{idx + 1}</td>
                                                        <td className="p-3 flex items-center gap-3">
                                                            <img src={p.image} className="w-14 h-14 rounded-xl object-cover border shadow-sm" />
                                                            <p className="font-semibold text-gray-800">{p.productName}</p>
                                                        </td>
                                                        <td className="p-3">{p.variationName}</td>
                                                        <td className="p-3">{p.FNSKU}</td>
                                                        <td className="p-3 font-medium">₹{p.price}</td>
                                                        <td className="p-3">₹{p.MRP}</td>
                                                        <td className="p-3 font-semibold">{p.entries[0].units}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setModalData(null)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black shadow"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div >
    );
};

export default CompletedTab;
