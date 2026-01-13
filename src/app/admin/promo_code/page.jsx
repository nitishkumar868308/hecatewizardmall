"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";

import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import {
  fetchPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode
} from "@/app/redux/slices/promoCode/promoCodeSlice";
import { getApplyPromoCode } from "@/app/redux/slices/promoCode/promoCodeSlice";

const emptyPromo = {
  id: null,
  code: "",
  discountType: "FLAT",
  discountValue: "",
  validFrom: "",
  validTill: "",
  appliesTo: "ALL_USERS",


  usageLimit: "",
  users: [],

  userSearch: ""
};


export default function Page() {
  const dispatch = useDispatch();

  const { list: users = [] } = useSelector((s) => s.getAllUser);
  const { promoCodes = [], loading } = useSelector((s) => s.promoCode);
  console.log("promoCodes", promoCodes)

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [search, setSearch] = useState("");
  const [promo, setPromo] = useState(emptyPromo);

  const { appliedPromoCodes } = useSelector((s) => s.promoCode);
  console.log("appliedPromoCodes", appliedPromoCodes)

  const [activeTab, setActiveTab] = useState("PROMOS");
  const [usageSearch, setUsageSearch] = useState("");


  useEffect(() => {
    dispatch(getApplyPromoCode())
    dispatch(fetchAllUsers());
    dispatch(fetchPromoCodes());
  }, [dispatch]);

  const filteredPromos = (promoCodes || []).filter((p) =>
    p?.code?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(promo.userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(promo.userSearch.toLowerCase())
  );

  // ================= SAVE PROMO =================
  const handleSave = async () => {
    if (!promo.code || !promo.discountValue || !promo.validFrom || !promo.validTill)
      return alert("All fields required");

    const payload = {
      id: promo.id,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: Number(promo.discountValue),
      validFrom: promo.validFrom,
      validTill: promo.validTill,
      usageLimit: promo.usageLimit ? Number(promo.usageLimit) : null,
      appliesTo: promo.appliesTo,
      users: promo.appliesTo === "SPECIFIC_USERS" ? promo.users : []
    };

    promo.id
      ? await dispatch(updatePromoCode(payload))
      : await dispatch(createPromoCode(payload));

    dispatch(fetchPromoCodes());
    setModalOpen(false);
    setPromo(emptyPromo);
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setPromo({
      id: p.id,
      code: p.code,
      discountType: p.discountType,
      discountValue: p.discountValue,
      validFrom: p.validFrom.split("T")[0],
      validTill: p.validTill.split("T")[0],
      usageLimit: p.usageLimit || "",
      appliesTo: p.appliesTo,
      users: p.users?.map(u => ({
        userId: u.userId,
        usageLimit: u.usageLimit || ""
      })) || [],
      userSearch: ""
    });
    setModalOpen(true);
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    await dispatch(deletePromoCode(selectedPromo.id));
    setDeleteModal(false);
    setSelectedPromo(null);
  };

  // ================= TOGGLE ACTIVE =================
  const toggleActive = async (p) => {
    console.log("activeid", p)
    await dispatch(updatePromoCode({ ...p, active: !p.active }));
  };

  const filteredUsage = appliedPromoCodes.filter((u) => {
    const user = users.find(x => x.id === u.userId);
    return (
      user?.name?.toLowerCase().includes(usageSearch.toLowerCase()) ||
      user?.email?.toLowerCase().includes(usageSearch.toLowerCase()) ||
      u?.promo?.code?.toLowerCase().includes(usageSearch.toLowerCase())
    );
  });

  const isExpired = (validTill) => {
    if (!validTill) return false;

    const now = new Date();

    const till = new Date(validTill);
    till.setHours(23, 59, 59, 999); // END OF DAY

    return now > till;
  };

  const isLiveSoon = (validFrom) => {
    if (!validFrom) return false;

    const now = new Date();
    const from = new Date(validFrom);
    from.setHours(0, 0, 0, 0);

    return now < from;
  };


  return (
    <DefaultPageAdmin>
      <div className="space-y-6">
        <div className="flex gap-4 border-b mb-4">
          <button
            className={`pb-2 ${activeTab === "PROMOS"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("PROMOS")}
          >
            Promo Codes
          </button>

          <button
            className={`pb-2 ${activeTab === "USAGE"
              ? "border-b-2 border-black font-semibold"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("USAGE")}
          >
            Promo Usage
          </button>
        </div>

        {/* HEADER */}


        {/* TABLE Promo */}
        {activeTab === "PROMOS" && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Promo Codes</h1>
              <div className="flex gap-2">
                <input
                  className="border px-3 py-2"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="bg-black text-white px-4 py-2"
                  onClick={() => {
                    setPromo(emptyPromo);
                    setModalOpen(true);
                  }}
                >
                  Add Promo
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">#</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Discount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Validity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Usage</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Applies To</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">User</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(filteredPromos || []).map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{idx + 1}. </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.code || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.discountType} {p.discountValue}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>
                          {p.validFrom ? new Date(p.validFrom).toLocaleDateString() : "-"} →{" "}
                          {p.validTill ? new Date(p.validTill).toLocaleDateString() : "-"}
                        </div>

                        {isExpired(p.validTill) && (
                          <div className="text-xs text-red-600 font-semibold mt-1">
                            Expired
                          </div>
                        )}

                        {!isExpired(p.validTill) && isLiveSoon(p.validFrom) && (
                          <div className="text-xs text-yellow-600 font-semibold mt-1">
                            Live Soon
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-600">{p.usageLimit || "∞"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.appliesTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.appliesTo === "ALL_USERS" ? (
                          "All Users"
                        ) : (
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {(Array.isArray(p.eligibleUsers?.create) ? p.eligibleUsers.create : []).map((eu) => {
                              const matchedUser = users.find(u => u.id === eu.userId);
                              return matchedUser ? (
                                <div key={eu.userId} className="flex justify-between gap-2">
                                  <span className="font-medium">{matchedUser.name}</span>
                                  <span className="text-gray-500 text-xs">{matchedUser.email}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {/* Modern toggle switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={p.active}
                            onChange={() => toggleActive(p)}
                          />
                          <div
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${p.active ? "bg-green-500" : "bg-gray-300"
                              }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${p.active ? "translate-x-6" : "translate-x-0"
                                }`}
                            />
                          </div>
                        </label>

                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPromo(p);
                            setDeleteModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!(filteredPromos || []).length && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        {loading ? "Loading..." : "No promo codes found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TABLE User Promo usage */}
        {activeTab === "USAGE" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <h2 className="text-xl font-semibold">Promo Usage Analytics</h2>

              {/* Total discount display */}
              <div className="text-sm font-semibold text-green-700">
                Total Discount: ₹{filteredUsage.reduce((acc, u) => acc + (u.discountAmount || 0), 0)}
              </div>

              <input
                className="border px-3 py-2 rounded w-full sm:w-64"
                placeholder="Search user / promo"
                value={usageSearch}
                onChange={(e) => setUsageSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-xl shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">User</th>
                    <th className="px-4 py-3 text-left text-sm">Promo</th>
                    <th className="px-4 py-3 text-left text-sm">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm">Order Amt</th>
                    <th className="px-4 py-3 text-left text-sm">Discount</th>
                    <th className="px-4 py-3 text-left text-sm">Used At</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsage.length > 0 ? (
                    filteredUsage.map((u) => {
                      const user = users.find(x => x.id === u.userId);

                      return (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                          {/* USER */}
                          <td className="px-4 py-3">
                            <div className="font-medium">{user?.name || "Unknown"}</div>
                            <div className="text-xs text-gray-500">{user?.email || "-"}</div>
                          </td>

                          {/* PROMO */}
                          <td className="px-4 py-3 font-medium">
                            {u.promo?.code || "-"}
                            <div className="text-xs text-gray-500">
                              {u.promo?.discountType === "FLAT"
                                ? `₹${u.promo.discountValue} OFF`
                                : `${u.promo.discountValue}% OFF`}
                            </div>
                          </td>

                          {/* ORDER */}
                          <td className="px-4 py-3">#{u.orderId}</td>

                          {/* AMOUNTS */}
                          <td className="px-4 py-3">₹{u.subtotal}</td>

                          {/* DISCOUNT */}
                          <td className="px-4 py-3 text-green-600 font-semibold">
                            -₹{u.discountAmount}
                          </td>

                          {/* USED AT */}
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No promo usage found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}



        {/* SPECIFIC USERS (Read-only view) */}
        {promo.appliesTo === "SPECIFIC_USERS" && (
          <div className="border rounded p-2 max-h-56 overflow-y-auto mb-2">
            <h3 className="font-medium mb-2">Eligible Users:</h3>
            {promo.users.map((u) => (
              <div key={u.userId} className="flex justify-between px-2 py-1 border-b last:border-b-0">
                <span className="font-medium">{u.name}</span>
                <span className="text-gray-600 text-sm truncate">{u.email}</span>
              </div>
            ))}
          </div>
        )}



        {/* ADD / EDIT MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                {promo.id ? "Edit Promo" : "Add Promo"}
              </h2>

              {/* Code */}
              <input
                className="border w-full mb-2 p-2 rounded"
                placeholder="Promo Code"
                value={promo.code}
                onChange={(e) => setPromo({ ...promo, code: e.target.value })}
              />

              {/* Discount */}
              <div className="flex gap-2 mb-2">
                <select
                  className="border p-2 w-full rounded"
                  value={promo.discountType}
                  onChange={(e) =>
                    setPromo({ ...promo, discountType: e.target.value })
                  }
                >
                  <option value="FLAT">Flat</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>

                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  placeholder="Discount Value"
                  value={promo.discountValue}
                  onChange={(e) =>
                    setPromo({ ...promo, discountValue: e.target.value })
                  }
                />
              </div>

              {/* Validity */}
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={promo.validFrom}
                  onChange={(e) =>
                    setPromo({ ...promo, validFrom: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={promo.validTill}
                  onChange={(e) =>
                    setPromo({ ...promo, validTill: e.target.value })
                  }
                />
              </div>

              {/* Applies To */}
              <select
                className="border p-2 w-full mb-2 rounded"
                value={promo.appliesTo}
                onChange={(e) =>
                  setPromo({
                    ...promo,
                    appliesTo: e.target.value,
                    users: [],
                    usageLimit: ""
                  })
                }
              >
                <option value="ALL_USERS">All Users</option>
                <option value="SPECIFIC_USERS">Specific Users</option>
              </select>



              {/* SPECIFIC USERS */}
              {promo.appliesTo === "SPECIFIC_USERS" && (
                <div className="border rounded p-2 max-h-56 overflow-y-auto">
                  <input
                    className="border p-1 w-full mb-2 rounded"
                    placeholder="Search user"
                    value={promo.userSearch}
                    onChange={(e) =>
                      setPromo({ ...promo, userSearch: e.target.value })
                    }
                  />

                  {filteredUsers.map((u) => {
                    const selected = promo.users.find(x => x.userId === u.id);

                    return (
                      <div key={u.id} className="flex items-center gap-2 mb-1">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPromo({
                                  ...promo,
                                  users: [...promo.users, { userId: u.id }]
                                });
                              } else {
                                setPromo({
                                  ...promo,
                                  users: promo.users.filter(x => x.userId !== u.id)
                                });
                              }
                            }}
                          />
                          {u.name} ({u.email})
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* GLOBAL USAGE LIMIT */}
              <div className="mb-2">
                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  placeholder="Usage limit (blank = unlimited)"
                  value={promo.usageLimit}
                  onChange={(e) =>
                    setPromo({ ...promo, usageLimit: e.target.value })
                  }
                />
              </div>


              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="border px-4 py-2 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save Promo
                </button>
              </div>
            </div>
          </div>
        )}


        {/* DELETE MODAL */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4">
              <p>Delete promo <b>{selectedPromo.code}</b>?</p>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setDeleteModal(false)}>Cancel</button>
                <button className="text-red-600" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultPageAdmin>
  );
}
