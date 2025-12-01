"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { fetchWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '@/app/redux/slices/warehouse/wareHouseSlice';
import { useDispatch, useSelector } from "react-redux";
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";
import toast from 'react-hot-toast';

const Warehouse = () => {
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { warehouses, loading, error } = useSelector((state) => state.warehouses);
    const { states } = useSelector((state) => state.states);
    const [newWarehouse, setNewWarehouse] = useState({
        name: "",
        state: "",
        address: "",
        code: "",
        pincode: "",
        contact: ""
    });

    const [editWarehouse, setEditWarehouse] = useState({
        id: null,
        name: "",
        state: "",
        address: "",
        code: "",
        pincode: "",
        contact: ""
    });

    const [deleteWarehouseId, setDeleteWarehouseId] = useState(null);

    useEffect(() => {
        dispatch(fetchStates());
        dispatch(fetchWarehouses());
    }, [dispatch]);

    const handleAddWarehouse = () => {
        const { name, state, address, code, pincode, contact } = newWarehouse;
        if (!name || !state || !address || !code || !pincode || !contact) {
            return toast.error("Please fill all fields");
        }

        dispatch(createWarehouse(newWarehouse))
            .unwrap()
            .then(() => {
                setNewWarehouse({ name: "", state: "", address: "", code: "", pincode: "" });
                setModalOpen(false);
            })
            .catch((err) => console.error("Failed to create warehouse:", err));
    };

    const handleUpdateWarehouse = () => {
        if (!editWarehouse?.id) return;

        dispatch(updateWarehouse(editWarehouse))
            .unwrap()
            .then(() => setEditModalOpen(false))
            .catch((err) => console.error("Failed to update warehouse:", err));
    };

    const handleDeleteWarehouse = () => {
        if (!deleteWarehouseId) return;

        dispatch(deleteWarehouse(deleteWarehouseId))
            .unwrap()
            .then(() => setDeleteModalOpen(false))
            .catch((err) => console.error("Failed to delete warehouse:", err));
    };

    const filteredWarehouses = warehouses.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = () => {
        setNewWarehouse({ name: "", state: "", address: "", code: "", pincode: "" });
        setModalOpen(true);
    };

    return (
        <DefaultPageAdmin>
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Warehouse Locations</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search warehouses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Warehouse
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWarehouses.map((w, idx) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition-colors">

                                    {/* S.No (no wrap required) */}
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {idx + 1}.
                                    </td>

                                    {/* Wrap allowed */}
                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800 font-medium">
                                        {w.name}
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800">
                                        {w.state}
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800">
                                        {w.address}
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800">
                                        {w.code}
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800">
                                        {w.pincode}
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal break-words text-gray-800">
                                        {w.contact}
                                    </td>

                                    {/* Actions (no wrap) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditWarehouse(w);
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteWarehouseId(w.id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}

                            {filteredWarehouses.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-6 text-gray-400 italic">
                                        No warehouses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Add Modal */}
            {/* {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Warehouse</h2>

                        <input
                            type="text"
                            placeholder="Warehouse Name"
                            value={newWarehouse.name}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={newWarehouse.state}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, state: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select State</option>
                            {states.map((s) => (
                                <option key={s.id} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Address"
                            value={newWarehouse.address}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Code"
                            value={newWarehouse.code}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={newWarehouse.pincode}
                            onChange={(e) => setNewWarehouse({ ...newWarehouse, pincode: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddWarehouse}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Warehouse</h2>

                        {/* Warehouse Form with labels */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Warehouse Name</label>
                            <input
                                type="text"
                                value={newWarehouse.name}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">State</label>
                            <select
                                value={newWarehouse.state}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, state: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={newWarehouse.address}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={newWarehouse.code}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Pincode</label>
                            <input
                                type="text"
                                value={newWarehouse.pincode}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, pincode: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div> */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">
                                Pincodes (comma separated)
                            </label>

                            <textarea
                                value={newWarehouse.pincode}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, pincode: e.target.value })}
                                placeholder="560001, 560002, 560003 ..."
                                className="border rounded-lg px-4 py-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            />

                            <p className="text-xs text-gray-500 mt-1">
                                Enter multiple pincodes separated by comma.
                            </p>
                        </div>


                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                value={newWarehouse.contact || ""}
                                onChange={(e) => setNewWarehouse({ ...newWarehouse, contact: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>


                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddWarehouse}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Modal */}
            {/* {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Warehouse</h2>

                        <input
                            type="text"
                            placeholder="Warehouse Name"
                            value={editWarehouse.name}
                            onChange={(e) => setEditWarehouse({ ...editWarehouse, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={editWarehouse.state}
                            onChange={(e) => setEditWarehouse({ ...editWarehouse, state: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select State</option>
                            {states.map((s) => (
                                <option key={s.id} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Address"
                            value={editWarehouse.address}
                            onChange={(e) => setEditWarehouse({ ...editWarehouse, address: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Code"
                            value={editWarehouse.code}
                            onChange={(e) => setEditWarehouse({ ...editWarehouse, code: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={editWarehouse.pincode}
                            onChange={(e) => setEditWarehouse({ ...editWarehouse, pincode: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleUpdateWarehouse} className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Warehouse</h2>

                        {/* Edit Warehouse Form with labels */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Warehouse Name</label>
                            <input
                                type="text"
                                value={editWarehouse.name}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, name: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">State</label>
                            <select
                                value={editWarehouse.state}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, state: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={editWarehouse.address}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, address: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={editWarehouse.code}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, code: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Pincode</label>
                            <input
                                type="text"
                                value={editWarehouse.pincode}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, pincode: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div> */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">
                                Pincodes (comma separated)
                            </label>

                            <textarea
                                value={editWarehouse.pincode}
                                onChange={(e) =>
                                    setEditWarehouse({
                                        ...editWarehouse,
                                        pincode: e.target.value,
                                    })
                                }
                                placeholder="560001, 560002, 560003 ..."
                                className="border rounded-lg px-4 py-2 w-full h-32 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            />

                            <p className="text-xs text-gray-500 mt-1">
                                Enter multiple pincodes separated by comma or new line.
                            </p>
                        </div>


                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                value={editWarehouse.contact}
                                onChange={(e) => setEditWarehouse({ ...editWarehouse, contact: e.target.value })}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>


                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateWarehouse}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button onClick={() => setDeleteModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this warehouse?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleDeleteWarehouse} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default Warehouse;
