import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const toggleOffer = (id) => {
        const selected = currentData.offer || [];
        if (selected.includes(id)) {
            setCurrentData({ ...currentData, offer: selected.filter((o) => o !== id) });
        } else {
            setCurrentData({ ...currentData, offer: [...selected, id] });
        }
    };

    const selectedNames = (currentData.offer || [])
        .map((id) => offers.find((o) => o.id === id)?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block mb-1 font-medium">Offer</label>
            <div
                className="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {selectedNames || "Select Offers"}
            </div>

            {open && (
                <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
                    {offers
                        .filter((offer) => offer.type.includes("product"))
                        .map((catOffer) => (
                            <label
                                key={catOffer.id}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={(currentData.offer || []).includes(catOffer.id)}
                                    onChange={() => toggleOffer(catOffer.id)}
                                    className="mr-2"
                                />
                                {catOffer.name}
                            </label>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
