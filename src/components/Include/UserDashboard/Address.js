import React from 'react'
import { Edit, Trash2, Plus } from "lucide-react";

const Address = () => {
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Your Addresses</h2>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </button>
                </div>

                <ul className="space-y-4">
                    {[
                        { label: "Home", address: "123 Street, City, State, 12345" },
                        { label: "Office", address: "456 Street, City, State, 67890" },
                    ].map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
                            <div>
                                <p className="font-semibold text-gray-800 text-lg">{item.label}</p>
                                <p className="text-gray-500 text-sm mt-1">{item.address}</p>
                            </div>
                            <div className="flex space-x-3">
                                {/* Edit Icon */}
                                <button className="text-blue-600 hover:text-blue-800 transition cursor-pointer">
                                    <Edit className="h-4 w-4" />
                                </button>

                                {/* Delete Icon */}
                                <button className="text-red-600 hover:text-red-800 transition cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Address