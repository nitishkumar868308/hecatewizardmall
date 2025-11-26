import React, { useState } from "react";
import { Edit, Trash2, Eye, Truck, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';

const PendingTabSendToWarehouse = ({
  fetchTransfers,
  transfers,
  warehouses,
  deleteTransfer,
  updateTransfer,
  createDispatch
}) => {
  const dispatch = useDispatch();
  const [modalData, setModalData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  console.log("transfers", transfers)
  const pendingTransfers = transfers.filter(t => t.status === "pending");

  const getWarehouseInfo = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id.toString() === warehouseId.toString());
    if (!warehouse) return warehouseId;
    return `${warehouse.code} - ${warehouse.name}, ${warehouse.state}`;
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;

    dispatch(deleteTransfer(deleteConfirm.transfer.id))
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "Transfer deleted successfully");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete transfer");
      });

    setDeleteConfirm(null);
  };

  const handleEditConfirm = () => {
    if (!editData) return;
    console.log("editData", editData)
    dispatch(updateTransfer(editData))
      .unwrap()
      .then((res) => toast.success(res?.message || "Transfer updated successfully"))
      .catch((err) => toast.error(err?.message || "Failed to update transfer"));

    setEditData(null);
  };

  const filteredTransfers = selectedWarehouse
    ? pendingTransfers.filter(t =>
      t.entries.some(e => e.warehouseId.toString() === selectedWarehouse)
    )
    : pendingTransfers;

  const displayedTransfers = filteredTransfers.map(transfer => {
    if (!selectedWarehouse) return transfer;
    return {
      ...transfer,
      entries: transfer.entries.filter(
        e => e.warehouseId.toString() === selectedWarehouse
      )
    };
  });

  const totalUnits = displayedTransfers.reduce((sum, transfer) => {
    return sum + transfer.entries.reduce((eSum, e) => eSum + Number(e.units), 0);
  }, 0);


  const handleDispatch = async (transfers) => {
    try {
      if (!transfers || transfers.length === 0) return;

      // Calculate total units
      const totalUnits = transfers.reduce((acc, t) => {
        if (t.entries && Array.isArray(t.entries)) {
          const sumUnits = t.entries.reduce((uAcc, e) => uAcc + parseInt(e.units || 0), 0);
          return acc + sumUnits;
        }
        return acc;
      }, 0);

      // Total FNSKU is just the number of transfers
      const totalFNSKU = transfers.length;

      // Prepare the payload for backend
      const payload = {
        totalUnits,
        totalFNSKU,
        transfers: transfers.map(t => ({
          productId: t.productId,
          productName: t.productName,
          variationId: t.variationId,
          variationName: t.variationName,
          price: t.price,
          MRP: t.MRP,
          FNSKU: t.FNSKU,
          entries: t.entries,
          image: t.image,
          status: "dispatched"
        }))
      };
      console.log("payload" , payload)

      const result = await dispatch(createDispatch(payload))
      if (createDispatch.fulfilled.match(result)) {
        const successMessage = result.payload?.message || "Products dispatched successfully";
        toast.success(successMessage);

        // Refresh transfers list
        dispatch(fetchTransfers());

      } else {
        const errorMessage = result.payload?.message || result.error?.message || "Dispatch failed";
        toast.error(errorMessage);
      }

    } catch (error) {
      console.error("Dispatch error:", error);
      alert("Something went wrong while dispatching");
    }
  };



  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold">Pending WareHouse Transfers</h1>

        {/* Dropdown */}
        <div className="w-64">
          <h1 className="text-lg font-semibold mb-2">Select Warehouse</h1>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select Warehouse --</option>
            {(() => {
              const warehouseIds = pendingTransfers.flatMap(t =>
                t.entries.map(e => e.warehouseId)
              );
              const uniqueWarehouseIds = [...new Set(warehouseIds)];
              const availableWarehouses = warehouses.filter(w =>
                uniqueWarehouseIds.includes(w.id.toString())
              );
              return availableWarehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name}, {w.state}
                </option>
              ));
            })()}
          </select>
        </div>
      </div>

      {displayedTransfers.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No WareHouse pending transfers found.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center">S.No</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3 text-center">Product Name</th>
              <th className="p-3 text-center">FNSKU</th>
              <th className="p-3 text-center">Warehouse & Units</th>
              {/* <th className="p-3 text-center">Units</th> */}
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransfers.map((transfer, tIndex) => {
              // Prepare display arrays
              const warehouseUnitList = transfer.entries
                .map(e => `${getWarehouseInfo(e.warehouseId)} (${e.units})`)
                .join(", ");
              return (
                <tr key={transfer.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="p-3 text-center">{tIndex + 1}</td>

                  <td className="p-3 text-center">
                    <img
                      src={transfer.image}
                      alt={transfer.productName}
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />
                  </td>

                  <td className="p-3 text-center">{transfer.productName}</td>
                  <td className="p-3 text-center">{transfer.FNSKU}</td>
                  {/* <td className="p-3 text-center">{warehouseList}</td>
                  <td className="p-3 text-center">{unitList}</td> */}
                  <td className="p-3 text-center">
                    {transfer.entries.map((e, idx) => (
                      <div key={idx} className="mb-1">
                        <span>{getWarehouseInfo(e.warehouseId)}</span>{" "}
                        <span className="font-semibold text-gray-800">({e.units})</span>
                      </div>
                    ))}
                  </td>


                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex flex-nowrap items-center justify-center gap-2">
                      <button
                        onClick={() => setModalData(transfer)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer whitespace-nowrap"
                      >
                        <Eye size={16} /> View
                      </button>

                      <button
                        onClick={() => setEditData(transfer)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                      >
                        <Edit size={16} /> Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirm({ transfer })}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer whitespace-nowrap"
                      >
                        <Trash2 size={16} /> Delete
                      </button>

                      {/* <button
                        onClick={() => handleDispatch(transfer)}
                        className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer whitespace-nowrap"
                      >
                        <Truck size={16} /> Dispatch
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selectedWarehouse && displayedTransfers.length > 0 && (
        <div className="flex justify-end mt-6 items-center gap-6">

          {/* Summary Card */}
          <div className="bg-gray-100 border border-gray-300 shadow-sm px-5 py-3 rounded-xl flex gap-6 items-center">

            <div className="text-gray-700 font-medium">
              Total Units:
              <span className="ml-2 font-bold text-blue-700">{totalUnits}</span>
            </div>

            <div className="text-gray-700 font-medium">
              Total FNSKU:
              <span className="ml-2 font-bold text-purple-700">{displayedTransfers.length}</span>
            </div>
          </div>

          {/* Dispatch Button */}
          <button
            onClick={() => handleDispatch(displayedTransfers)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition cursor-pointer"
          >
            <Truck size={18} /> Dispatch
          </button>
        </div>
      )}


      {/* ----------------- MODAL ----------------- */}
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

            {/* Header */}
            <div className="mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-2xl font-semibold">{modalData.productName}</h2>
              {modalData.variationName && (
                <p className="text-sm text-gray-500 mt-1">
                  Variation: <span className="font-medium">{modalData.variationName}</span>
                </p>
              )}
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0 w-full md:w-48">
                <img
                  src={modalData.image}
                  alt={modalData.productName}
                  className="w-full h-48 object-cover rounded shadow-sm"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">FNSKU:</span>
                  <span>{modalData.FNSKU}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">MRP:</span>
                  <span>{modalData.MRP}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span>{modalData.price}</span>
                </div>

                {/* Warehouses & Units */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Warehouse Details</h3>
                  <div className="space-y-2">
                    {modalData.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100"
                      >
                        <span className="text-gray-700 font-medium">{getWarehouseInfo(entry.warehouseId)}</span>
                        <span className="text-gray-800">{entry.units} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

      {/* -------------- EDIT MODAL -------------- */}
      {editData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="flex justify-between items-center bg-blue-50 px-8 py-4 border-b border-blue-100">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Warehouse Transfer ({editData.productName})
              </h2>
              {editData.variationName && (
                <p className="text-sm text-gray-500 mt-1">
                  Variation: <span className="font-medium">{editData.variationName}</span>
                </p>
              )}
              <button
                className="text-blue-400 hover:text-blue-800 text-3xl font-bold transition cursor-pointer"
                onClick={() => setEditData(null)}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <div className="md:flex gap-10">
                {/* Left: Image */}
                <div className="md:w-1/3 flex justify-center items-start mb-6 md:mb-0">
                  <img
                    src={editData.image}
                    alt={editData.productName}
                    className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg border border-gray-100"
                  />
                </div>

                {/* Right: Editable Fields */}
                <div className="md:w-2/3 flex flex-col gap-6">
                  {editData.entries.map((entry, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 flex justify-between items-center">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Warehouse:</span>
                          <select
                            value={entry.warehouseId}
                            onChange={(e) => {
                              const newEntries = editData.entries.map((entry, i) =>
                                i === index ? { ...entry, warehouseId: e.target.value } : entry
                              );
                              setEditData({ ...editData, entries: newEntries });
                            }}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            {warehouses.map(w => (
                              <option key={w.id} value={w.id}>
                                {w.code} - {w.name}, {w.state}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Units:</span>
                          <input
                            type="number"
                            value={entry.units}
                            onChange={(e) => {
                              const newEntries = editData.entries.map((entry, i) =>
                                i === index ? { ...entry, units: e.target.value } : entry
                              );
                              setEditData({ ...editData, entries: newEntries });
                            }}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          const newEntries = editData.entries.filter((_, i) => i !== index);
                          setEditData({ ...editData, entries: newEntries });
                        }}

                        className="ml-4 text-red-500 hover:text-red-700 transition cursor-pointer"
                        title="Remove this warehouse"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 px-8 py-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setEditData(null)}
                className="px-6 py-2 bg-gray-300 text-black rounded-2xl hover:bg-gray-400 transition font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                className="px-6 py-2 bg-gray-800 text-white rounded-2xl hover:bg-black transition font-medium flex items-center gap-2 cursor-pointer"
              >
                <Check size={18} /> Update
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ----------------- Delete Confirmation Modal ----------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete <b>{deleteConfirm.transfer.productName}</b>?</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingTabSendToWarehouse;
