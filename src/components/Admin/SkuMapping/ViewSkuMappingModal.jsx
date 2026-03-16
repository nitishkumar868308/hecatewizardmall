"use client";
import { X, Tag, Barcode, Calendar, Hash, IndianRupee, Layers } from "lucide-react";
import { useMemo } from "react";

const ViewSkuMappingModal = ({ open, onClose, data, products }) => {
    if (!open) return null;

    const productDetails = useMemo(() => {
        if (!products || !data?.ourSku) return null;

        for (const product of products) {
            // MASTER SKU MATCH
            if (product.sku === data.ourSku) {
                return {
                    name: product.name,
                    barcode: product.barCode,
                    price: product.price,
                    sku: product.sku,
                    variation: null
                };
            }

            // VARIATION SKU MATCH
            if (product.variations?.length) {
                const variation = product.variations.find(
                    (v) => v.sku === data.ourSku
                );

                if (variation) {
                    return {
                        name: product.name,
                        barcode: variation.barCode,
                        price: variation.price,
                        sku: variation.sku,
                        variation: variation.variationName
                    };
                }
            }
        }
        return null;
    }, [products, data]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100">
                
                {/* Header Section */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">SKU Mapping</h2>
                        {/* <p className="text-sm text-slate-500 mt-1">Detailed view of your product link</p> */}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:shadow-md transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    {/* Primary Product Info */}
                    <div className="mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-500 rounded-xl text-white">
                                <Tag size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">Product Name</p>
                                <p className="text-lg font-semibold text-slate-800 leading-tight">
                                    {productDetails?.name || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <DetailItem 
                            label="Channel SKU" 
                            value={data?.channelSku} 
                            icon={<Layers size={16} className="text-blue-500" />} 
                        />
                        
                        <DetailItem 
                            label="Internal SKU" 
                            value={data?.ourSku} 
                            icon={<Hash size={16} className="text-purple-500" />} 
                        />

                        <DetailItem 
                            label="FNSKU / Barcode" 
                            value={productDetails?.barcode} 
                            icon={<Barcode size={16} className="text-emerald-500" />} 
                        />

                        {/* <DetailItem 
                            label="Price" 
                            value={productDetails?.price ? `₹${productDetails.price}` : "-"} 
                            icon={<IndianRupee size={16} className="text-amber-500" />} 
                        /> */}

                        {productDetails?.variation && (
                            <DetailItem 
                                label="Variation" 
                                value={productDetails.variation} 
                                icon={<Tag size={16} className="text-pink-500" />} 
                            />
                        )}

                        <DetailItem 
                            label="Created Date" 
                            value={data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"} 
                            icon={<Calendar size={16} className="text-slate-500" />} 
                        />
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Sub-component for clean layout
const DetailItem = ({ label, value, icon }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-[15px] font-semibold text-slate-700 pl-6">
            {value || "-"}
        </p>
    </div>
);

export default ViewSkuMappingModal;