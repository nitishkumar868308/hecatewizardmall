export const WaxTypeSelect = ({ category, waxType, setWaxType }) => {
    const waxTypesConfig = {
        candles: [
            { value: "soy_blended", label: "Soy Blended Wax" },
            { value: "pure_soy", label: "Pure Soy Wax" },
            { value: "pure_beeswax", label: "Pure Beeswax" },
        ],
        special_candles: [
            { value: "soy_blended", label: "Soy Blended Wax" },
            { value: "pure_soy", label: "Pure Soy Wax" },
        ],
    };

    const options = waxTypesConfig[category] || [];

    if (options.length === 0) return null;

    return (
        <select
            value={waxType || ""}
            onChange={(e) => setWaxType(e.target.value)}
            className="mt-1 border rounded-lg px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
        >
            <option value="">Select Wax Type</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
};
