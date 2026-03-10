import React from 'react'

const otherPricing = () => {
    return (
        <>
            <div className="px-4 pb-4 bg-white space-y-4">

                {/* Shipping Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Price
                    </label>
                    <input
                        type="number"
                        placeholder="Enter shipping price"
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Note / Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note / Info for User
                    </label>
                    <textarea
                        rows="3"
                        placeholder="Write additional info to send to user..."
                        className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                {/* Send Button */}
                <button
                    className="w-full bg-gray-600 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition cursor-pointer"
                >
                    Save & Send
                </button>

            </div>
        </>
    )
}

export default otherPricing