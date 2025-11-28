import React, { useState, useEffect } from "react";
import { Eye, Truck } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Barcode from "react-barcode";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import BWIPJS from "bwip-js";
import JsBarcode from "jsbarcode";

// const styles = StyleSheet.create({
//     page: {
//         padding: 10,
//         flexDirection: "row",
//         flexWrap: "wrap",
//     },

//     label: {
//         width: 180,  // 63.5mm
//         height: 132, // 46.6mm
//         border: "1px solid #999",
//         padding: 4,
//         margin: 4,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         alignItems: "center"
//     },
//     productName: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
//     variation: { fontSize: 10, color: '#555', textAlign: 'center' },
//     mrp: { fontSize: 12, marginTop: 5 },
//     barcode: { marginTop: 5, width: '100%', height: 50 },
//     labelsContainer: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
// });

const generateBarcodeDataURL = async (fnsku) => {
    try {
        return await BWIPJS.toBuffer({
            bcid: 'code128',
            text: fnsku,
            scale: 2,
            height: 50,
            includetext: false,
        }).then(buffer => `data:image/png;base64,${buffer.toString('base64')}`);
    } catch (err) {
        console.error(err);
        return null;
    }
};

const styles = StyleSheet.create({
    page: {
        width: 595,
        height: 842,
        paddingTop: 15,
        paddingLeft: 11,
        paddingRight: 11,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },

    labelsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 7,   // space between labels
    },

    label: {
        width: 180,
        height: 128,
        //border: "1px solid #444",
        padding: 8,
        marginRight: 5,
        marginBottom: 3,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    productName: { fontWeight: 'bold', fontSize: 11, textAlign: 'center' },
    variation: {
        fontSize: 9,
        color: '#555',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: 170,   // wrap hone ke liye width fix karo
    },
    mrp: { fontSize: 9, marginTop: 2 },
    barcode: { marginTop: 2, width: 130, height: 40 },
    fnsku: {
        marginTop: 2,
        fontSize: 10,
        textAlign: "center",
        lineHeight: 1.0,
    }
});




const LabelsPDF = ({ entries, barcodes }) => {
    const maxLabelsPerPage = 18;
    const pages = [];

    const flatLabels = [];
    entries.forEach(item => {
        const units = item.entries[0].units;
        for (let i = 0; i < units; i++) {
            flatLabels.push(item);
        }
    });

    for (let i = 0; i < flatLabels.length; i += maxLabelsPerPage) {
        pages.push(flatLabels.slice(i, i + maxLabelsPerPage));
    }

    return (
        <Document>
            {pages.map((pageEntries, pageIndex) => (
                <Page size="A4" style={styles.page} key={pageIndex}>
                    <View style={styles.labelsContainer}>
                        {pageEntries.map((item, idx) => (
                            <View key={`${item.FNSKU}-${idx}`} style={styles.label}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                {item.variationName && <Text style={styles.variation}>{item.variationName}</Text>}
                                <Text style={styles.mrp}>MRP: ₹{item.MRP}</Text>
                                {barcodes[item.FNSKU] && <Image src={barcodes[item.FNSKU]} style={styles.barcode} />}
                                <Text style={styles.fnsku}>{item.FNSKU}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
};




const dispatchTabToWarehouse = ({
    fetchDispatches,
    dispatches,
    warehouses,
    deleteDispatch,
    updateDispatch,
}) => {
    const dispatch = useDispatch();
    const [modalData, setModalData] = useState(null);
    const [dispatchFormData, setDispatchFormData] = useState([]);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [currentDispatch, setCurrentDispatch] = useState(null);
    const [trackingId, setTrackingId] = useState("");
    const [trackingLink, setTrackingLink] = useState("");

    const [barcodeMap, setBarcodeMap] = useState({});
    useEffect(() => {
        const map = {};
        modalData?.entries.forEach(item => {
            const canvas = document.createElement("canvas");
            JsBarcode(canvas, item.FNSKU, {
                format: "CODE128",
                displayValue: false,
                width: 2,
                height: 50,
            });
            map[item.FNSKU] = canvas.toDataURL("image/png");
        });
        setBarcodeMap(map);
    }, [modalData]);
    const getWarehouseInfo = (warehouseId) => {
        const warehouse = warehouses.find(
            (w) => w.id.toString() === warehouseId.toString()
        );
        return warehouse
            ? `${warehouse.code} - ${warehouse.name}, ${warehouse.state}`
            : warehouseId;
    };

    const handleDispatchClick = (dispatchItem) => {
        console.log("Dispatch data:", dispatchItem);
        setCurrentDispatch(dispatchItem);
        setDispatchFormData([{ boxes: 1, weight: 0, length: 0, breadth: 0, height: 0 }]);
        setFormModalOpen(true);
    };

    const addMoreBoxes = () => {
        let newRow = { boxes: 1, weight: 0, length: 0, breadth: 0, height: 0 };
        if (dispatchFormData.length > 0) {
            // Copy last row values
            const lastRow = dispatchFormData[dispatchFormData.length - 1];
            newRow = { ...lastRow, boxes: 1 };
        }
        setDispatchFormData([...dispatchFormData, newRow]);
    };


    const updateRow = (index, field, value) => {
        const updated = [...dispatchFormData];
        updated[index][field] = value;
        setDispatchFormData(updated);
    };

    const calcVolume = (row) => {
        const l = row.length || 0;
        const b = row.breadth || 0;
        const h = row.height || 0;
        // Volume in kg using l*b*h / 5000
        return ((l * b * h) / 5000).toFixed(2);
    };


    const removeRow = (idx) => {
        setDispatchFormData(prev => prev.filter((_, i) => i !== idx));
    };

    const saveDispatch = (dispatchFormData, trackingId, trackingLink) => {
        const finalData = {
            boxes: dispatchFormData,
            trackingId,
            trackingLink
        };

        console.log("Final dispatch data:", finalData);
    };

    console.log("dispatchFormData", dispatchFormData)

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
                Dispatch to Warehouse
            </h1>

            {dispatches.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-400 text-lg">No dispatches available</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {dispatches.map((d) => (
                        <div
                            key={d.id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition"
                        >
                            {/* Header + Warehouses */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Dispatch #{d.id}</h2>
                                    <p className="text-gray-500 text-sm">
                                        FNSKU: <span className="font-medium">{d.totalFNSKU}</span> | Units: <span className="font-medium">{d.totalUnits}</span>
                                    </p>
                                </div>
                                <div className="py-1 sm:max-w-[250px]">
                                    {/* Date/Time on top */}
                                    <h1 className="text-sm font-medium mb-1">Created At : {new Date(d.createdAt).toLocaleString()}</h1>

                                    {/* Warehouses below */}
                                    <div className="flex flex-wrap gap-1">
                                        {Array.from(new Set(d.entries.map(e => e.entries[0].warehouseId))).map((wid) => {
                                            const warehouse = warehouses.find(w => w.id.toString() === wid.toString());
                                            if (!warehouse) return null;
                                            return (
                                                <div
                                                    key={wid}
                                                    className="bg-green-50 border border-green-200 rounded-lg px-2 py-1 text-xs font-medium "
                                                    title={`${warehouse.code} - ${warehouse.name}, ${warehouse.state}, ${warehouse.address}`}
                                                >
                                                    Sent To: {warehouse.code} - {warehouse.address}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>

                            {/* Products Table */}
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-left text-xs border border-gray-100 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-1">Product</th>
                                            <th className="p-1">FNSKU</th>
                                            <th className="p-1">Units</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {d.entries.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition">
                                                <td className="p-1 flex items-center gap-1">
                                                    <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.productName}</span>
                                                        {item.variationName && <span className="text-gray-400 text-[10px]">{item.variationName}</span>}
                                                    </div>
                                                </td>
                                                <td className="p-1">{item.FNSKU}</td>
                                                <td className="p-1 font-semibold">{item.entries[0].units}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end mt-auto">
                                <button
                                    onClick={() => setModalData(d)}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-xl hover:bg-gray-800 text-xs cursor-pointer"
                                >
                                    <Eye size={14} /> View
                                </button>
                                <button
                                    onClick={() => handleDispatchClick(d)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-xl hover:bg-green-700 text-xs cursor-pointer"
                                >
                                    <Truck size={14} /> Dispatch
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 relative">

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                            onClick={() => setFormModalOpen(false)}
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Dispatch Form - #{currentDispatch?.id}</h2>
                        <p className="text-gray-600 mb-4">
                            Fill details for each box. Volume will be calculated in kg.
                        </p>

                        {/* Totals */}
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 items-start">
                            {/* Left side: Totals */}
                            <div className="flex gap-4">
                                <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-gray-800">
                                    Total Units: {currentDispatch.totalUnits}
                                </div>
                                <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-gray-800">
                                    Total FNSKU: {currentDispatch.totalFNSKU}
                                </div>
                            </div>

                            {/* Right side: Warehouses */}
                            <div className="flex flex-col sm:items-end gap-2 sm:max-w-[400px] w-full">
                                {/* Date/Time on top */}
                                <h1 className="text-sm font-medium mb-1">
                                    Created At: {new Date(currentDispatch.createdAt).toLocaleString()}
                                </h1>

                                {/* Warehouses list */}
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {Array.from(new Set(currentDispatch.entries.map(e => e.entries[0].warehouseId))).map((wid) => {
                                        const warehouse = warehouses.find(w => w.id.toString() === wid.toString());
                                        if (!warehouse) return null;
                                        return (
                                            <div
                                                key={wid}
                                                className="bg-green-50 border border-green-200 rounded-lg px-3 py-1 text-sm font-medium"
                                                title={`${warehouse.code} - ${warehouse.name}, ${warehouse.state}, ${warehouse.address}`}
                                            >
                                                Sent To: {warehouse.code} - {warehouse.address}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>




                        {/* Boxes Form */}
                        {dispatchFormData.map((row, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 sm:grid-cols-7 gap-3 mb-4 p-3 border border-gray-200 rounded-xl items-end bg-gray-50"
                            >
                                {/* Boxes */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Boxes</label>
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="Boxes"
                                        value={row.boxes || ""}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            updateRow(idx, "boxes", isNaN(val) ? 0 : val);
                                        }}
                                        className="border p-2 rounded"
                                    />
                                </div>

                                {/* Weight */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="Weight"
                                        value={row.weight || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            updateRow(idx, "weight", isNaN(val) ? 0 : val);
                                        }}
                                        className="border p-2 rounded"
                                    />
                                </div>

                                {/* Length */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Length</label>
                                    <input
                                        type="number"
                                        placeholder="Length"
                                        value={row.length || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            updateRow(idx, "length", isNaN(val) ? 0 : val);
                                        }}
                                        className="border p-2 rounded"
                                    />
                                </div>

                                {/* Breadth */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Breadth</label>
                                    <input
                                        type="number"
                                        placeholder="Breadth"
                                        value={row.breadth || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            updateRow(idx, "breadth", isNaN(val) ? 0 : val);
                                        }}
                                        className="border p-2 rounded"
                                    />
                                </div>

                                {/* Height */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Height</label>
                                    <input
                                        type="number"
                                        placeholder="Height"
                                        value={row.height || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            updateRow(idx, "height", isNaN(val) ? 0 : val);
                                        }}
                                        className="border p-2 rounded"
                                    />
                                </div>

                                {/* Volume in kg */}
                                <div className="flex flex-col items-start">
                                    <label className="text-gray-700 text-xs font-semibold mb-1">Volume (kg)</label>
                                    <div className="text-gray-800 font-medium px-2 py-1 bg-green-100 rounded w-full text-center">
                                        {calcVolume(row)} kg
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <div className="flex flex-col items-center mt-2 sm:mt-0">
                                    <button
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs cursor-pointer"
                                        onClick={() => removeRow(idx)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add More Box */}
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer mb-4"
                            onClick={addMoreBoxes}
                        >
                            + Add More
                        </button>

                        {/* Total Summary Below */}
                        <div className="bg-gray-100 p-4 rounded mb-4 flex flex-col sm:flex-row gap-4 font-semibold text-gray-800">
                            <div>Total Boxes: {dispatchFormData.reduce((sum, row) => sum + (row.boxes || 0), 0)}</div>
                            <div>Total Weight: {dispatchFormData.reduce((sum, row) => sum + ((row.weight || 0) * (row.boxes || 0)), 0)} kg</div>
                            <div>Total Volume: {dispatchFormData.reduce((sum, row) => sum + ((row.boxes || 0) * parseFloat(calcVolume(row))), 0).toFixed(2)} kg</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col">
                                <label className="text-gray-700 text-xs font-semibold mb-1">Tracking ID</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="border p-2 rounded"
                                    placeholder="Enter Tracking ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 text-xs font-semibold mb-1">Tracking Link</label>
                                <input
                                    type="text"
                                    value={trackingLink}
                                    onChange={(e) => setTrackingLink(e.target.value)}
                                    className="border p-2 rounded"
                                    placeholder="Enter Tracking Link"
                                />
                            </div>
                        </div>



                        {/* Modal Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                            <button
                                className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                                onClick={() => setFormModalOpen(false)}
                            >
                                Close
                            </button>

                            <button
                                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md font-semibold"
                                onClick={() => saveDispatch(dispatchFormData, trackingId, trackingLink)}
                            >
                                Save Draft
                            </button>



                            <button
                                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                                onClick={() => {
                                    const finalData = {
                                        boxes: dispatchFormData,
                                        trackingId,
                                        trackingLink
                                    };
                                    console.log("Final dispatch form data:", finalData);
                                    toast.success("Dispatch data ready!");
                                    setFormModalOpen(false);
                                }}
                            >
                                Submit
                            </button>

                        </div>
                    </div>
                </div>
            )}




            {/* Modal */}
            {modalData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative border border-gray-200 p-6">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                            onClick={() => setModalData(null)}
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispatch #{modalData.id}</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 text-gray-700">
                            {/* Left side: FNSKU / Units */}
                            <div className="flex gap-4">
                                <p>
                                    <span className="font-semibold">Total FNSKU:</span> {modalData.totalFNSKU}
                                </p>
                                <p>
                                    <span className="font-semibold">Total Units:</span> {modalData.totalUnits}
                                </p>
                            </div>

                            {/* Right side: Warehouses */}
                            <div className="overflow-x-auto py-2">
                                <div className="flex gap-2 min-w-max justify-end">
                                    {Array.from(new Set(modalData.entries.map(e => e.entries[0].warehouseId))).map((wid) => {
                                        const warehouse = warehouses.find(w => w.id.toString() === wid.toString());
                                        if (!warehouse) return null;
                                        return (
                                            <div
                                                key={wid}
                                                className="flex-shrink-0 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm font-medium truncate"
                                                title={`${warehouse.code} - ${warehouse.name}, ${warehouse.state}, ${warehouse.address}`}
                                            >
                                                Sent To: {warehouse.code} - {warehouse.address}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>



                        {/* Products Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border border-gray-100 rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">Product</th>
                                        <th className="p-2">Price</th>
                                        <th className="p-2">FNSKU</th>
                                        <th className="p-2">MRP</th>
                                        {/* <th className="p-2">Warehouse</th> */}
                                        <th className="p-2">Units</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.entries.map((item, idx) => (
                                        <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition">
                                            <td className="p-2 flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.productName}</span>
                                                    {item.variationName && (
                                                        <span className="text-gray-400 text-xs">{item.variationName}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2">{item.price}</td>
                                            <td className="p-2">{item.FNSKU}</td>
                                            <td className="p-2">₹{item.MRP}</td>
                                            {/* <td className="p-2">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {getWarehouseInfo(item.entries[0].warehouseId)}
                                                </span>
                                            </td> */}
                                            <td className="p-2 font-semibold">{item.entries[0].units}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between mt-6">
                            <PDFDownloadLink
                                document={<LabelsPDF entries={modalData.entries} barcodes={barcodeMap} />}
                                fileName={`Dispatch_${modalData.id}_Labels.pdf`}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                            >
                                {({ loading }) => (loading ? "Preparing PDF..." : "Print Labels")}
                            </PDFDownloadLink>
                            <button
                                onClick={() => setModalData(null)}
                                className="px-6 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>


    );
};

export default dispatchTabToWarehouse;
