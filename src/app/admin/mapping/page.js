"use client";

import React, { useEffect, useMemo, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice";
import { fetchAllInventory } from "@/app/redux/slices/bangaloreInventory/bangaloreInventorySlice";
import { Search, ArrowRight, Package, Link as LinkIcon, ChevronDown, CheckCircle2, Info, Eye, Pencil, Trash2, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { createSkuMapping, fetchSkuMappings, updateSkuMapping, deleteSkuMapping } from "@/app/redux/slices/skuMapping/skuMappingSlice";
import toast from 'react-hot-toast';
import ViewSkuMappingModal from "@/components/Admin/SkuMapping/ViewSkuMappingModal";
import EditSkuMappingModal from "@/components/Admin/SkuMapping/EditSkuMappingModal";
import DeleteSkuMappingModal from "@/components/Admin/SkuMapping/DeleteSkuMappingModal";

const Page = () => {
    const dispatch = useDispatch();

    // Redux States
    const { products } = useSelector((state) => state.products);
    const { allInventory } = useSelector((state) => state.bangaloreInventory);
    const { mappings } = useSelector((state) => state.skuMapping);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    console.log("mappings", mappings)
    // Local States
    const [mapping, setMapping] = useState({
        channelSku: "",
        ourSku: ""
    });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchAllProducts());
        dispatch(fetchAllInventory());
        dispatch(fetchSkuMappings());
    }, [dispatch]);

    // OUR SKU LIST Logic
    const ourSkuList = useMemo(() => {
        let list = [];
        products.forEach((p) => {
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

    const filteredOurSku = ourSkuList.filter((s) =>
        `${s.label} ${s.value}`.toLowerCase().includes(search.toLowerCase())
    );

    // Filtering Logic
    const mappingChannelSkus = new Set(
        mappings
            ?.filter(m => m.channelSku)
            .map(m => m.channelSku.trim().toLowerCase())
    );

    const filteredChannelSku = allInventory
        .filter(
            (item) =>
                !mappingChannelSkus.has(item.channelSkuCode?.toLowerCase())
        )
        .filter((item) =>
            item.channelSkuCode?.toLowerCase().includes(search.toLowerCase())
        );

    console.log("filteredChannelSku", filteredChannelSku);

    // const filteredChannelSku = allInventory.filter((s) =>
    //     s.channelSkuCode.toLowerCase().includes(search.toLowerCase())
    // );

    const handleSave = async () => {
        try {

            const res = await dispatch(
                createSkuMapping({
                    channelSku: mapping.channelSku,
                    ourSku: mapping.ourSku
                })
            ).unwrap();

            console.log("API RESPONSE:", res);
            if (res.success) {
                console.log("SUCCESS MESSAGE:", res.message);
                toast.success(res.message)
                setMapping({
                    channelSku: "",
                    ourSku: ""
                });
            } else {

                toast.error(res.message);

            }

        } catch (error) {
            toast.error(error?.message || error)
            console.log("API ERROR:", error);

        }
    };

    const filteredMappings = useMemo(() => {
        return mappings.filter(item =>
            item.channelSku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ourSku?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [mappings, searchTerm]);

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMappings.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 when searching
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <DefaultPageAdmin>
            <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">

                {/* Header Section */}
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <LinkIcon className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            SKU Mapping
                        </h1>
                    </div>
                    <p className="text-gray-500 ml-12">Connect marketplace SKUs with your warehouse inventory.</p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Main Interaction Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible">
                        <div className="p-6 md:p-10">

                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-8">

                                {/* 1. CHANNEL SKU SELECTOR */}
                                <div className="flex-1 relative">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">
                                        Source: Channel SKU
                                    </label>
                                    <button
                                        onClick={() => { setOpenDropdown(openDropdown === "channel" ? null : "channel"); setSearch("") }}
                                        // onClick={() => { setOpenDropdown("channel"); setSearch(""); }}
                                        className={`w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${mapping.channelSku
                                            ? "border-indigo-100 bg-indigo-50/30 text-indigo-700"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <LinkIcon size={18} className={mapping.channelSku ? "text-indigo-500" : "text-gray-400"} />
                                            <span className="font-semibold truncate">
                                                {mapping.channelSku || "Select Channel SKU"}
                                            </span>
                                        </div>
                                        <ChevronDown size={18} className={openDropdown === 'channel' ? "rotate-180 transition-transform" : "transition-transform"} />
                                    </button>

                                    {openDropdown === "channel" && (
                                        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-3 sticky top-0 bg-white rounded-t-xl border-b">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                                    <input
                                                        autoFocus
                                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        placeholder="Search channel codes..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {filteredChannelSku.length > 0 ? filteredChannelSku.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            setMapping(prev => ({ ...prev, channelSku: item.channelSkuCode }));
                                                            setOpenDropdown(null);
                                                        }}
                                                        className="px-4 py-3 hover:bg-indigo-50 rounded-lg cursor-pointer text-sm text-gray-700 flex items-center justify-between group transition-colors"
                                                    >
                                                        <span className="font-medium">{item.channelSkuCode}</span>
                                                        <CheckCircle2 size={16} className="text-indigo-500 opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                )) : <div className="p-4 text-center text-gray-400 text-sm">No SKU found</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* CENTER ARROW (Hidden on mobile) */}
                                <div className="flex items-center justify-center pt-2 lg:pt-6">
                                    <div className="bg-gray-100 p-3 rounded-full text-gray-400 hidden lg:block">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div className="h-px w-full bg-gray-100 lg:hidden relative my-2">
                                        <div className="absolute inset-0 flex items-center justify-center -top-3">
                                            <span className="bg-white px-3 text-[10px] font-bold text-gray-300 uppercase">Map To</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. OUR SKU SELECTOR */}
                                <div className="flex-1 relative">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">
                                        Target: Our Internal SKU
                                    </label>
                                    <button
                                        onClick={() => { setOpenDropdown(openDropdown === "our" ? null : "our"); setSearch("") }}
                                        // onClick={() => { setOpenDropdown("our"); setSearch(""); }}
                                        className={`w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${mapping.ourSku
                                            ? "border-emerald-100 bg-emerald-50/30 text-emerald-700"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Package size={18} className={mapping.ourSku ? "text-emerald-500" : "text-gray-400"} />
                                            <span className="font-semibold truncate">
                                                {mapping.ourSku || "Select Internal SKU"}
                                            </span>
                                        </div>
                                        <ChevronDown size={18} className={openDropdown === 'our' ? "rotate-180 transition-transform" : "transition-transform"} />
                                    </button>

                                    {openDropdown === "our" && (
                                        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-3 sticky top-0 bg-white rounded-t-xl border-b">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                                    <input
                                                        autoFocus
                                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        placeholder="Search product or SKU..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {filteredOurSku.length > 0 ? filteredOurSku.map((sku, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            setMapping(prev => ({ ...prev, ourSku: sku.value }));
                                                            setOpenDropdown(null);
                                                        }}
                                                        className="px-4 py-3 hover:bg-emerald-50 rounded-lg cursor-pointer group transition-all"
                                                    >
                                                        <div className="text-sm font-bold text-gray-800 group-hover:text-emerald-700">{sku.label}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{sku.subLabel}</div>
                                                    </div>
                                                )) : <div className="p-4 text-center text-gray-400 text-sm">No internal SKU found</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Action Area */}
                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-8">
                                <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                    <Info size={14} />
                                    <span className="text-xs font-medium">Both SKUs must be selected to save mapping</span>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!mapping.channelSku || !mapping.ourSku}
                                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-95"
                                >
                                    Save Connection
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Footer Tips */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                        <div className="flex gap-3">
                            <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg h-fit text-sm font-bold">01</div>
                            <p className="text-xs text-gray-500 leading-relaxed">Select the SKU as it appears on your <b>Marketplace/Channel</b> dashboard.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg h-fit text-sm font-bold">02</div>
                            <p className="text-xs text-gray-500 leading-relaxed">Choose the matching <b>Internal Product</b> from your Master list.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg h-fit text-sm font-bold">03</div>
                            <p className="text-xs text-gray-500 leading-relaxed">Click <b>Save Connection</b> to sync inventory levels automatically.</p>
                        </div>
                    </div>

                    {/* SKU Mapping Table */}
                    <div className="max-w-6xl mx-auto mt-12 mb-20">
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden">

                            {/* --- Table Header & Search Area --- */}
                            <div className="p-6 border-b border-gray-100 bg-white">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            Active Connections
                                            <span className="bg-indigo-50 text-indigo-600 text-xs py-1 px-3 rounded-full font-bold">
                                                {filteredMappings.length} Total
                                            </span>
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Manage your linked marketplace SKUs</p>
                                    </div>

                                    <div className="relative group w-full md:w-72">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by SKU name..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* --- Table Body --- */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-500">
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">#</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-2">Channel SKU <ArrowUpDown size={12} /></div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-2">Internal SKU <ArrowUpDown size={12} /></div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Created Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Updated Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-50">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-all group">
                                                    <td className="px-6 py-4 text-gray-400 font-medium">
                                                        {(currentPage - 1) * itemsPerPage + idx + 1}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                            <span className="font-semibold text-gray-800 tracking-tight">{item.channelSku}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-700 font-medium">{item.ourSku}</span>
                                                            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">Verified</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                                                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                                                        {new Date(item.updatedAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => {
                                                                setSelectedItem(item)
                                                                setViewModal(true)
                                                            }}
                                                                className="p-2 hover:bg-white hover:shadow-md rounded-lg text-gray-600 hover:text-indigo-600 transition-all cursor-pointer">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={() => {
                                                                setSelectedItem(item)
                                                                setEditModal(true)
                                                            }}
                                                                className="p-2 hover:bg-white hover:shadow-md rounded-lg text-gray-600 hover:text-yellow-600 transition-all cursor-pointer">
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button onClick={() => {
                                                                setSelectedItem(item)
                                                                setDeleteModal(true)
                                                            }}
                                                                className="p-2 hover:bg-white hover:shadow-md rounded-lg text-gray-600 hover:text-red-600 transition-all cursor-pointer">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <Filter size={48} className="mb-4 opacity-20" />
                                                        <p className="text-lg font-medium">No mappings found</p>
                                                        <p className="text-sm">Try adjusting your search terms</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Pagination Footer --- */}
                            {totalPages > 0 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Page {currentPage} of {totalPages}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {/* Simple Page Numbers for Desktop */}
                                        <div className="hidden sm:flex items-center gap-1">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                        : "text-gray-500 hover:bg-gray-200/50"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ViewSkuMappingModal
                open={viewModal}
                onClose={() => setViewModal(false)}
                data={selectedItem}
                products={products}
            />

            <EditSkuMappingModal
                open={editModal}
                onClose={() => setEditModal(false)}
                data={selectedItem}
                products={products}
                inventory={allInventory}
                onSave={async (data) => {
                    try {

                        const res = await dispatch(updateSkuMapping({
                            id: data.id,
                            channelSku: data.channelSku,
                            ourSku: data.ourSku
                        })).unwrap();

                        toast.success(res.message || "Mapping updated successfully");

                        setEditModal(false);

                    } catch (err) {

                        toast.error(err.message || "Failed to update mapping");

                    }
                }}
            />

            <DeleteSkuMappingModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                data={selectedItem}
                onDelete={async (data) => {
                    try {

                        const res = await dispatch(deleteSkuMapping({
                            id: data.id
                        })).unwrap();

                        toast.success(res.message || "Mapping deleted successfully");

                        setDeleteModal(false);

                    } catch (err) {

                        toast.error(err.message || "Failed to delete mapping");

                    }
                }}
            />
        </DefaultPageAdmin >
    );
};

export default Page;