"use client";
import React, { useState } from "react";
import DefaultPageAdmin from "../Include/DefaultPageAdmin/DefaultPageAdmin";
import { Search, Plus } from "lucide-react";
import CreateOrderModal from "./CreateOrderModal";

const OrderManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <DefaultPageAdmin>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search orders..."
            className="w-full pl-9 py-2 border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((o) => (
              <tr key={o} className="border-t hover:bg-gray-50">
                <td className="p-3">#ORD{o}01</td>
                <td>Rahul Sharma</td>
                <td>₹2400</td>
                <td>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    Paid
                  </span>
                </td>
                <td>25 Dec 2025</td>
                <td className="text-right pr-4">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && <CreateOrderModal onClose={() => setOpen(false)} />}
    </DefaultPageAdmin>
  );
};

export default OrderManagement;
