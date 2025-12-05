"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStates } from "@/app/redux/slices/state/addStateSlice";

export default function LandingModal() {
    const dispatch = useDispatch();
    const { states } = useSelector((state) => state.states);

    const [open, setOpen] = useState(false);
    const [selectedState, setState] = useState("");
    const [pin, setPin] = useState("");

    useEffect(() => {
        dispatch(fetchStates());

        const savedState = localStorage.getItem("selectedState");
        const savedPin = localStorage.getItem("pincode");

        if (!savedState || !savedPin) {
            setOpen(true);
        }
    }, [dispatch]);

    const handleSubmit = () => {
        if (!selectedState) {
            alert("Please select a state");
            return;
        }

        if (pin.length !== 6) {
            alert("Please enter a valid 6-digit pincode");
            return;
        }

        // SAVE TO LOCAL STORAGE ONLY
        localStorage.setItem("selectedState", selectedState);
        localStorage.setItem("pincode", pin);

        setOpen(false);
    };

    if (!open) return null;

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
                        setState(e.target.value);
                        setPin("");    // reset pin when state changes
                    }}
                >
                    <option value="">Select State</option>
                    {states.map((s) => (
                        <option value={s.name} key={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                {/* PINCODE ONLY AFTER SELECTING STATE */}
                {selectedState && (
                    <>
                        <label className="block mb-2 text-sm">Pincode</label>
                        <input
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter pincode"
                            maxLength={6}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                    </>
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
