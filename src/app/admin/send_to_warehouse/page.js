"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice";
import { fetchWarehouses } from "@/app/redux/slices/warehouse/wareHouseSlice";
import { X, Plus, Trash2 } from "lucide-react";

const SendToWarehousePage = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { warehouses } = useSelector((state) => state.warehouses);
    const [userChangedTab, setUserChangedTab] = useState(false);
    const [search, setSearch] = useState("");
    const [mainTab, setMainTab] = useState("new"); // NEW TOP TABS
    const [activeTab, setActiveTab] = useState("products");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalEntries, setModalEntries] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);

    useEffect(() => {
        dispatch(fetchAllProducts());
        dispatch(fetchWarehouses());
    }, [dispatch]);


    const s = search.toLowerCase().trim();

    const productResults =
        s === ""
            ? []
            : products.filter(
                (p) =>
                    p.name.toLowerCase().includes(s) ||
                    p.sku?.toLowerCase().includes(s) ||
                    p.barCode?.toLowerCase().includes(s)
            );

    const variationResults =
        s === ""
            ? []
            : products
                .flatMap((p) =>
                    p.variations?.map((v) => ({
                        parent: p,
                        variation: v,
                    }))
                )
                .filter(
                    (v) =>
                        v.variation.variationName?.toLowerCase().includes(s) ||
                        v.variation.sku?.toLowerCase().includes(s) ||
                        v.variation.barCode?.toLowerCase().includes(s)
                );

    useEffect(() => {
        if (search === "") return;

        // if user manually changed tab, do not auto-change
        if (userChangedTab) return;

        // correct priority:
        if (productResults.length > 0) {
            setActiveTab("products");
        } else if (variationResults.length > 0) {
            setActiveTab("variations");
        } else {
            setActiveTab("products");
        }
    }, [search, productResults, variationResults, userChangedTab]);



    const handleOpenModal = (product, variation = null) => {
        setSelectedProduct(product);
        setSelectedVariation(variation); // NEW

        setModalEntries([
            { warehouseId: "", units: "" },
        ]);

        setModalOpen(true);
    };


    const addMoreField = () => {
        setModalEntries([...modalEntries, { warehouseId: "", units: "" }]);
    };

    const handleModalChange = (index, field, value) => {
        const copy = [...modalEntries];
        copy[index][field] = value;
        setModalEntries(copy);
    };

    const handleConfirmSend = () => {
        console.log("FINAL SEND:", {
            productId: selectedProduct.id,
            entries: modalEntries,
        });

        setModalOpen(false);
    };

    const removeEntry = (index) => {
        setModalEntries(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <DefaultPageAdmin>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-black">Send to Warehouse</h1>

                {/* ------------------------ MAIN TOP TABS ------------------------ */}
                <div className="flex gap-6 border-b pb-2 ">
                    <button
                        onClick={() => setMainTab("new")}
                        className={`pb-2 cursor-pointer ${mainTab === "new" ? "border-b-2 border-black font-semibold " : ""
                            }`}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setMainTab("pending")}
                        className={`pb-2 cursor-pointer ${mainTab === "pending"
                            ? "border-b-2 border-black font-semibold "
                            : ""
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setMainTab("completed")}
                        className={`pb-2 cursor-pointer ${mainTab === "completed"
                            ? "border-b-2 border-black font-semibold "
                            : ""
                            }`}
                    >
                        Completed
                    </button>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search Product or Variation"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />

                {search === "" && (
                    <p className="text-center text-gray-500 py-10">Start searching...</p>
                )}

                {search !== "" && (
                    <>
                        {/* INNER TABS: PRODUCTS | VARIATIONS */}
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => {
                                    setActiveTab("products");
                                    setUserChangedTab(true);
                                }}
                                className={`px-4 py-2 border-b-2 cursor-pointer ${activeTab === "products" ? "border-black font-semibold" : "border-transparent"
                                    }`}
                            >
                                Products
                            </button>

                            <button
                                onClick={() => {
                                    setActiveTab("variations");
                                    setUserChangedTab(true);
                                }}
                                className={`px-4 py-2 border-b-2 cursor-pointer ${activeTab === "variations" ? "border-black font-semibold" : "border-transparent"
                                    }`}
                            >
                                Variations
                            </button>
                        </div>

                        {/* ------------------------------ PRODUCT TABLE ------------------------------ */}
                        {activeTab === "products" && productResults.length > 0 && (
                            <div className="mt-4">
                                <div className="overflow-x-auto rounded-lg">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2">S.No</th>
                                                <th className="p-2">Image</th>
                                                <th className="p-2">Product</th>
                                                <th className="p-2">SKU / FNSKU</th>
                                                <th className="p-2">Price</th>
                                                <th className="p-2">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {productResults.map((p, i) => (
                                                <tr key={p.id} className="hover:bg-gray-50">
                                                    <td className="p-2 text-center">{i + 1}</td>

                                                    <td className="p-2 text-center">
                                                        <img
                                                            src={p.image?.[0]}
                                                            className="w-16 h-16 rounded object-cover mx-auto"
                                                        />
                                                    </td>

                                                    <td className="p-2 text-center">{p.name}</td>

                                                    <td className="p-2 text-center">
                                                        {p.sku} / {p.barCode}
                                                    </td>

                                                    <td className="p-2 text-center">{p.price}</td>

                                                    <td className="p-2 text-center">
                                                        <button
                                                            onClick={() => handleOpenModal(p)}
                                                            className="px-3 py-1 bg-black text-white rounded cursor-pointer"
                                                        >
                                                            Ready to Send
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ------------------------------ VARIATION TABLE ------------------------------ */}
                        {activeTab === "variations" && variationResults.length > 0 && (
                            <div className="mt-4">
                                <div className="overflow-x-auto rounded-lg">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2">S.No</th>
                                                <th className="p-2">Image</th>
                                                <th className="p-2">Variation</th>
                                                <th className="p-2">SKU / FNSKU</th>
                                                <th className="p-2">Price</th>
                                                <th className="p-2">Parent Product</th>
                                                <th className="p-2">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {variationResults.map((item, i) => (
                                                <tr key={item.variation.id} className="hover:bg-gray-50">
                                                    <td className="p-2 text-center">{i + 1}</td>

                                                    <td className="p-2 text-center">
                                                        <img
                                                            src={item.variation.image?.[0]}
                                                            className="w-16 h-16 rounded object-cover mx-auto"
                                                        />
                                                    </td>

                                                    <td className="p-2 text-center">
                                                        {item.variation.variationName}
                                                    </td>

                                                    <td className="p-2 text-center">
                                                        {item.variation.sku} / {item.variation.barCode}
                                                    </td>

                                                    <td className="p-2 text-center">
                                                        {item.variation.price}
                                                    </td>

                                                    <td className="p-2 text-center">
                                                        {item.parent.name}
                                                    </td>

                                                    <td className="p-2 text-center">
                                                        <button
                                                            onClick={() => handleOpenModal(item.parent, item.variation)}
                                                            className="px-3 py-1 bg-black text-white rounded cursor-pointer"
                                                        >
                                                            Ready to Send
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ------------------------------ MODAL ------------------------------ */}
                {modalOpen && selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative">
                            <button
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => setModalOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* ----- HEADER TITLE ----- */}
                            <h2 className="text-xl font-semibold mb-1">
                                {selectedProduct.name}
                            </h2>

                            {/* Sub-title only when variation is selected */}
                            {selectedVariation && (
                                <p className="text-sm text-gray-600 mb-4">
                                    Variation Name: <b>{selectedVariation.variationName}</b>
                                </p>
                            )}

                            <div className="flex gap-4 mb-4">
                                <img
                                    src={selectedVariation ? selectedVariation.image?.[0] : selectedProduct.image?.[0]}
                                    className="w-24 h-24 rounded object-cover"
                                />

                                <div>
                                    <p>
                                        <b>Price:</b> {selectedVariation ? selectedVariation.price : selectedProduct.price}
                                    </p>

                                    <p>
                                        <b>MRP:</b> {selectedVariation ? selectedVariation.MRP : selectedProduct.MRP}
                                    </p>

                                    <p>
                                        <b>FNSKU:</b> {selectedVariation ? selectedVariation.barCode : selectedProduct.barCode}
                                    </p>
                                </div>
                            </div>

                            <h3 className="font-semibold mt-4 mb-2">Send Units</h3>

                            {modalEntries.map((entry, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 mb-3 items-end">

                                    {/* Warehouse Select */}
                                    <div>
                                        <label className="text-sm font-medium">Warehouse</label>
                                        <select
                                            value={entry.warehouseId}
                                            onChange={(e) =>
                                                handleModalChange(index, "warehouseId", e.target.value)
                                            }
                                            className="border px-2 py-1 w-full rounded"
                                        >
                                            <option value="">Select Warehouse</option>
                                            {warehouses.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Units to Send */}
                                    <div>
                                        <label className="text-sm font-medium">Units to Send</label>
                                        <input
                                            type="number"
                                            value={entry.units}
                                            onChange={(e) =>
                                                handleModalChange(index, "units", e.target.value)
                                            }
                                            className="border px-2 py-1 w-full rounded"
                                        />
                                    </div>

                                    {/* STATIC FIELD — Variation units in this warehouse */}
                                    <div>
                                        <label className="text-sm font-medium">Variation Units</label>
                                        <input
                                            type="text"
                                            value={"120"}   // STATIC FOR NOW
                                            disabled
                                            className="border px-2 py-1 w-full rounded bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    {/* STATIC FIELD — Total units in this warehouse */}
                                    <div>
                                        <label className="text-sm font-medium">Warehouse Units</label>
                                        <input
                                            type="text"
                                            value={"850"}   // STATIC FOR NOW
                                            disabled
                                            className="border px-2 py-1 w-full rounded bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => removeEntry(index)}
                                            className="text-red-600 hover:text-red-800 cursor-pointer"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>

                                </div>
                            ))}

                            <button
                                onClick={addMoreField}
                                className="flex items-center gap-2 text-gray-800 mt-2 cursor-pointer"
                            >
                                <Plus size={18} /> Add More
                            </button>

                            <button
                                onClick={handleConfirmSend}
                                className="mt-4 w-full py-2 bg-black text-white rounded cursor-pointer"
                            >
                                Confirm Send
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </DefaultPageAdmin>
    );
};

export default SendToWarehousePage;
