"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWarehouses } from '@/app/redux/slices/warehouse/wareHouseSlice';

export default function LandingModal() {
    const dispatch = useDispatch();
    const { warehouses } = useSelector((state) => state.warehouses);
   

    const [open, setOpen] = useState(false);
    const [selectedState, setSelectedState] = useState("");
    const [pin, setPin] = useState("");
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        dispatch(fetchWarehouses());
       
        const savedState = localStorage.getItem("selectedState");
        const savedPin = localStorage.getItem("pincode");
        const savedCode = localStorage.getItem("warehouseCode");

        if (!savedState || !savedPin || !savedCode) {
            setOpen(true);
        }
    }, [dispatch]);

    const handleSubmit = () => {
        if (!selectedState) {
            alert("Please select a state");
            return;
        }

        if (!pin) {
            alert("Please select a valid pincode");
            return;
        }

        const matchedWarehouse = warehouses.find((w) =>
            w.state === selectedState &&
            w.pincode.split(",").map(p => p.trim()).includes(pin)
        );

        if (!matchedWarehouse) {
            alert("No warehouse found for this state & pincode");
            return;
        }

        localStorage.setItem("selectedState", selectedState);
        localStorage.setItem("pincode", pin);
        localStorage.setItem("warehouseCode", matchedWarehouse.code);
        localStorage.setItem("warehouseId", matchedWarehouse.id);

        setOpen(false);
    };

    if (!open) return null;

    // Unique states
    const statesList = [...new Set(warehouses.map((w) => w.state))];

    // Find selected warehouse's multiple pincodes
    const selectedWarehouse = warehouses.find(w => w.state === selectedState);
    const pincodeList = selectedWarehouse
        ? selectedWarehouse.pincode
            .split(",")
            .map((p) => p.trim())
        : [];

    const filteredPincodes = pincodeList.filter((p) =>
        p.includes(search)
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-3">Select Your Location</h2>

                {/* STATE DROPDOWN */}
                <label className="block mb-2 text-sm">State</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={selectedState}
                    onChange={(e) => {
                        setSelectedState(e.target.value);
                        setPin("");
                        setSearch("");
                        setShowDropdown(false);
                    }}
                >
                    <option value="">Select State</option>
                    {statesList.map((s, idx) => (
                        <option value={s} key={idx}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* SEARCHABLE PINCODE DROPDOWN */}
                {selectedState && (
                    <div className="relative mb-4">
                        <label className="block mb-2 text-sm">Pincode</label>

                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Search pincode..."
                            value={pin || search}
                            onClick={() => setShowDropdown(true)}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPin("");
                                setShowDropdown(true);
                            }}
                        />

                        {showDropdown && (
                            <ul className="absolute left-0 right-0 bg-white border rounded shadow max-h-40 overflow-y-auto z-50">
                                {filteredPincodes.length > 0 ? (
                                    filteredPincodes.map((p, idx) => (
                                        <li
                                            key={idx}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setPin(p);
                                                setSearch("");
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {p}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-2 text-gray-500">
                                        No pincode found
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full py-2 bg-black text-white rounded-md"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
