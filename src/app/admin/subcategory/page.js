"use client";
import { useState, useRef, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from "@/app/redux/slices/subcategory/subcategorySlice";
import { fetchCategories } from "@/app/redux/slices/addCategory/addCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";
import { fetchOffers } from '@/app/redux/slices/offer/offerSlice'
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";

const AddSubcategory = () => {
    const dispatch = useDispatch();
    const { subcategories, loading } = useSelector((state) => state.subcategory);
    const { categories } = useSelector((state) => state.category);
    console.log("subcategories", subcategories)
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: "" });
    const [editSubcategory, setEditSubcategory] = useState({});
    const [deleteSubcategoryId, setDeleteSubcategoryId] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const { offers } = useSelector((state) => state.offers);
    const [platform, setPlatform] = useState({
        xpress: false,
        website: false,
    });
    const [selectedState, setSelectedState] = useState("");
    const [selectedStates, setSelectedStates] = useState([]);
    const { states } = useSelector((state) => state.states);
    console.log("categories", categories)
    useEffect(() => {
        dispatch(fetchSubcategories());
        dispatch(fetchCategories());
        dispatch(fetchOffers())
        dispatch(fetchStates());
    }, [dispatch]);

    const dropdownRef = useRef(null);
    const [open, setOpen] = useState(false);
    const editDropdownRef = useRef(null);
    const [editStateOpen, setEditStateOpen] = useState(false);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleState = (id) => {
        if (selectedStates.includes(id)) {
            setSelectedStates(selectedStates.filter((s) => s !== id));
        } else {
            setSelectedStates([...selectedStates, id]);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setNewImage(file);
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        console.log("data", data)

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return data.urls;
    };


    const handleAddSubcategory = async () => {
        if (!newSubcategory.name.trim() || !newSubcategory.categoryId)
            return toast.error("Name and category are required");
        if (!platform.xpress && !platform.website) {
            return toast.error("Please select at least one platform");
        }
        let imageUrl = null;
        if (newImage) {
            imageUrl = await handleImageUpload(newImage);
        }

        const platformArray = Object.entries(platform)
            .filter(([key, value]) => value)
            .map(([key]) => key);

        try {
            await dispatch(
                createSubcategory({
                    name: newSubcategory.name.trim(),
                    categoryId: parseInt(newSubcategory.categoryId),
                    image: imageUrl,
                    active: true,
                    offerId: newSubcategory.offerId ? parseInt(newSubcategory.offerId) : null,
                    platform: platformArray,         // <-- FIXED
                    states: selectedStates,          // <-- FIXED
                })
            ).unwrap();
            toast.success("Subcategory added successfully");
            setNewSubcategory({ name: "", categoryId: "", offerId: "" });
            setNewImage(null);
            setPlatform({ xpress: false, website: false });
            setSelectedStates([]);
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add subcategory");
        }
    };

    const handleEditSubcategoryFunc = async () => {
        if (!editSubcategory.name.trim() || !editSubcategory.categoryId)
            return toast.error("Name and category are required");
        if (!editSubcategory.platform.xpress && !editSubcategory.platform.website) {
            toast.error("Select at least one platform");
            return;
        }
        let imageUrl = editSubcategory.image ?? null;
        if (newImage) imageUrl = await handleImageUpload(newImage);

        try {
            await dispatch(
                updateSubcategory({
                    id: editSubcategory.id,
                    name: editSubcategory.name.trim(),
                    categoryId: parseInt(editSubcategory.categoryId),
                    image: imageUrl,
                    active: editSubcategory.active,
                    offerId: editSubcategory.offerId ? parseInt(editSubcategory.offerId) : null,
                    platform: editSubcategory.platform,
                    stateIds: editSubcategory.stateIds,
                })
            ).unwrap();
            toast.success("Subcategory updated successfully");
            setEditModalOpen(false);
            setEditSubcategory({});
            setNewImage(null);
        } catch (err) {
            toast.error(err.message || "Failed to update subcategory");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteSubcategory(deleteSubcategoryId)).unwrap();
            toast.success("Subcategory deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete subcategory");
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            await dispatch(updateSubcategory({ id, active: !currentActive })).unwrap();
            toast.success("Subcategory status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const filteredSubcategories = subcategories.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );


    console.log("filteredSubcategories", filteredSubcategories)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const openAddModal = () => {
        setPlatform({ xpress: false, website: false });
        setNewSubcategory({ name: "", categoryId: "", offerId: "" });
        setNewImage(null);
        setSelectedStates([]);
        setModalOpen(true);
    };


    const openEditModal = (s) => {
        setEditSubcategory({
            id: s.id,
            name: s.name,
            image: s.image || null,
            imageFile: null,
            categoryId: s.categoryId,
            platform: {
                xpress: s.platform?.includes("xpress") || false,
                website: s.platform?.includes("website") || false
            },
            stateIds: s.states?.map(st => st.id) || []
        });
        setEditModalOpen(true);
    };
    return (
        <DefaultPageAdmin>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search subcategories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        // onClick={() => setModalOpen(true)}
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Subcategory
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubcategories.map((s, idx) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        {s.image ? (
                                            <div className="relative w-15 h-15">
                                                <Image
                                                    src={s.image}
                                                    alt={s.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {s.image && s.image !== "/" ? (
                                            <div className="relative w-15 h-15">
                                                <Image
                                                    src={
                                                        s.image.startsWith("http")
                                                            ? s.image
                                                            : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${s.image.startsWith("/") ? "" : "/"
                                                            }${s.image}`
                                                    }
                                                    alt={s.name || "Subcategory"}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}

                                    </td>


                                    <td className="px-6 py-4">{s.name}</td>
                                    <td className="px-6 py-4">{categories.find(c => c.id === s.categoryId)?.name || "-"}</td>
                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={s.active}
                                                onChange={() => toggleActive(s.id, s.active)}
                                                className="sr-only"
                                            />
                                            <span className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${s.active ? "bg-green-500" : "bg-gray-300"}`}>
                                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${s.active ? "translate-x-6" : "translate-x-0"}`} />
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <div className="flex gap-3">
                                            <button
                                                // onClick={() => {
                                                //     setEditSubcategory({
                                                //         ...s
                                                //     });
                                                //     setNewImage(null);
                                                //     setEditModalOpen(true);
                                                // }}
                                                onClick={() => openEditModal(s)}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteSubcategoryId(s.id); setDeleteModalOpen(true); }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubcategories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No subcategories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-center">Add New Subcategory</h2>

                        {/* PLATFORM */}
                        <div className="mb-6">
                            <p className="font-semibold mb-3 text-center text-gray-700">
                                Select Platform
                            </p>

                            <div className="flex items-center justify-center gap-10">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={platform.xpress}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, xpress: e.target.checked })
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>Xpress</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={platform.website}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, website: e.target.checked })
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>Website</span>
                                </label>
                            </div>
                        </div>

                        {/* SUBCATEGORY NAME */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Subcategory Name</label>
                            <input
                                type="text"
                                placeholder="Enter subcategory name"
                                value={newSubcategory.name}
                                onChange={(e) =>
                                    setNewSubcategory({ ...newSubcategory, name: e.target.value })
                                }
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>

                        {/* CATEGORY SELECT */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Select Category</label>
                            <select
                                value={newSubcategory.categoryId}
                                onChange={(e) =>
                                    setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })
                                }
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border rounded-lg px-4 py-2 w-full"
                            />
                        </div>

                        {/* OFFER SELECT */}
                        {/* <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Select Offer (Optional)</label>
                            <select
                                value={newSubcategory.offerId || ""}
                                onChange={(e) =>
                                    setNewSubcategory({ ...newSubcategory, offerId: e.target.value })
                                }
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                <option value="">-- Select Offer --</option>
                                {offers
                                    .filter((offer) => offer.type.includes("Subcategory") && offer.active)
                                    .map((offer) => (
                                        <option key={offer.id} value={offer.id}>
                                            {offer.name} (
                                            {offer.discountType === "percentage"
                                                ? `${offer.discountValue.percent}%`
                                                : offer.discountType === "buyXGetY"
                                                    ? `Buy ${offer.discountValue.buy} Get ${offer.discountValue.free}`
                                                    : "Offer"}
                                            )
                                        </option>
                                    ))}
                            </select>
                        </div> */}

                        {/* STATE SELECTOR */}
                        <div className="mb-4 relative" ref={dropdownRef}>
                            <label className="block font-medium text-gray-700 mb-2">Select States</label>

                            <div
                                className="border rounded-lg px-4 py-2 w-full cursor-pointer flex justify-between items-center"
                                onClick={() => setOpen(!open)}
                            >
                                <span>
                                    {selectedStates.length > 0
                                        ? states
                                            .filter((s) => selectedStates.includes(s.id))
                                            .map((s) => s.name)
                                            .join(", ")
                                        : "-- Select States --"}
                                </span>
                                <span>▾</span>
                            </div>

                            {open && (
                                <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {states.map((st) => (
                                        <label
                                            key={st.id}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={st.id}
                                                checked={selectedStates.includes(st.id)}
                                                onChange={() => toggleState(st.id)}
                                                className="h-4 w-4"
                                            />
                                            {st.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubcategory}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Subcategory</h2>

                        {/* PLATFORM */}
                        <div className="mb-6">
                            <p className="font-semibold mb-3 text-center text-gray-700">Select Platform</p>
                            <div className="flex items-center justify-center gap-10">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={editSubcategory.platform.xpress}
                                        onChange={(e) => setEditSubcategory(prev => ({ ...prev, platform: { ...prev.platform, xpress: e.target.checked } }))}
                                        className="w-4 h-4"
                                    />
                                    <span>Xpress</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={editSubcategory.platform.website}
                                        onChange={(e) => setEditSubcategory(prev => ({ ...prev, platform: { ...prev.platform, website: e.target.checked } }))}
                                        className="w-4 h-4"
                                    />
                                    <span>Website</span>
                                </label>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Subcategory Name"
                            value={editSubcategory.name || ""}
                            onChange={(e) =>
                                setEditSubcategory({ ...editSubcategory, name: e.target.value })
                            }
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            value={editSubcategory.categoryId || ""}
                            onChange={(e) =>
                                setEditSubcategory({ ...editSubcategory, categoryId: e.target.value })
                            }
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        {/* Image Preview */}
                        {(editSubcategory.image || newImage) && (
                            <div className="mb-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={
                                            newImage
                                                ? URL.createObjectURL(newImage)
                                                : editSubcategory.image?.startsWith("http")
                                                    ? editSubcategory.image
                                                    : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${editSubcategory.image}`
                                        }
                                        alt={editSubcategory.name || "Subcategory"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        <select
                            value={editSubcategory.offerId || ""}
                            onChange={(e) =>
                                setEditSubcategory({ ...editSubcategory, offerId: e.target.value })
                            }
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Offer (Optional)</option>
                            {offers
                                .filter((offer) => offer.type.includes("Subcategory") && offer.active)
                                .map((offer) => (
                                    <option key={offer.id} value={offer.id}>
                                        {offer.name} (
                                        {offer.discountType === "percentage"
                                            ? `${offer.discountValue.percent}%`
                                            : offer.discountType === "buyXGetY"
                                                ? `Buy ${offer.discountValue.buy} Get ${offer.discountValue.free}`
                                                : "Offer"}
                                        )
                                    </option>
                                ))}
                        </select>

                        {/* Multi-State Dropdown */}
                        <div className="mb-4 relative" ref={editDropdownRef}>
                            <label className="block font-medium mb-2 text-gray-700">Select States</label>

                            {/* Selected Values Box */}
                            <div
                                className="border rounded-lg px-4 py-2 w-full cursor-pointer flex justify-between items-center"
                                onClick={() => setEditStateOpen(!editStateOpen)}
                            >
                                <span>
                                    {editSubcategory.stateIds?.length > 0
                                        ? states
                                            .filter((s) => editSubcategory.stateIds.includes(s.id))
                                            .map((s) => s.name)
                                            .join(", ")
                                        : "-- Select State --"}
                                </span>
                                <span>▾</span>
                            </div>

                            {/* Dropdown Options */}
                            {editStateOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                                    {states.map((st) => (
                                        <div key={st.id} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                value={st.id}
                                                checked={editSubcategory.stateIds?.includes(st.id)}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    setEditSubcategory((prev) => ({
                                                        ...prev,
                                                        stateIds: e.target.checked
                                                            ? [...prev.stateIds, value]
                                                            : prev.stateIds.filter((id) => id !== value),
                                                    }));
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <span>{st.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubcategoryFunc}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this subcategory?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
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

export default AddSubcategory;
