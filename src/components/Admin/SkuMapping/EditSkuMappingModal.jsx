"use client";

import { useState, useEffect, useMemo } from "react";
import {
    X,
    ChevronDown,
    Search,
    CheckCircle2,
    ArrowRight,
    Package,
    Link as LinkIcon
} from "lucide-react";

const EditSkuMappingModal = ({
    open,
    onClose,
    data,
    products,
    inventory,
    onSave
}) => {

    const [channelSku, setChannelSku] = useState("");
    const [ourSku, setOurSku] = useState("");

    const [openDropdown, setOpenDropdown] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (data) {
            setChannelSku(data.channelSku);
            setOurSku(data.ourSku);
        }
    }, [data]);



    // OUR SKU LIST
    const ourSkuList = useMemo(() => {
        let list = [];

        products?.forEach((p) => {

            if (p.sku) {
                list.push({
                    label: p.name,
                    subLabel: `Master SKU: ${p.sku}`,
                    value: p.sku
                });
            }

            p.variations?.forEach((v) => {
                if (v.sku) {
                    list.push({
                        label: p.name,
                        subLabel: `Variation: ${v.variationName}`,
                        value: v.sku
                    });
                }
            });

        });

        return list;

    }, [products]);

    // FILTERS
    const filteredOurSku = ourSkuList.filter((s) =>
        `${s.label} ${s.value}`.toLowerCase().includes(search.toLowerCase())
    );

    const filteredChannelSku = inventory?.filter((s) =>
        s.channelSkuCode.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = () => {
        onSave({
            ...data,
            channelSku,
            ourSku
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-8 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-8 text-gray-900">
                    Edit SKU Mapping
                </h2>

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-8">

                    {/* CHANNEL SKU */}
                    <div className="flex-1 relative">

                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">
                            Source: Channel SKU
                        </label>

                        <button
                            onClick={() => {
                                setOpenDropdown(openDropdown === "channel" ? null : "channel");
                                setSearch("");
                            }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 text-indigo-700"
                        >

                            <div className="flex items-center gap-3 overflow-hidden">
                                <LinkIcon size={18} className="text-indigo-500" />
                                <span className="font-semibold truncate">
                                    {channelSku || "Select Channel SKU"}
                                </span>
                            </div>

                            <ChevronDown
                                size={18}
                                className={openDropdown === "channel" ? "rotate-180" : ""}
                            />

                        </button>

                        {openDropdown === "channel" && (
                            <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">

                                <div className="p-3 border-b">

                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-2.5 text-gray-400"
                                            size={16}
                                        />

                                        <input
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search channel codes..."
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none"
                                        />

                                    </div>

                                </div>

                                <div className="max-h-60 overflow-y-auto p-2">

                                    {filteredChannelSku?.map((item, i) => (

                                        <div
                                            key={i}
                                            onClick={() => {
                                                setChannelSku(item.channelSkuCode);
                                                setOpenDropdown(null);
                                            }}
                                            className="px-4 py-3 hover:bg-indigo-50 rounded-lg cursor-pointer text-sm flex justify-between"
                                        >

                                            {item.channelSkuCode}

                                            <CheckCircle2
                                                size={16}
                                                className="text-indigo-500 opacity-0 group-hover:opacity-100"
                                            />

                                        </div>

                                    ))}

                                </div>

                            </div>
                        )}
                    </div>

                    {/* ARROW */}
                    <div className="flex items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full text-gray-400 hidden lg:block">
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    {/* OUR SKU */}
                    <div className="flex-1 relative">

                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">
                            Target: Our Internal SKU
                        </label>

                        <button
                            onClick={() => {
                                setOpenDropdown(openDropdown === "our" ? null : "our");
                                setSearch("");
                            }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl border-2 border-emerald-100 bg-emerald-50/30 text-emerald-700"
                        >

                            <div className="flex items-center gap-3 overflow-hidden">
                                <Package size={18} className="text-emerald-500" />
                                <span className="font-semibold truncate">
                                    {ourSku || "Select Internal SKU"}
                                </span>
                            </div>

                            <ChevronDown
                                size={18}
                                className={openDropdown === "our" ? "rotate-180" : ""}
                            />

                        </button>

                        {openDropdown === "our" && (
                            <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">

                                <div className="p-3 border-b">

                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-2.5 text-gray-400"
                                            size={16}
                                        />

                                        <input
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search product or SKU..."
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none"
                                        />
                                    </div>

                                </div>

                                <div className="max-h-60 overflow-y-auto p-2">

                                    {filteredOurSku.map((sku, i) => (

                                        <div
                                            key={i}
                                            onClick={() => {
                                                setOurSku(sku.value);
                                                setOpenDropdown(null);
                                            }}
                                            className="px-4 py-3 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                        >

                                            <div className="text-sm font-bold text-gray-800">
                                                {sku.label}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {sku.subLabel}
                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>
                        )}
                    </div>

                </div>

                {/* ACTION */}
                <div className="mt-10 flex justify-end">

                    <button
                        onClick={handleSubmit}
                        disabled={!channelSku || !ourSku}
                        className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-200 cursor-pointer"
                    >
                        Update Mapping
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditSkuMappingModal;