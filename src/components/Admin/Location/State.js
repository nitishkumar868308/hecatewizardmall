"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchStates,
    createState,
    updateState,
    deleteState,
} from "@/app/redux/slices/state/addStateSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "@/components/Include/Loader";

const StatePage = () => {
    const dispatch = useDispatch();
    const { states } = useSelector((state) => state.states);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [newState, setNewState] = useState("");
    const [editState, setEditState] = useState({ id: null, name: "" });
    const [deleteId, setDeleteId] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchStates());
    }, [dispatch]);

    const handleAddState = async () => {
        if (!newState.trim()) return toast.error("State name cannot be empty");

        setLoading(true);

        try {
            await dispatch(createState({ name: newState.trim(), active: true })).unwrap();
            toast.success("State added successfully");
            setNewState("");
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add state");
        } finally {
            setLoading(false);
        }
    };

    const handleEditState = async () => {
        if (!editState.name.trim()) {
            toast.error("State name cannot be empty");
            return;
        }

        setLoading(true);

        try {
            await dispatch(
                updateState({
                    id: editState.id,
                    name: editState.name,
                })
            ).unwrap();

            toast.success("State updated successfully");
            setEditModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update state");
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id, active) => {
        setLoading(true);

        try {
            await dispatch(updateState({ id, active: !active })).unwrap();
            toast.success("Status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteState = async () => {
        setLoading(true);

        try {
            await dispatch(deleteState(deleteId)).unwrap();
            toast.success("State deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete state");
        } finally {
            setLoading(false);
        }
    };

    const filteredStates = states.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            {loading && <Loader />}

            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">States</h1>

                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-grat-800 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add State
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    State Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStates.map((s, idx) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4 font-medium">{s.name}</td>

                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={s.active}
                                                onChange={() => toggleActive(s.id, s.active)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${s.active ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${s.active ? "translate-x-6" : ""
                                                        }`}
                                                ></span>
                                            </span>
                                            <span className={`ml-3 text-sm font-medium`}>
                                                {s.active ? "Active" : "Inactive"}
                                            </span>
                                        </label>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditState({
                                                        id: s.id,
                                                        name: s.name,
                                                    });
                                                    setEditModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteId(s.id);
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

                            {filteredStates.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-6 text-gray-500 italic"
                                    >
                                        No States Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Add State</h2>

                        <input
                            type="text"
                            placeholder="State Name"
                            value={newState}
                            onChange={(e) => setNewState(e.target.value)}
                            className="border px-4 py-2 w-full rounded-lg mb-4 "
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="border px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddState}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Edit State</h2>

                        <input
                            type="text"
                            placeholder="State Name"
                            value={editState.name}
                            onChange={(e) =>
                                setEditState({ ...editState, name: e.target.value })
                            }
                            className="border px-4 py-2 w-full rounded-lg mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="border px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleEditState}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
                        <h2 className="text-xl font-bold mb-4">Delete State?</h2>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this state?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteState}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default StatePage;
