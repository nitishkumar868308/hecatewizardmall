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

const BannerPage = () => {
    const dispatch = useDispatch();
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [editIndex, setEditIndex] = useState(null);
    const { states } = useSelector((state) => state.states);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState(countries);
    console.log("states", states)
    console.log("countries", countries)
    const [platform, setPlatform] = useState({
        xpress: false,
        website: false,
    });
    const [countrySearch, setCountrySearch] = useState("");  // ✅ Add this
    const [stateSearch, setStateSearch] = useState("");
    const [form, setForm] = useState({
        image: null,
        countries: [], // multi-select
        states: [], // multi-select
        text: "",
        active: true,
    });

    // Each selected country/state will have a number field
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
        setPlatform(banner.platform);
        setForm(banner);
        setCountryNumbers(banner.countryNumbers || {});
        setStateNumbers(banner.stateNumbers || {});
        setIsModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchStates());
    }, [dispatch]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=cca3,name,currencies");
                const data = await res.json();
                console.log("data", data);

                if (!Array.isArray(data)) {
                    console.error("Expected an array but got:", data);
                    return;
                }

                const formatted = data.map((c) => {
                    const currencyKey = c.currencies ? Object.keys(c.currencies)[0] : null;
                    const currencySymbol =
                        c.currencies && currencyKey && c.currencies[currencyKey]?.symbol
                            ? c.currencies[currencyKey].symbol
                            : ""; // fallback to empty string if not available

                    return {
                        code: c.cca3,
                        name: c.name?.common || "",
                        currency: currencyKey || "",
                        currencySymbol,
                    };
                })

                setCountries(formatted);
                setFilteredCountries(formatted);
            } catch (err) {
                console.error("Failed to fetch countries:", err);
            }
        };

        fetchCountries();
    }, []);

    const handleSave = () => {
        if (!form.countries.length || !form.states.length) {
            toast.error("Please select at least one country and state");
            return;
        }

        const newBanner = {
            ...form,
            platform,
            countryNumbers,
            stateNumbers
        };

        if (modalType === "add") {
            setBanners([...banners, newBanner]);
            toast.success("Banner added successfully");
        } else {
            const updated = [...banners];
            updated[editIndex] = newBanner;
            setBanners(updated);
            toast.success("Banner updated successfully");
        }

        setIsModalOpen(false);
    };

    const handleDelete = (index) => {
        const updated = banners.filter((_, i) => i !== index);
        setBanners(updated);
        toast.success("Banner deleted successfully");
    };

    const toggleSelect = (value, list, setList, numbers, setNumbers) => {
        if (list.includes(value)) {
            setList(list.filter((v) => v !== value));
            const updatedNumbers = { ...numbers };
            delete updatedNumbers[value];
            setNumbers(updatedNumbers);
        } else {
            setList([...list, value]);
            setNumbers({ ...numbers, [value]: 1 });
        }
    };

    return (
        <DefaultPageAdmin>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Add Banner
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
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
                        {banners.map((b, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {b.image && (
                                        <img
                                            src={URL.createObjectURL(b.image)}
                                            className="w-20 h-12 object-cover rounded border"
                                            alt="banner"
                                        />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {b.platform.xpress && "QuickGo "}
                                    {b.platform.website && "Wizard Mall"}
                                </td>

                                <td className="px-4 py-3">
                                    {b.countries.map((c) => `${c} (${b.countryNumbers[c]})`).join(", ")}
                                </td>
                                <td className="px-4 py-3">
                                    {b.states.map((s) => `${s} (${b.stateNumbers[s]})`).join(", ")}
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
                                            className="flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(idx)}
                                            className="flex items-center gap-1 text-red-600 hover:underline"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {banners.length === 0 && (
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
                                    <img
                                        src={URL.createObjectURL(form.image)}
                                        className="h-full object-contain rounded"
                                        alt="preview"
                                    />
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
                                                        setCountryNumbers
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
                                            {form.countries.map((code) => {
                                                const country = countries.find((c) => c.code === code);
                                                return (
                                                    <span
                                                        key={code}
                                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                                                    >
                                                        {country?.name || code} ({countryNumbers[code]})
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
                                                        setStateNumbers
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
        </DefaultPageAdmin>
    );
};

export default BannerPage;
