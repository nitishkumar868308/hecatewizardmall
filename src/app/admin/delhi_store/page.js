"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelhiStore, updateDelhiStore } from "@/app/redux/slices/delhiStore/delhiStoreSlice";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchWarehouses } from "@/app/redux/slices/warehouse/wareHouseSlice";
import toast from 'react-hot-toast';

const DelhiStorePage = () => {
    const dispatch = useDispatch();
    const { store, loading } = useSelector((state) => state.delhiStore);
    const { warehouses } = useSelector((state) => state.warehouses);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [search, setSearch] = useState("");
    const [modalData, setModalData] = useState(null);
    const [updateData, setUpdateData] = useState(null);
    const [newStock, setNewStock] = useState("");

    console.log("store ", store)
    useEffect(() => {
        dispatch(fetchWarehouses())
        dispatch(fetchDelhiStore());
    }, [dispatch]);
    console.log("warehouses", warehouses)

    // Flatten all products with units & warehouse from nested entries
    const allProducts = store.flatMap((item) =>
        item.productsSnapshot?.entries.flatMap((prod) =>
            prod.entries?.map((entry) => ({
                rowId: item.id, 
                id: prod.id,
                variationId: prod.variationId,
                productName: prod.productName,
                variationName: prod.variationName,
                FNSKU: prod.FNSKU,
                price: prod.price || prod.MRP,
                units: entry.units,
                warehouseId: entry.warehouseId,
                image: prod.image,
                dimensions: prod.dimensions,
            })) || []
        ) || []
    );
    console.log("allProducts", allProducts)

    const filteredProducts = allProducts.filter((prod) => {
        // Search match
        const matchesSearch =
            prod.productName?.toLowerCase().includes(search.toLowerCase()) ||
            prod.variationName?.toLowerCase().includes(search.toLowerCase()) ||
            prod.FNSKU?.toLowerCase().includes(search.toLowerCase());

        // Find warehouse for this entry
        const warehouse = warehouses.find((w) => w.id.toString() === prod.warehouseId.toString());

        // Check if warehouse state is Delhi
        const matchesState = warehouse?.state === "Delhi" || true; // default true to show all if state not yet loaded

        // Optional: Filter by selected warehouse from dropdown
        const matchesSelectedWarehouse = selectedWarehouse
            ? prod.warehouseId === selectedWarehouse
            : true;

        return matchesSearch && matchesState && matchesSelectedWarehouse;
    });

    console.log("filteredProducts", filteredProducts)

    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between bg-gray-50 p-3 rounded-lg border">
            <span className="font-semibold">{label}</span>
            <span className="text-gray-800">{value || "—"}</span>
        </div>
    );


    const updatStock = async () => {
        // if (updateData?.rowId === undefined || newStock === "") {
        //     toast.error("Please enter stock");
        //     return;
        // }

        console.log("newStock", newStock);
        console.log("updateData", updateData);
        
        await dispatch(updateDelhiStore({
            id: Number(updateData.rowId),   // ✅ table row id
            productId: updateData.productId,
            variationId: updateData.variationId,
            warehouseId: updateData.warehouseId,
            units: Number(newStock)
        }));

        toast.success("Stock updated!");
        setNewStock("");
        setUpdateData(null);
    };



    return (
        <DefaultPageAdmin>
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    Delhi Fullfillment Store
                </h1>

                {warehouses.length > 0 && (
                    <div className="mb-6 text-gray-700">
                        {warehouses
                            .filter((w) => w.name.toLowerCase().includes("delhi"))
                            .map((w) => (
                                <p key={w.id}>
                                    <span className="font-semibold">{w.code}</span> - {w.address}
                                </p>
                            ))
                        }
                    </div>
                )}


                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search Product Name, Variation, FNSKU"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
                    />

                    {/* Dropdown for Warehouses */}
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses
                            .filter((wh) => {
                                // Fulfillment warehouse ko dhundo
                                const fulfillment = warehouses.find(fw => fw.id === wh.fulfillmentWarehouseId);
                                return fulfillment?.state === "Delhi";
                            })
                            .map((wh) => (
                                <option key={wh.id} value={wh.id}>
                                    {wh.name} - {wh.address}
                                </option>
                            ))}
                    </select>

                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="p-3">S.no</th>
                                <th className="p-3">Image</th>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Variation</th>
                                <th className="p-3">FNSKU</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Stock Sold</th>
                                <th className="p-3">Warehouse</th>
                                <th className="p-3">Snapshot</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-4 text-gray-500">
                                        No Data found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((prod, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3 font-medium">{idx + 1 || "—"}</td>
                                        <td className="p-2">
                                            <img
                                                src={prod.image || "/placeholder.png"}
                                                alt={prod.productName}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        </td>
                                        <td className="p-3 font-medium">{prod.productName || "—"}</td>
                                        <td className="p-3 text-gray-600">{prod.variationName || "—"}</td>
                                        <td className="p-3">{prod.FNSKU || "—"}</td>
                                        <td className="p-3">{prod.price || "—"}</td>
                                        <td className="p-3">{prod.units || "—"}</td>
                                        <td className="p-3">{prod.unitsSold || 0}</td>
                                        <td className="p-3">
                                            {warehouses.find((w) => w.id.toString() === prod.warehouseId.toString())?.code || "—"}
                                        </td>

                                        <td className="p-3">
                                            <button
                                                onClick={() => setModalData(prod)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody> */}
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center p-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center p-4 text-gray-500">
                                        No Data found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((prod, idx) => {
                                    const warehouse = warehouses.find(
                                        (w) => w.id.toString() === prod.warehouseId.toString()
                                    );
                                    return (
                                        <tr
                                            key={idx}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="p-3 font-medium">{idx + 1 || "—"}</td>

                                            <td className="p-2">
                                                <img
                                                    src={prod.image || "/placeholder.png"}
                                                    alt={prod.productName}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            </td>

                                            <td className="p-3 font-medium">{prod.productName || "—"}</td>
                                            <td className="p-3 text-gray-600">{prod.variationName || "—"}</td>
                                            <td className="p-3">{prod.FNSKU || "—"}</td>
                                            <td className="p-3">{prod.price || "—"}</td>

                                            {/* 🟡 Low Stock Warning */}
                                            <td className="p-3 font-semibold">
                                                {prod.units < 5 ? (
                                                    <span className="text-red-600 font-bold">
                                                        {prod.units} (Low Stock!)
                                                    </span>
                                                ) : (
                                                    prod.units
                                                )}
                                            </td>

                                            <td className="p-3">{prod.unitsSold || 0}</td>

                                            <td className="p-3">{warehouse?.code || "—"}</td>

                                            {/* 🟢 Actions */}
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setModalData(prod)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        onClick={() => setUpdateData({
                                                            rowId: prod.rowId, 
                                                            productId: prod.id,       // ← productsSnapshot id
                                                            variationId: prod.variationId,
                                                            warehouseId: prod.warehouseId,
                                                            units: prod.units
                                                        })}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Update
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>
                </div>

                {/* {modalData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
                            <button
                                onClick={() => setModalData(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{modalData.productName}</h2>
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <img
                                    src={modalData.image || "/placeholder.png"}
                                    alt={modalData.productName}
                                    className="w-full md:w-48 h-48 object-cover rounded border"
                                />
                                <div className="flex-1 space-y-2">
                                    <div><strong>Variation:</strong> {modalData.variationName || "—"}</div>
                                    <div><strong>FNSKU:</strong> {modalData.FNSKU || "—"}</div>
                                    <div><strong>Price:</strong> {modalData.price || "—"}</div>
                                    <div><strong>Units:</strong> {modalData.units || "—"}</div>
                                    {modalData.dimensions && (
                                        <div>
                                            <strong>Dimensions:</strong>
                                            <pre className="bg-gray-100 p-2 rounded text-sm">
                                                {JSON.stringify(modalData.dimensions, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    <div>
                                        <strong>Warehouse:</strong>{" "}
                                        {warehouses.find((w) => w.id.toString() === modalData.warehouseId.toString())?.name || "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                {modalData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn">

                        {/* Modal Container */}
                        <div className="relative bg-white/90 dark:bg-gray-900 shadow-2xl rounded-3xl 
                        w-full max-w-3xl p-6 md:p-10 border border-white/20 
                        animate-slideUp">

                            {/* Close Button */}
                            <button
                                onClick={() => setModalData(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
                            >
                                &times;
                            </button>

                            {/* Title */}
                            <h2 className="text-3xl font-bold mb-6 text-gray-100">
                                {modalData.productName}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                {/* LEFT: PRODUCT IMAGE CARD */}
                                <div className="flex justify-center">
                                    <div className="rounded-2xl overflow-hidden border bg-white shadow-lg w-56 h-56 flex items-center justify-center">
                                        <img
                                            src={modalData.image || "/placeholder.png"}
                                            alt={modalData.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* RIGHT: PRODUCT DETAILS */}
                                <div className="space-y-4 text-gray-700">

                                    <DetailRow label="Variation" value={modalData.variationName} />
                                    <DetailRow label="FNSKU" value={modalData.FNSKU} />
                                    <DetailRow label="Price" value={`₹ ${modalData.price}`} />

                                    {/* UNITS BOX */}
                                    <div className="
                        bg-gradient-to-r from-gray-100 to-gray-200 
                        p-4 rounded-xl shadow-inner border flex justify-between items-center
                    ">
                                        <span className="font-semibold text-gray-800 text-lg">Units</span>
                                        <span
                                            className={`font-bold text-lg ${modalData.units < 5
                                                ? "text-red-600"
                                                : "text-green-600"
                                                }`}
                                        >
                                            {modalData.units}
                                            {modalData.units < 5 && (
                                                <span className="ml-1">(Low Stock!)</span>
                                            )}
                                        </span>
                                    </div>

                                    {/* WAREHOUSE */}
                                    <DetailRow
                                        label="Warehouse"
                                        value={
                                            warehouses.find(
                                                (w) =>
                                                    w.id.toString() ===
                                                    modalData.warehouseId.toString()
                                            )?.name || "—"
                                        }
                                    />

                                    {/* DIMENSIONS */}
                                    {modalData.dimensions && (
                                        <div>
                                            <p className="font-semibold mb-1 text-gray-900">Dimensions</p>
                                            <pre className="
                                bg-gray-100 p-4 rounded-xl text-sm 
                                max-h-40 overflow-auto shadow-inner border
                            ">
                                                {JSON.stringify(modalData.dimensions, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setModalData(null)}
                                    className="px-6 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 shadow"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                )}




                {updateData && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                            <button
                                onClick={() => setUpdateData(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-xl font-bold mb-4">Update Stock</h2>

                            <input
                                type="number"
                                placeholder="Enter new stock"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                className="border rounded-lg p-2 w-full mb-4"
                            />

                            <button onClick={updatStock} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </DefaultPageAdmin>
    );
};

export default DelhiStorePage;
