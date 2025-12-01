"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice";
import { fetchWarehouses } from "@/app/redux/slices/warehouse/wareHouseSlice";
import { X, Plus, Trash2 } from "lucide-react";
import { fetchTransfers, createTransfer, deleteTransfer, updateTransfer } from "@/app/redux/slices/transferWarehouse/transferWarehouseSlice";
import toast from 'react-hot-toast';
import PendingTabSendToWarehouse from "@/components/Admin/PendingTabSendToWarehouse/PendingTabSendToWarehouse";
import DispatchTabToWarehouse from "@/components/Admin/dispatchTabToWarehouse/dispatchTabToWarehouse";
import { createDispatch, fetchDispatches, updateDispatch, deleteDispatch, finalizeDispatch } from "@/app/redux/slices/dispatchUnitsWareHouse/dispatchUnitsWareHouseSlice";
import CompletedTab from "@/components/Admin/CompletedTab/CompletedTab";

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
    const { transfers } = useSelector((state) => state.transferWarehouse);
    const { dispatches } = useSelector((state) => state.dispatchWarehouse);
    const [matchedTransferEntries, setMatchedTransferEntries] = useState([]);
    console.log("dispatches", dispatches)

    useEffect(() => {
        dispatch(fetchDispatches())
        dispatch(fetchTransfers())
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



    // const handleOpenModal = (product, variation = null) => {
    //     setSelectedProduct(product);
    //     setSelectedVariation(variation); // NEW

    //     const currentFNSKU = variation ? variation.barCode : product.barCode;

    //     const matchedTransfer = transfers.find(
    //         (t) => t.FNSKU === currentFNSKU
    //     );

    //     if (matchedTransfer && matchedTransfer.entries?.length > 0) {
    //         // agar transfer entries milti hain
    //         const formattedEntries = matchedTransfer.entries.map((e) => ({
    //             warehouseId: e.warehouseId,
    //             units: e.units,
    //         }));

    //         setModalEntries(formattedEntries);
    //     } else {
    //         // default empty entry
    //         setModalEntries([
    //             { warehouseId: "", units: "" }
    //         ]);
    //     }

    //     setModalOpen(true);
    // };
    const handleOpenModal = (product, variation) => {
        setSelectedProduct(product);
        setSelectedVariation(variation);
        setModalOpen(true);

        const currentFNSKU = variation ? variation.barCode : product.barCode;

        const matched = transfers.find(t => t.FNSKU === currentFNSKU);

        if (matched && matched.entries?.length > 0) {
            console.log("matched", matched);

            // entries me parent status ko add karo
            const pendingEntries = matched.status === "pending"
                ? matched.entries.map(e => ({ ...e, status: matched.status }))
                : [];

            console.log("pendingEntries", pendingEntries);
            setMatchedTransferEntries(pendingEntries);

            // modal entry blank
            setModalEntries([{ warehouseId: "", units: "" }]);
        } else {
            setMatchedTransferEntries([]);
            setModalEntries([{ warehouseId: "", units: "" }]);
        }
    };



    const addMoreField = () => {
        setModalEntries([...modalEntries, { warehouseId: "", units: "" }]);
    };

    const handleModalChange = (index, field, value) => {
        const copy = [...modalEntries];
        copy[index][field] = value;
        setModalEntries(copy);
    };

    // const handleConfirmSend = async () => {
    //     console.log("modalEntries", modalEntries)
    //     for (let entry of modalEntries) {
    //         if (!entry.warehouseId || entry.warehouseId.trim() === "") {
    //             return toast.error("Please select warehouse for all entries!");
    //         }
    //         if (!entry.units || entry.units.trim() === "") {
    //             return toast.error("Please enter units for all entries!");
    //         }
    //     }
    //     const payload = {
    //         productId: selectedProduct.id,
    //         productName: selectedProduct.name,

    //         variationId: selectedVariation ? selectedVariation.id : null,
    //         variationName: selectedVariation ? selectedVariation.variationName : null,

    //         price: selectedVariation
    //             ? selectedVariation.price
    //             : selectedProduct.price,

    //         MRP: selectedVariation
    //             ? selectedVariation.MRP
    //             : selectedProduct.MRP,

    //         FNSKU: selectedVariation
    //             ? selectedVariation.barCode
    //             : selectedProduct.barCode,

    //         image: selectedVariation
    //             ? selectedVariation.image?.[0] || null
    //             : selectedProduct.image?.[0] || null,

    //         entries: modalEntries.map((entry) => ({
    //             warehouseId: entry.warehouseId,
    //             units: entry.units,
    //         })),
    //     };

    //     // ✅ Dispatch the async thunk and store the result
    //     const result = await dispatch(createTransfer(payload));

    //     // Check if the request was successful
    //     if (createTransfer.fulfilled.match(result)) {
    //         const apiMessage = result.payload?.message || "Product successfully sent";
    //         toast.success(apiMessage);
    //         setModalOpen(false);
    //     } else {
    //         const apiError = result.payload?.message || result.error?.message || "Failed to send product";
    //         toast.error(apiError);
    //     }

    //     console.log("FINAL SEND:", payload);
    // };

    const handleConfirmSend = async () => {
        console.log("modalEntries", modalEntries);

        for (let entry of modalEntries) {
            if (!entry.warehouseId || entry.warehouseId.trim() === "") {
                return toast.error("Please select warehouse for all entries!");
            }
            if (!entry.units || entry.units.trim() === "") {
                return toast.error("Please enter units for all entries!");
            }
        }

        // ✅ Split each warehouse entry into a separate transfer
        const payloads = modalEntries.map((entry) => ({
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            variationId: selectedVariation ? selectedVariation.id : null,
            variationName: selectedVariation ? selectedVariation.variationName : null,
            price: selectedVariation ? selectedVariation.price : selectedProduct.price,
            MRP: selectedVariation ? selectedVariation.MRP : selectedProduct.MRP,
            FNSKU: selectedVariation ? selectedVariation.barCode : selectedProduct.barCode,
            image: selectedVariation ? selectedVariation.image?.[0] || null : selectedProduct.image?.[0] || null,
            entries: [{ warehouseId: entry.warehouseId, units: entry.units }], // ✅ Only 1 warehouse per record
            status: "pending"
        }));

        // Send all payloads one by one
        for (const payload of payloads) {
            const result = await dispatch(createTransfer(payload));
            if (createTransfer.fulfilled.match(result)) {
                toast.success(result.payload?.message || "Product sent to warehouse");
            } else {
                toast.error(result.payload?.message || result.error?.message || "Failed to send product");
            }
        }

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
                        onClick={() => setMainTab("dispatch")}
                        className={`pb-2 cursor-pointer ${mainTab === "dispatch"
                            ? "border-b-2 border-black font-semibold "
                            : ""
                            }`}
                    >
                        Dispatch
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

                {/* ------------------------ NEW TAB ------------------------ */}
                {mainTab === "new" && (
                    <>
                        {/* Search Input */}
                        < input
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
                                {activeTab === "products" && (
                                    <>
                                        {productResults.length > 0 ? (
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
                                                                        <img src={p.image?.[0]} className="w-16 h-16 rounded object-cover mx-auto" />
                                                                    </td>
                                                                    <td className="p-2 text-center">{p.name}</td>
                                                                    <td className="p-2 text-center">{p.sku} / {p.barCode}</td>
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
                                        ) : (
                                            <p className="text-center text-gray-500 py-10">No products found</p>
                                        )}
                                    </>
                                )}


                                {/* ------------------------------ VARIATION TABLE ------------------------------ */}
                                {activeTab === "variations" && (
                                    <>
                                        {variationResults.length > 0 ? (
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
                                                                        <img src={item.variation.image?.[0]} className="w-16 h-16 rounded object-cover mx-auto" />
                                                                    </td>
                                                                    <td className="p-2 text-center">{item.variation.variationName}</td>
                                                                    <td className="p-2 text-center">{item.variation.sku} / {item.variation.barCode}</td>
                                                                    <td className="p-2 text-center">{item.variation.price}</td>
                                                                    <td className="p-2 text-center">{item.parent.name}</td>
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
                                        ) : (
                                            <p className="text-center text-gray-500 py-10">No variations found</p>
                                        )}
                                    </>
                                )}

                            </>
                        )}
                    </>
                )}
                {/* ------------------------------ MODAL ------------------------------ */}
                {modalOpen && selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-7xl relative">
                            <button
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => setModalOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* HEADER */}
                            <h2 className="text-xl font-semibold mb-1">
                                {selectedProduct.name}
                            </h2>

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
                            {/* PREVIOUS TRANSFER SUMMARY */}
                            {matchedTransferEntries?.filter(item => item.status === "pending").length > 0 && (
                                <div className="mb-4 p-4 border rounded-lg bg-gray-100">
                                    <h3 className="font-semibold text-lg mb-3">Previous Transfer Summary</h3>
                                    <div className="space-y-3">
                                        {matchedTransferEntries
                                            .filter(item => item.status === "pending")
                                            .map((item, i) => {
                                                const warehouseInfo = warehouses.find(w => String(w.id) === String(item.warehouseId));
                                                return (
                                                    <div
                                                        key={i}
                                                        className="p-3 bg-white rounded border shadow-sm flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <p className="text-sm text-gray-800">
                                                                <b>Warehouse:</b>{" "}
                                                                {warehouseInfo
                                                                    ? `${warehouseInfo.code} - ${warehouseInfo.name} (${warehouseInfo.state})`
                                                                    : `ID: ${item.warehouseId}`}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-800">
                                                                <b>Units Sent:</b> {item.units}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}




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
                                            {warehouses.filter(
                                                w => !matchedTransferEntries?.some(m => String(m.warehouseId) === String(w.id))
                                            ).length > 0 ? (
                                                warehouses
                                                    .filter(
                                                        w => !matchedTransferEntries?.some(m => String(m.warehouseId) === String(w.id))
                                                    )
                                                    .map((w) => (
                                                        <option key={w.id} value={w.id}>
                                                            {w.code} - {w.name} ({w.state})
                                                        </option>
                                                    ))
                                            ) : (
                                                <option value="" disabled>No warehouse available</option>
                                            )}
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

                                    {/* STATIC FIELD */}
                                    <div>
                                        <label className="text-sm font-medium">Variation Units</label>
                                        <input
                                            type="text"
                                            value={"120"}
                                            disabled
                                            className="border px-2 py-1 w-full rounded bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Warehouse Units</label>
                                        <input
                                            type="text"
                                            value={"850"}
                                            disabled
                                            className="border px-2 py-1 w-full rounded bg-gray-100 text-gray-600"
                                        />
                                    </div>

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



                {mainTab === "pending" && (
                    <PendingTabSendToWarehouse fetchTransfers={fetchTransfers} transfers={transfers} warehouses={warehouses} deleteTransfer={deleteTransfer} updateTransfer={updateTransfer} createDispatch={createDispatch} />
                )}

                {mainTab === "dispatch" && (
                    <DispatchTabToWarehouse fetchDispatches={fetchDispatches} dispatches={dispatches} warehouses={warehouses} deleteDispatch={deleteDispatch} updateDispatch={updateDispatch} finalizeDispatch={finalizeDispatch} />
                )}

                {mainTab === "completed" && (
                    <CompletedTab fetchDispatches={fetchDispatches} dispatches={dispatches} warehouses={warehouses} deleteDispatch={deleteDispatch} updateDispatch={updateDispatch} finalizeDispatch={finalizeDispatch} />
                )}
            </div>
        </DefaultPageAdmin >
    );
};

export default SendToWarehousePage;
