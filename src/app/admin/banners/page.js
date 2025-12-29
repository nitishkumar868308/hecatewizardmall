"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
    fetchStates,
} from "@/app/redux/slices/state/addStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { createBanner, fetchBanners, deleteBanner, updateBanner } from "@/app/redux/slices/banners/bannersSlice";
import { useCountries } from "@/lib/CustomHook/useCountries";

const BannerPage = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [editIndex, setEditIndex] = useState(null);
    const { states } = useSelector((state) => state.states);
    const { banners } = useSelector((state) => state.banner);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const { countries, filteredCountries, setFilteredCountries } = useCountries();
    console.log("banners", banners)
    console.log("countries", countries)
    const [platform, setPlatform] = useState({
        xpress: false,
        website: false,
    });
    const [countrySearch, setCountrySearch] = useState("");
    const [stateSearch, setStateSearch] = useState("");
    const [form, setForm] = useState({
        image: null,
        countries: [],
        states: [],
        text: "",
        active: true,
    });

    const [countryNumbers, setCountryNumbers] = useState({});
    const [stateNumbers, setStateNumbers] = useState({});

    const openAddModal = () => {
        setModalType("add");
        setEditIndex(null);
        setPlatform({ xpress: false, website: false });
        setForm({ image: null, countries: [], states: [], text: "", active: true });
        setCountryNumbers({});
        setStateNumbers({});
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        const banner = banners[index];
        setModalType("edit");
        setEditIndex(index);

        // Platform array
        const platformObj = {
            xpress: banner.platform.includes("xpress"),
            website: banner.platform.includes("website"),
        };
        setPlatform(platformObj);

        // Form state: only necessary fields + countries/states as code/id
        setForm({
            text: banner.text || "",
            active: banner.active,
            image: banner.image || null,
            countries: (banner.countries || []).map(c => c.countryCode),
            states: (banner.states || []).map(s => s.stateId),
        });

        // Positions
        const cNumbers = {};
        (banner.countries || []).forEach(c => {
            cNumbers[c.countryCode] = c.position;
        });
        setCountryNumbers(cNumbers);

        const sNumbers = {};
        (banner.states || []).forEach(s => {
            sNumbers[s.stateId] = s.position;
        });
        setStateNumbers(sNumbers);

        setIsModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchStates());
        dispatch(fetchBanners());
    }, [dispatch]);

    useEffect(() => {
        if (!countries) return;
        const filtered = countries.filter(c =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase())
        );
        setFilteredCountries(filtered);
    }, [countrySearch, countries, setFilteredCountries]);

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

    const handleSave = async () => {
        if (!form.countries.length && !form.states.length) {
            toast.error("Please select at least one country and state");
            return;
        }

        if (!platform.xpress && !platform.website) {
            toast.error("Please select at least one platform");
            return;
        }

        let imageUrl = null;

        if (form.image && typeof form.image !== "string") {
            imageUrl = await handleImageUpload(form.image);
        }



        const formData = new FormData();

        formData.append("text", form.text);
        formData.append("active", String(form.active));
        formData.append("platform", JSON.stringify(platform));
        formData.append("countries", JSON.stringify(form.countries));
        formData.append("states", JSON.stringify(form.states));
        formData.append("countryNumbers", JSON.stringify(countryNumbers));
        formData.append("stateNumbers", JSON.stringify(stateNumbers));

        if (imageUrl) {
            formData.append("image", imageUrl);
        } else if (typeof form.image === "string") {
            formData.append("image", form.image); // existing URL
        }

        try {
            if (modalType === "add") {
                await dispatch(createBanner(formData)).unwrap();
                toast.success("Banner created successfully");
            } else {
                formData.append("id", banners[editIndex].id);
                await dispatch(updateBanner(formData)).unwrap();
                toast.success("Banner updated successfully");
            }

            setIsModalOpen(false);
        } catch (err) {
            toast.error(err)
        }
    };

    const openDeleteModal = (banner) => {
        setSelectedBanner(banner);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedBanner) return;

        try {
            await dispatch(deleteBanner(selectedBanner.id)).unwrap();
            toast.success("Banner deleted");
            setIsDeleteModalOpen(false);
            setSelectedBanner(null);
        } catch (err) {
            toast.error("Failed to delete banner");
        }
    };

    const getTakenPositions = (idList, numbers, existingBanners, type, itemId) => {
        console.log("========== getTakenPositions ==========");
        console.log("Type:", type);
        console.log("ItemId:", itemId);
        console.log("Existing Banners:", existingBanners);
        console.log("Numbers (modal):", numbers);
        console.log("ID List:", idList);

        const existingPositions = existingBanners.flatMap((b, bannerIndex) => {
            console.log(`-- Banner ${bannerIndex} --`, b);

            const items = type === "country" ? b.countries : b.states;
            console.log(`Raw items for type '${type}':`, items);

            if (!items) return [];

            const filtered = items.filter((i, itemIndex) => {
                if (type === 'state') return i.stateId === itemId;
                if (type === 'country') return String(i.countryCode).trim().toUpperCase() === String(itemId).trim().toUpperCase();
            });

            console.log(`Filtered positions for this banner:`, filtered.map(i => i.position));

            return filtered.map(i => i.position);
        });

        const modalPositions = Object.entries(numbers)
            .filter(([key, val]) => key === itemId)
            .map(([key, val]) => val);

        const combinedPositions = [...new Set([...existingPositions, ...modalPositions])];
        console.log("Positions from existing banners:", existingPositions);
        console.log("Positions from modal numbers:", modalPositions);
        console.log("Combined taken positions:", combinedPositions);
        console.log("======================================");

        return combinedPositions;
    };




    const toggleSelect = (value, list, setList, numbers, setNumbers, type) => {
        if (list.includes(value)) {
            // Remove
            setList(list.filter(v => v !== value));
            const updatedNumbers = { ...numbers };
            delete updatedNumbers[value];
            setNumbers(updatedNumbers);
        } else {
            // Add
            const updatedList = [...list, value];

            // Important: pass updatedList
            const takenPositions = getTakenPositions(updatedList, numbers, banners, type, value);

            // Find next available position
            let newPosition = 1;
            while (takenPositions.includes(newPosition)) {
                newPosition++;
            }

            setList(updatedList);
            setNumbers({ ...numbers, [value]: newPosition });
        }
    };


    // 1. Create a map: stateId -> all assigned positions
    const statePositionMap = {};
    banners.forEach(banner => {
        (banner.states || []).forEach(s => {
            const stateName = s.state?.name || `State ${s.stateId}`;
            if (!statePositionMap[stateName]) statePositionMap[stateName] = [];
            statePositionMap[stateName].push(s.position);
        });
    });

    // 2. For each state, find missing positions
    const missingStateDetails = [];

    states.forEach(s => {
        const stateName = s.name;
        const assignedPositions = statePositionMap[stateName] || [];
        if (assignedPositions.length === 0) return; // skip if no banners yet

        const maxPos = Math.max(...assignedPositions);

        for (let i = 1; i <= maxPos; i++) {  // <-- 1 se start karenge
            if (!assignedPositions.includes(i)) {
                missingStateDetails.push({ position: i, name: stateName });
            }
        }
    });

    console.log(missingStateDetails);


    // Same for countries
    const countryPositions = banners.flatMap(b => b.countries.map(c => c.position));
    const maxCountryPosition = Math.max(...countryPositions, 0);
    const missingCountryPositions = [];
    for (let i = 1; i <= maxCountryPosition; i++) {
        if (!countryPositions.includes(i)) missingCountryPositions.push(i);
    }

    // Create a map: countryCode -> all assigned positions
    const countryPositionMap = {};
    banners.forEach(b => {
        (b.countries || []).forEach(c => {
            const countryName = countries.find(ct => ct.code === c.countryCode)?.name || c.countryCode;
            if (!countryPositionMap[countryName]) countryPositionMap[countryName] = [];
            countryPositionMap[countryName].push(c.position);
        });
    });

    // Find missing positions for each country
    const missingCountryDetails = [];
    Object.entries(countryPositionMap).forEach(([countryName, assignedPositions]) => {
        const maxPos = Math.max(...assignedPositions, 0);
        for (let i = 1; i <= maxPos; i++) { // 1 se max tak
            if (!assignedPositions.includes(i)) {
                missingCountryDetails.push({ position: i, name: countryName });
            }
        }
    });

    console.log("Missing country positions:", missingCountryDetails);

    const filteredBanners = banners.filter((b) => {
        // 🟢 Country filter
        if (selectedCountry) {
            return b.countries?.some(
                (c) => c.countryCode === selectedCountry
            );
        }

        // 🟢 State filter
        if (selectedState) {
            return b.states?.some(
                (s) => String(s.stateId) === String(selectedState)
            );
        }

        return true; // no filter
    });


    return (
        <DefaultPageAdmin>
            {/* HEADER */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Banners</h1>

                <div className="flex items-center gap-3">
                    {/* COUNTRY FILTER */}
                    {!selectedState && (
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="">Filter by Country</option>
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* STATE FILTER */}
                    {!selectedCountry && (
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="">Filter by State</option>
                            {states.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* CLEAR FILTER */}
                    {(selectedCountry || selectedState) && (
                        <button
                            onClick={() => {
                                setSelectedCountry("");
                                setSelectedState("");
                            }}
                            className="text-sm text-red-600 underline"
                        >
                            Clear
                        </button>
                    )}

                    {/* ADD BANNER */}
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        <Plus className="w-5 h-5" /> Add Banner
                    </button>
                </div>
            </div>


            {missingStateDetails.length > 0 && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
                    Missing state positions:{" "}
                    {missingStateDetails.map(d => `${d.position} (${d.name})`).join(", ")}
                </div>
            )}


            {missingCountryDetails.length > 0 && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
                    Missing country positions:{" "}
                    {missingCountryDetails
                        .map(d => `${d.position} (${d.name})`)
                        .join(", ")}
                </div>
            )}


            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs">S.no</th>
                            <th className="px-4 py-3 text-left text-xs">Image</th>
                            <th className="px-4 py-3 text-left text-xs">Platform</th>
                            <th className="px-4 py-3 text-left text-xs">Country</th>
                            <th className="px-4 py-3 text-left text-xs">States</th>
                            <th className="px-4 py-3 text-left text-xs">Text</th>
                            <th className="px-4 py-3 text-left text-xs">Status</th>
                            <th className="px-4 py-3 text-left text-xs">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBanners.map((b, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">{idx + 1} . </td>
                                <td className="px-4 py-3">
                                    {b.image && (
                                        <img
                                            src={b.image}
                                            className="w-20 h-20 object-cover rounded border"
                                            alt="banner"
                                        />
                                    )}
                                </td>

                                <td className="px-4 py-6 text-sm flex gap-2">
                                    {b.platform.includes("xpress") && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            Hecate QuickGo
                                        </span>
                                    )}
                                    {b.platform.includes("website") && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            Hecate Wizard Mall
                                        </span>
                                    )}
                                </td>


                                <td className="px-4 py-3">
                                    {b.countries
                                        ?.map((c) => {
                                            const country = countries.find((co) => co.code === c.countryCode);
                                            return `${country ? country.name : c.countryCode} (${c.position})`;
                                        })
                                        .join(", ")}
                                </td>


                                <td className="px-4 py-3">
                                    {b.states
                                        ?.map((s) => `${s.state?.name || s.stateId} (${s.position})`)
                                        .join(", ")}
                                </td>


                                <td className="px-4 py-3">{b.text}</td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${b.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {b.active ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-3">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => openEditModal(idx)}
                                            className="flex items-center gap-1 text-blue-600  cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>

                                        <button
                                            onClick={() => openDeleteModal(b)}
                                            className="flex items-center gap-1 text-red-600  cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredBanners.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-400">
                                    No banners found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            {modalType === "add" ? "Add Banner" : "Edit Banner"}
                        </Dialog.Title>

                        {/* PLATFORM */}
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                                Select Platform
                            </p>
                            <div className="flex justify-center gap-10">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={platform.xpress}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, xpress: e.target.checked })
                                        }
                                    />
                                    Hecate QuickGo
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={platform.website}
                                        onChange={(e) =>
                                            setPlatform({ ...platform, website: e.target.checked })
                                        }
                                    />
                                    Hecate Wizard Mall
                                </label>
                            </div>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Banner Image
                            </label>

                            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-36 cursor-pointer hover:border-blue-400 transition">
                                {form.image ? (
                                    typeof form.image === "string" ? (
                                        <img
                                            src={form.image}
                                            className="h-full object-contain rounded"
                                            alt="preview"
                                        />
                                    ) : (
                                        <img
                                            src={URL.createObjectURL(form.image)}
                                            className="h-full object-contain rounded"
                                            alt="preview"
                                        />
                                    )
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Click to upload banner image</p>
                                        <p className="text-xs">(PNG, JPG, WEBP)</p>
                                    </div>
                                )}


                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setForm({ ...form, image: e.target.files[0] })
                                    }
                                />
                            </label>
                        </div>

                        {/* COUNTRY & STATE */}
                        <div className="grid grid-cols-2 gap-4 mb-4">

                            {/* COUNTRIES */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">Countries</label>
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    className="border rounded px-2 py-1 w-full mb-2"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                />
                                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                                    {filteredCountries
                                        .filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                                        .map((c) => (
                                            <div key={c.code} className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="checkbox"
                                                    checked={form.countries.includes(c.code)}
                                                    onChange={() => toggleSelect(
                                                        c.code,
                                                        form.countries,
                                                        (val) => setForm({ ...form, countries: val }),
                                                        countryNumbers,
                                                        setCountryNumbers,
                                                        "country",
                                                        banners
                                                    )}
                                                />
                                                <span>{c.name}</span>
                                                {form.countries.includes(c.code) && (
                                                    <input
                                                        type="number"
                                                        className="border rounded px-2 py-1 w-16"
                                                        value={countryNumbers[c.code] || 1}
                                                        onChange={(e) =>
                                                            setCountryNumbers({
                                                                ...countryNumbers,
                                                                [c.code]: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {/* Selected Countries BELOW the box */}
                                {form.countries.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-semibold text-gray-700">Selected Countries:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {form.countries.map((c, idx) => {
                                                const countryCode = typeof c === "string" ? c : c.countryCode;
                                                const country = countries.find((ct) => ct.code === countryCode);

                                                return (
                                                    <span
                                                        key={`${countryCode}-${idx}`} // unique key
                                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                                                    >
                                                        {country?.name || countryCode} ({countryNumbers[countryCode]})
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* STATES */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">States</label>
                                <input
                                    type="text"
                                    placeholder="Search states..."
                                    className="border rounded px-2 py-1 w-full mb-2"
                                    value={stateSearch}
                                    onChange={(e) => setStateSearch(e.target.value)}
                                />
                                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                                    {states
                                        .filter((s) => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                        .map((s) => (
                                            <div key={s.id} className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="checkbox"
                                                    checked={form.states.includes(s.id)}
                                                    onChange={() => toggleSelect(
                                                        s.id,
                                                        form.states,
                                                        (val) => setForm({ ...form, states: val }),
                                                        stateNumbers,
                                                        setStateNumbers,
                                                        "state",
                                                        banners
                                                    )}
                                                />
                                                <span>{s.name}</span>
                                                {form.states.includes(s.id) && (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="border rounded px-2 py-1 w-16"
                                                        value={stateNumbers[s.id] || 1}
                                                        onChange={(e) =>
                                                            setStateNumbers({
                                                                ...stateNumbers,
                                                                [s.id]: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {/* Selected States BELOW the box */}
                                {form.states.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-semibold text-gray-700">Selected States:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {states
                                                .filter((s) => form.states.includes(s.id))
                                                .map((s) => (
                                                    <span
                                                        key={s.id}
                                                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                                                    >
                                                        {s.name} ({stateNumbers[s.id]})
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>




                        {/* TEXT & STATUS */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Banner Text</label>
                                <textarea
                                    className="border rounded px-3 py-2 w-full"
                                    rows={3}
                                    placeholder="Enter banner text"
                                    value={form.text}
                                    onChange={(e) =>
                                        setForm({ ...form, text: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Status</label>
                                <select
                                    className="border rounded px-3 py-2 w-full"
                                    value={form.active ? "active" : "inactive"}
                                    onChange={(e) =>
                                        setForm({ ...form, active: e.target.value === "active" })
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="border px-4 py-2 rounded cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                    </Dialog.Panel>


                </div>
            </Dialog>

            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6">
                        <Dialog.Title className="text-lg font-bold mb-4">Confirm Delete</Dialog.Title>
                        <p className="mb-4">Are you sure you want to delete this banner?</p>

                        {/* Countries */}
                        {/* Countries */}
                        {selectedBanner?.countries?.length > 0 && (
                            <div className="mb-3">
                                <p className="font-semibold">Countries:</p>
                                <ul className="ml-4">
                                    {selectedBanner.countries.map((c) => {
                                        const country = countries.find((co) => co.code === c.countryCode);
                                        return (
                                            <li key={c.id}>
                                                {country ? country.name : c.countryCode} (Position: {c.position})
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}


                        {/* States */}
                        {selectedBanner?.states?.length > 0 && (
                            <div className="mb-3">
                                <p className="font-semibold">States:</p>
                                <ul className="ml-4">
                                    {selectedBanner.states.map((s) => (
                                        <li key={s.id}>
                                            {s.state?.name || s.stateId} (Position: {s.position})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="border px-4 py-2 rounded cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </DefaultPageAdmin >
    );
};

export default BannerPage;
