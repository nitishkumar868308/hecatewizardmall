// "use client"

// import React, { useEffect, useState } from "react"
// import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin"
// import { fetchAllInventory } from "@/app/redux/slices/bangaloreInventory/bangaloreInventorySlice"
// import { fetchAllProducts } from "@/app/redux/slices/products/productSlice"
// import { useDispatch, useSelector } from "react-redux"

// const Page = () => {

//     const dispatch = useDispatch()

//     const { allInventory } = useSelector((state) => state.bangaloreInventory)
//     const { products } = useSelector((state) => state.products)
//     console.log("products", products)
//     console.log("allInventory", allInventory)
//     const [selectedItem, setSelectedItem] = useState(null)
//     const [modalType, setModalType] = useState(null)

//     useEffect(() => {
//         dispatch(fetchAllInventory())
//         dispatch(fetchAllProducts())
//     }, [dispatch])

//     // SKU → Product / Variation Match
//     const getProductDetails = (sku) => {

//         for (const product of products) {

//             // variation match
//             if (product.variations?.length) {

//                 const variation = product.variations.find(
//                     (v) => v.sku === sku
//                 )

//                 if (variation) {
//                     return {
//                         product,
//                         variation
//                     }
//                 }
//             }

//             // product sku match
//             if (product.sku === sku) {
//                 return {
//                     product,
//                     variation: null
//                 }
//             }

//         }

//         return null
//     }
//     const openModal = (item, type) => {
//         setSelectedItem(item)
//         setModalType(type)
//     }

//     return (
//         <DefaultPageAdmin>

//             <h1 className="text-2xl font-bold mb-6">
//                 Inventory
//             </h1>

//             <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-200 rounded-lg">

//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="p-3 text-left">#</th>
//                             <th className="p-3 text-left">channelSkuCode</th>
//                             <th className="p-3 text-left">locationCode</th>
//                             <th className="p-3 text-left">quantity</th>
//                             <th className="p-3 text-left">minExpiry</th>
//                             <th className="p-3 text-left">channelSerialNo</th>
//                             <th className="p-3 text-left">createdAt</th>
//                             <th className="p-3 text-left">updatedAt</th>
//                             <th className="p-3 text-left">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>

//                         {allInventory?.map((item, index) => (

//                             <tr key={index} className="border-t">

//                                 <td className="p-3">{index + 1}</td>

//                                 <td className="p-3 font-medium">
//                                     {item.channelSkuCode}
//                                 </td>

//                                 <td className="p-3">
//                                     {item.locationCode}
//                                 </td>

//                                 <td className="p-3">
//                                     {item.quantity}
//                                 </td>

//                                 <td className="p-3">
//                                     {item.minExpiry ?? "-"}
//                                 </td>

//                                 <td className="p-3">
//                                     {item.channelSerialNo ?? "-"}
//                                 </td>

//                                 <td className="p-3">
//                                     {new Date(item.createdAt).toLocaleString()}
//                                 </td>

//                                 <td className="p-3">
//                                     {new Date(item.updatedAt).toLocaleString()}
//                                 </td>

//                                 <td className="p-3 flex gap-2">

//                                     <button
//                                         onClick={() => openModal(item, "view")}
//                                         className="px-3 py-1 bg-blue-500 text-white rounded"
//                                     >
//                                         View
//                                     </button>

//                                 </td>

//                             </tr>

//                         ))}

//                     </tbody>

//                 </table>

//             </div>

//             {/* Modal */}

//             {selectedItem && modalType === "view" && (() => {

//                 const data = getProductDetails(selectedItem.channelSkuCode)

//                 return (

//                     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//                         <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">

//                             <h2 className="text-lg font-semibold mb-4">
//                                 Inventory Details
//                             </h2>

//                             {/* Inventory Info */}

//                             <div className="mb-4">

//                                 <p><b>channelSkuCode:</b> {selectedItem.channelSkuCode}</p>

//                                 <p><b>Location:</b> {selectedItem.locationCode}</p>

//                                 <p><b>Quantity:</b> {selectedItem.quantity}</p>

//                                 <p><b>Created:</b> {selectedItem.createdAt}</p>

//                             </div>

//                             {/* Product Info */}

//                             {data?.product && (

//                                 <div className="border-t pt-4">

//                                     <h3 className="font-semibold mb-2">Product Info</h3>

//                                     <p><b>Name:</b> {data.product.name}</p>

//                                     <p><b>SKU:</b> {data.product.sku}</p>

//                                     <p><b>Price:</b> {data.product.price}</p>

//                                     <p><b>Category:</b> {data.product.category?.name}</p>

//                                 </div>

//                             )}

//                             {/* Variation Info */}

//                             {data?.variation && (

//                                 <div className="border-t pt-4 mt-4">

//                                     <h3 className="font-semibold mb-2">Variation Info</h3>

//                                     <p><b>Variation:</b> {data.variation.variationName}</p>

//                                     <p><b>SKU:</b> {data.variation.sku}</p>

//                                     <p><b>Price:</b> {data.variation.price}</p>

//                                 </div>

//                             )}

//                             <div className="flex justify-end mt-6">

//                                 <button
//                                     onClick={() => setSelectedItem(null)}
//                                     className="px-4 py-2 border rounded"
//                                 >
//                                     Close
//                                 </button>

//                             </div>

//                         </div>

//                     </div>

//                 )

//             })()}
//         </DefaultPageAdmin>
//     )
// }

// export default Page






"use client"

import React, { useEffect, useState, useMemo } from "react"
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin"
import { fetchAllInventory } from "@/app/redux/slices/bangaloreInventory/bangaloreInventorySlice"
import { fetchAllProducts } from "@/app/redux/slices/products/productSlice"
import { useDispatch, useSelector } from "react-redux"
import { Eye, Package, MapPin, Calendar, Search, X, Info, Layers } from "lucide-react"

const Page = () => {
    const dispatch = useDispatch()
    const { allInventory } = useSelector((state) => state.bangaloreInventory)
    const { products } = useSelector((state) => state.products)

    const [selectedItem, setSelectedItem] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        dispatch(fetchAllInventory())
        dispatch(fetchAllProducts())
    }, [dispatch])

    // Memoized Filtered Inventory
    const filteredInventory = useMemo(() => {
        if (!allInventory) return []
        return allInventory.filter(item =>
            item.channelSkuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.locationCode.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [allInventory, searchTerm])

    const getProductDetails = (sku) => {
        if (!products) return null
        for (const product of products) {
            if (product.variations?.length) {
                const variation = product.variations.find((v) => v.sku === sku)
                if (variation) return { product, variation }
            }
            if (product.sku === sku) return { product, variation: null }
        }
        return null
    }

    return (
        <DefaultPageAdmin>
            <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">

                {/* Header & Stats Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Package className="w-6 h-6 text-blue-600" />Bangalore Inventory
                        </h1>
                        {/* <p className="text-gray-500 text-sm">Monitor and track your Bangalore warehouse stock.</p> */}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search SKU or Location..."
                            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Items" value={allInventory?.length || 0} icon={<Layers className="text-blue-600" />} bg="bg-blue-50" />
                    <StatCard title="Total Stock" value={allInventory?.reduce((acc, curr) => acc + (curr.quantity || 0), 0)} icon={<Package className="text-green-600" />} bg="bg-green-50" />
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="p-4 whitespace-nowrap">#</th>
                                    <th className="p-4 whitespace-nowrap">Channel Sku Code</th>
                                    <th className="p-4 whitespace-nowrap">Location</th>
                                    <th className="p-4 whitespace-nowrap">Quantity</th>
                                    {/* <th className="p-4 whitespace-nowrap">Expiries</th> */}
                                    <th className="p-4 whitespace-nowrap">Last Updated</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInventory.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 text-gray-400">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-800">{item.channelSkuCode}</div>
                                            <div className="text-xs text-gray-400 uppercase">SN: {item.channelSerialNo || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <MapPin className="w-3 h-3 text-red-400" /> {item.locationCode}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full font-medium ${item.quantity < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                {item.quantity} Units
                                            </span>
                                        </td>
                                        {/* <td className="p-4 text-gray-500 italic">{item.minExpiry || "-"}</td> */}
                                        <td className="p-4 text-gray-500">
                                            <div className="flex flex-col text-[12px]">
                                                <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                                <span className="text-gray-400">{new Date(item.updatedAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all group-hover:scale-110"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Modal Design */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" /> Item Specification
                            </h2>
                            <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-200 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Inventory Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <DetailBox label="Channel Sku Code" value={selectedItem.channelSkuCode} />
                                <DetailBox label="Location" value={selectedItem.locationCode} />
                                <DetailBox label="Available Stock" value={selectedItem.quantity} />
                                <DetailBox label="Created On"   value={`${new Date(selectedItem.createdAt).toLocaleDateString()} ${new Date(selectedItem.createdAt).toLocaleTimeString()}`} />
                            </div>

                            {/* Linked Product Info */}
                            {(() => {
                                const data = getProductDetails(selectedItem.channelSkuCode)
                                if (!data) return <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl text-sm">No linked product found in catalog.</div>

                                return (
                                    <div className="space-y-4">
                                        <div className="pt-4 border-t">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Product Catalog Details</h3>
                                            <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                                <p className="flex justify-between"><b>Name:</b> <span>{data.product.name}</span></p>
                                                <p className="flex justify-between"><b>Base SKU:</b> <span>{data.product.sku}</span></p>
                                                <p className="flex justify-between"><b>Category:</b> <span>{data.product.category?.name || 'N/A'}</span></p>
                                            </div>
                                        </div>

                                        {data.variation && (
                                            <div className="pt-4 border-t">
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Variation Specs</h3>
                                                <div className="p-4 bg-blue-50 rounded-2xl space-y-2 text-blue-900">
                                                    <p className="flex justify-between"><b>Variant:</b> <span>{data.variation.variationName}</span></p>
                                                     <p className="flex justify-between"><b>Variant Sku:</b> <span>{data.variation.sku}</span></p>
                                                    <p className="flex justify-between"><b>Variant Price:</b> <span>₹{data.variation.price}</span></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    )
}

// Helper Components
const StatCard = ({ title, value, icon, bg }) => (
    <div className={`${bg} p-5 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between`}>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    </div>
)

const DetailBox = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-gray-700 font-medium">{value}</span>
    </div>
)

export default Page