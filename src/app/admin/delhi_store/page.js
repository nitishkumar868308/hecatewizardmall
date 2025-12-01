"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDelhiStore } from "@/app/redux/slices/delhiStore/delhiStoreSlice";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchWarehouses } from "@/app/redux/slices/warehouse/wareHouseSlice";

const DelhiStorePage = () => {
    const dispatch = useDispatch();
    const { store, loading } = useSelector((state) => state.delhiStore);
    const { warehouses } = useSelector((state) => state.warehouses);

    const [search, setSearch] = useState("");
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        dispatch(fetchWarehouses())
        dispatch(fetchDelhiStore());
    }, [dispatch]);

    // Flatten all products with units & warehouse from nested entries
    const allProducts = store.flatMap((item) =>
        item.productsSnapshot?.entries.flatMap((prod) =>
            prod.entries?.map((entry) => ({
                id: prod.id,
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

    const filteredProducts = allProducts.filter((prod) => {
        const matchesSearch =
            prod.productName?.toLowerCase().includes(search.toLowerCase()) ||
            prod.variationName?.toLowerCase().includes(search.toLowerCase()) ||
            prod.FNSKU?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <DefaultPageAdmin>
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    Delhi Store Products
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
                                <th className="p-3">Snapshot</th>
                            </tr>
                        </thead>
                        <tbody>
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
                        </tbody>
                    </table>
                </div>

                {modalData && (
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
                )}
            </div>
        </DefaultPageAdmin>
    );
};

export default DelhiStorePage;
