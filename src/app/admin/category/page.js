"use client";
import { useState, useRef, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/app/redux/slices/addCategory/addCategorySlice";
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Image from "next/image";
import Loader from "@/components/Include/Loader";

const AddCategory = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState({
        id: null, name: "", image: null, platform: { xpress: false, website: false },
        stateIds: [],
    });
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [platform, setPlatform] = useState({
        xpress: false,
        website: false,
    });
    const [selectedState, setSelectedState] = useState("");
    const [selectedStates, setSelectedStates] = useState([]);
    const { states } = useSelector((state) => state.states);
    console.log("categories", categories)
    useEffect(() => {
        dispatch(fetchCategories());
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
        if (file) {
            setNewCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCategoryImage(file);
            setEditCategory({
                ...editCategory,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };



    // const handleAddCategory = async () => {
    //     if (!newCategory.trim()) {
    //         toast.error("Category name cannot be empty");
    //         return;
    //     }
    //     try {
    //         await dispatch(createCategory({ name: newCategory.trim(), active: true })).unwrap();
    //         toast.success("Category added successfully");
    //         setNewCategory("");
    //         setModalOpen(false);
    //     } catch (err) {
    //         toast.error(err.message || "Failed to add category");
    //     }
    // };

    // const handleImageUpload = async (file) => {
    //     if (!file) throw new Error('No file provided');

    //     try {
    //         const url = await uploadToCloudinary(file, 'products');
    //         return url;
    //     } catch (err) {
    //         console.error('Upload failed:', err);
    //         throw err;
    //     }
    // };
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        return data.urls;
    };


    const handleAddCategory = async () => {
        if (!newCategory.trim()) return toast.error("Category name cannot be empty");
        if (!platform.xpress && !platform.website) {
            return toast.error("Please select at least one platform");
        }
        setLoading(true);
        let imageUrl = null;
        if (newCategoryImage) {
            imageUrl = await handleImageUpload(newCategoryImage);
        }


        try {
            await dispatch(createCategory({
                name: newCategory.trim(), active: true, image: imageUrl, platform: [
                    ...(platform.xpress ? ["xpress"] : []),
                    ...(platform.website ? ["website"] : [])
                ], stateIds: selectedStates
            })).unwrap();
            toast.success("Category added successfully");
            await fetchCategories();
            setNewCategory("");
            setNewCategoryImage(null);
            setImagePreview(null);
            setSelectedState("");
            setPlatform({ xpress: false, website: false });
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };


    // const handleEditCategory = async () => {
    //     if (!editCategory.name.trim()) {
    //         toast.error("Category name cannot be empty");
    //         return;
    //     }
    //     setLoading(true);
    //     let imageUrl = editCategory.image ?? null;

    //     if (newCategoryImage) {
    //         imageUrl = await handleImageUpload(newCategoryImage);
    //     }

    //     try {
    //         await dispatch(
    //             updateCategory({
    //                 id: editCategory.id,
    //                 name: editCategory.name,
    //                 image: imageUrl,
    //             })
    //         ).unwrap();

    //         toast.success("Category updated successfully");
    //         setEditModalOpen(false);
    //         setEditCategory({});
    //     } catch (err) {
    //         toast.error(err.message || "Failed to update category");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleEditCategory = async () => {
        if (!editCategory.name.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        if (!editCategory.platform.xpress && !editCategory.platform.website) {
            toast.error("Select at least one platform");
            return;
        }

        setLoading(true);

        let imageUrl = editCategory.image ?? null;

        if (newCategoryImage) {
            imageUrl = await handleImageUpload(newCategoryImage);
        }

        const platformToSend = editCategory.platform
            ? [
                ...(editCategory.platform.xpress ? ["xpress"] : []),
                ...(editCategory.platform.website ? ["website"] : [])
            ]
            : editCategory.platform; // fallback

        try {
            await dispatch(updateCategory({
                id: editCategory.id,
                name: editCategory.name,
                image: imageUrl,
                platform: platformToSend,
                stateIds: editCategory.stateIds
            })).unwrap();

            toast.success("Category updated successfully");
            setEditModalOpen(false);
            setEditCategory({ id: null, name: "", image: null, imageFile: null, platform: { xpress: false, website: false }, stateId: null });
        } catch (err) {
            toast.error(err.message || "Failed to update category");
        } finally {
            setLoading(false);
        }
    };


    const toggleActive = async (id, currentActive) => {
        setLoading(true);
        try {
            await dispatch(updateCategory({ id, active: !currentActive })).unwrap();
            toast.success("Category status updated");
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await dispatch(deleteCategory(deleteCategoryId)).unwrap();
            toast.success("Category deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete category");
        }
        finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    // console.log("filteredCategories", filteredCategories)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // console.log("baseUrl" , baseUrl)

    // console.log("Image Preview URL =>", newCategoryImage
    //     ? URL.createObjectURL(newCategoryImage)
    //     : editCategory.image?.startsWith("http")
    //         ? editCategory.image
    //         : `${baseUrl}/uploads/${editCategory.image}`);
    const imageSrc = newCategoryImage
        ? URL.createObjectURL(newCategoryImage) // preview before upload
        : editCategory.image;                    // already like /uploads/filename.jpg

    console.log("Image URL =>", imageSrc);

    const openAddModal = () => {
        setPlatform({ xpress: false, website: false }); // reset
        setNewCategory("");
        setNewCategoryImage(null);
        setSelectedState("");
        setModalOpen(true);
    };

    const openEditModal = (c) => {
        setEditCategory({
            id: c.id,
            name: c.name,
            image: c.image || null,
            imageFile: null,
            platform: {
                xpress: c.platform?.includes("xpress") || false,
                website: c.platform?.includes("website") || false
            },
            stateIds: c.states?.map(s => s.id) || []
        });
        setEditModalOpen(true);
    };
    return (
        <DefaultPageAdmin>
            {loading && <Loader />}
            {/* Header + Search + Add Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <div className="flex gap-2 flex-wrap md:flex-nowrap items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        //onClick={() => setModalOpen(true)}
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Add Category
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Platform
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.map((c, idx) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                                        {idx + 1}.
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {c.image ? (
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={encodeURI(c.image.startsWith("http") ? c.image : `${baseUrl}${c.image}`)}
                                                    alt={c.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td>


                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                        <div className="flex gap-2">
                                            {c.platform?.map((p) => (
                                                <span
                                                    key={p}
                                                    className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                                                >
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={c.active}
                                                onChange={() => toggleActive(c.id, c.active)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${c.active ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <span
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${c.active ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                />
                                            </span>
                                            <span
                                                className={`ml-3 text-sm font-medium ${c.active ? "text-green-600" : "text-gray-500"
                                                    }`}
                                            >
                                                {c.active ? "Active" : "Inactive"}
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                // onClick={() => {
                                                //     setEditCategory({
                                                //         id: c.id,
                                                //         name: c.name,
                                                //         image: c.image || null,
                                                //         platform: c.platform,
                                                //         stateId: c.stateId,
                                                //     });
                                                //     setPlatform({
                                                //         xpress: c.platform?.includes("xpress"),
                                                //         website: c.platform?.includes("website"),
                                                //     });
                                                //     setNewCategoryImage(null);
                                                //     setEditModalOpen(true);
                                                // }}
                                                onClick={() => openEditModal(c)}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteCategoryId(c.id); setDeleteModalOpen(true); }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                                        No categories found
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
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Category</h2>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mb-4 w-32 h-32 object-cover rounded-lg" />
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-7 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            Add New Category
                        </h2>

                        {/* PLATFORM SECTION */}
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
                                    <span>Hecate QuickGo</span>
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
                                    <span>Hecate Wizard Mall</span>
                                </label>

                            </div>
                        </div>

                        {/* CATEGORY NAME */}
                        <div className="mb-6">
                            <label className="block font-medium mb-2 text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="border rounded-lg px-4 py-2 w-full 
                    focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-6">
                            <label className="block font-medium mb-2 text-gray-700">
                                Upload Image
                            </label>

                            <label
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 
                    flex flex-col items-center justify-center text-gray-500 cursor-pointer
                    hover:border-gray-500 transition"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {!imagePreview && (
                                    <>
                                        <span className="text-gray-600 font-medium mb-1">
                                            Click to upload
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            PNG / JPG (Max 5MB)
                                        </span>
                                    </>
                                )}

                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 w-32 h-32 object-cover rounded-lg shadow"
                                    />
                                )}
                            </label>
                        </div>

                        {/* STATE DROPDOWN */}
                        {/* <div className="mb-3">
                            <label className="block font-medium mb-2 text-gray-700">
                                Select State
                            </label>

                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(Number(e.target.value))}
                                className="border rounded-lg px-4 py-2 w-full
                    focus:outline-none focus:ring-2 focus:ring-gray-700"
                            >
                                <option value="">-- Select State --</option>
                                {states.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="mb-3 relative" ref={dropdownRef}>
                            <label className="block font-medium mb-2 text-gray-700">
                                Select States
                            </label>
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
                                        : "-- Select State --"}
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
                        <div className="flex justify-end gap-3 mt-7">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border text-gray-700 
                    hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddCategory}
                                className="px-5 py-2 rounded-lg bg-gray-800 text-white 
                    hover:bg-gray-900 transition shadow"
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>

                    </div>
                </div>
            )}




            {/* Edit Modal */}
            {/* {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Edit Category</h2>

                        
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={editCategory.name}
                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                            className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="border rounded-lg px-4 py-2 w-full mb-4"
                        />

                        {/* {newCategoryImage ? (
                            <div className="text-sm text-gray-700 mb-2">{newCategoryImage.name}</div>
                        ) : editCategory.image ? (
                            <div className="text-sm text-gray-700 mb-2">
                                {editCategory.image.split('/').pop()}
                            </div>
                        ) : null}

                        {editCategory.image || newCategoryImage ? (
                            <div className="mb-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={
                                            newCategoryImage
                                                ? URL.createObjectURL(newCategoryImage)
                                                : editCategory.image?.startsWith("http")
                                                    ? editCategory.image
                                                    : `${baseUrl}${editCategory.image}`
                                        }
                                        alt={editCategory.name || "Category"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-400 italic mb-4 block">No Image</span>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditCategory}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-7 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            Edit Category
                        </h2>

                        {/* PLATFORM */}
                        <div className="mb-6">
                            <p className="font-semibold mb-3 text-center text-gray-700">Select Platform</p>
                            <div className="flex items-center justify-center gap-10">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={editCategory.platform.xpress}
                                        onChange={(e) => setEditCategory(prev => ({ ...prev, platform: { ...prev.platform, xpress: e.target.checked } }))}
                                        className="w-4 h-4"
                                    />
                                    <span>Hecate QuickGo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={editCategory.platform.website}
                                        onChange={(e) => setEditCategory(prev => ({ ...prev, platform: { ...prev.platform, website: e.target.checked } }))}
                                        className="w-4 h-4"
                                    />
                                    <span>Hecate Wizard Mall</span>
                                </label>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2 text-gray-700">Category Name</label>
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory(prev => ({ ...prev, name: e.target.value }))}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2 text-gray-700">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageChange}
                                className="border rounded-lg px-4 py-2 w-full mb-4"
                            />

                            {newCategoryImage ? (
                                <div className="text-sm text-gray-700 mb-2">{newCategoryImage.name}</div>
                            ) : editCategory.image ? (
                                <div className="text-sm text-gray-700 mb-2">
                                    {editCategory.image.split('/').pop()}
                                </div>
                            ) : null}

                            {editCategory.image || newCategoryImage ? (
                                <div className="mb-4">
                                    <div className="relative w-24 h-24">
                                        <Image
                                            src={
                                                newCategoryImage
                                                    ? URL.createObjectURL(newCategoryImage)
                                                    : editCategory.image?.startsWith("http")
                                                        ? editCategory.image
                                                        : `${baseUrl}${editCategory.image}`
                                            }
                                            alt={editCategory.name || "Category"}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic mb-4 block">No Image</span>
                            )}
                        </div>

                        {/* State Dropdown */}
                        {/* <div className="mb-4">
                            <label className="block font-medium mb-2 text-gray-700">Select State</label>
                            <select
                                value={editCategory.stateId || ""}
                                onChange={(e) => setEditCategory(prev => ({ ...prev, stateId: Number(e.target.value) }))}
                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">-- Select State --</option>
                                {states.map(st => (
                                    <option key={st.id} value={st.id}>{st.name}</option>
                                ))}
                            </select>
                        </div> */}
                        {/* Multi-State Dropdown */}
                        <div className="mb-4 relative" ref={editDropdownRef}>
                            <label className="block font-medium mb-2 text-gray-700">Select States</label>

                            {/* Selected Values Box */}
                            <div
                                className="border rounded-lg px-4 py-2 w-full cursor-pointer flex justify-between items-center"
                                onClick={() => setEditStateOpen(!editStateOpen)}
                            >
                                <span>
                                    {editCategory.stateIds?.length > 0
                                        ? states
                                            .filter((s) => editCategory.stateIds.includes(s.id))
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
                                                checked={editCategory.stateIds?.includes(st.id)}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    setEditCategory((prev) => ({
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


                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditCategory}
                                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg transition"
                            >
                                {loading ? "Updating..." : "Update"}
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
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this category?</p>
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

export default AddCategory;
