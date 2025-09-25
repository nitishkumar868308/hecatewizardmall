// import { useState, useRef, useEffect } from "react";

// const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Use currentData.offers consistently
//     const toggleOffer = (id) => {
//         const selected = currentData.offers || [];
//         if (selected.includes(id)) {
//             setCurrentData({ ...currentData, offers: selected.filter((o) => o !== id) });
//         } else {
//             setCurrentData({ ...currentData, offers: [...selected, id] });
//         }
//     };

//     const selectedNames = (currentData.offers || [])
//         .map((id) => offers.find((o) => o.id === id)?.name)
//         .filter(Boolean)
//         .join(", ");

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <label className="block mb-1 font-medium">Offers</label>
//             <div
//                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer"
//                 onClick={() => setOpen(!open)}
//             >
//                 {selectedNames || "Select Offers"}
//             </div>

//             {open && (
//                 <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
//                     {offers
//                         .filter((offer) => offer.type.includes("product"))
//                         .map((offer) => (
//                             <label
//                                 key={offer.id}
//                                 className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={(currentData.offers || []).includes(offer.id)}
//                                     onChange={() => toggleOffer(offer.id)}
//                                     className="mr-2"
//                                 />
//                                 {offer.name}
//                             </label>
//                         ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MultiSelectDropdown;


import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ offers, currentData, setCurrentData }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!currentData.offers) {
            setCurrentData({ ...currentData, offers: [] });
        } else if (currentData.offers.length > 0 && typeof currentData.offers[0] === "object") {
            setCurrentData({
                ...currentData,
                offers: currentData.offers.map(o => o.id),
            });
        }
    }, []); // run once on mount


    const toggleOffer = (id) => {
        const selected = currentData.offers || [];
        if (selected.includes(id)) {
            setCurrentData({ ...currentData, offers: selected.filter(o => o !== id) });
        } else {
            setCurrentData({ ...currentData, offers: [...selected, id] });
        }
    };

    const selectedNames = (currentData.offers || [])
        .map(id => offers.find(o => o.id === id)?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block mb-1 font-medium">Offers</label>
            <div
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {selectedNames || "Select Offers"}
            </div>

            {open && (
                <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white z-10 shadow-lg">
                    {offers
                        .filter(o => o.type.includes("product"))
                        .map(o => (
                            <label key={o.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(currentData.offers || []).includes(o.id)}
                                    onChange={() => toggleOffer(o.id)}
                                    className="mr-2"
                                />
                                {o.name}
                            </label>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
