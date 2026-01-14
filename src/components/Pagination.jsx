// components/Pagination.jsx
"use client";
import React from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
    const pageNumbers = [];
    const delta = 2; // number of pages to show before and after current

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            pageNumbers.push(i);
        } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
            pageNumbers.push("...");
        }
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
                Prev
            </button>

            {pageNumbers.map((num, idx) =>
                num === "..." ? (
                    <span key={idx} className="px-2 py-1">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(num)}
                        className={`px-3 py-1 rounded hover:bg-gray-300 ${num === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        {num}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
