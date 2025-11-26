import React, { useState } from "react";
import { Eye, Truck } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const dispatchTabToWarehouse = ({
    fetchDispatches,
    dispatches,
    warehouses,
    deleteDispatch,
    updateDispatch,
}) => {
    const dispatch = useDispatch();
    const [modalData, setModalData] = useState(null);

    const getWarehouseInfo = (warehouseId) => {
        const warehouse = warehouses.find((w) => w.id.toString() === warehouseId.toString());
        return warehouse ? `${warehouse.code} - ${warehouse.name}, ${warehouse.state}` : warehouseId;
    };

    const handleDispatch = (dispatchItem) => {
        // Dispatch logic here
        toast.success("Dispatch successful!");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Dispatch to Warehouse</h1>

            {dispatches.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No dispatches available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dispatches.map((d) => (
                        <div key={d.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                            <img
                                src={d.image}
                                alt={d.productName}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <h2 className="text-lg font-semibold">{d.productName}</h2>
                            {d.variationName && <p className="text-gray-500">{d.variationName}</p>}
                            <p className="text-gray-700 font-medium">FNSKU: {d.FNSKU}</p>
                            <p className="text-gray-700 font-medium">MRP: {d.MRP}</p>
                            <div className="mt-2">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">Warehouses:</h3>
                                {d.entries.map((e, idx) => (
                                    <div key={idx} className="flex justify-between text-gray-700 text-sm">
                                        <span>{getWarehouseInfo(e.warehouseId)}</span>
                                        <span>({e.units})</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => setModalData(d)}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    <Eye size={16} /> View
                                </button>
                                <button
                                    onClick={() => handleDispatch(d)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    <Truck size={16} /> Dispatch
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] animate-fadeIn">

                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
                            onClick={() => setModalData(null)}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">{modalData.productName}</h2>
                        {modalData.variationName && <p className="text-gray-500 mb-2">{modalData.variationName}</p>}
                        <img
                            src={modalData.image}
                            alt={modalData.productName}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <p>FNSKU: {modalData.FNSKU}</p>
                        <p>MRP: {modalData.MRP}</p>
                        <p>Price: {modalData.price}</p>
                        <div className="mt-4">
                            <h3 className="font-semibold">Warehouses & Units:</h3>
                            {modalData.entries.map((e, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{getWarehouseInfo(e.warehouseId)}</span>
                                    <span>{e.units} units</span>
                                </div>
                            ))}
                        </div>


                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <button
                                onClick={() => setModalData(null)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default dispatchTabToWarehouse;
