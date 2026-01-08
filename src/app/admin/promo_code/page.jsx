// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";

// import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
// import {
//     fetchPromoCodes,
//     createPromoCode,
//     updatePromoCode,
//     deletePromoCode,
// } from "@/app/redux/slices/promoCode";

// const Page = () => {
//     const dispatch = useDispatch();

//     // ===== Redux state =====
//     const { list: usersList = [] } = useSelector((state) => state.getAllUser);
//     const { promoCodes, loading: promoLoading } = useSelector((state) => state.promoCode);

//     // ===== Local states =====
//     const [modalOpen, setModalOpen] = useState(false);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedPromo, setSelectedPromo] = useState(null);
//     const [search, setSearch] = useState("");
//     const [newPromo, setNewPromo] = useState({
//         id: null,
//         code: "",
//         type: "Flat",
//         amount: "",
//         startDate: "",
//         endDate: "",
//         forAll: true,
//         selectedUsers: [],
//         userSearch: "",
//     });

//     // ===== Fetch data on load =====
//     useEffect(() => {
//         dispatch(fetchAllUsers());
//         dispatch(fetchPromoCodes());
//     }, [dispatch]);

//     // ===== Filter promo codes =====
//     const filteredPromoCodes = promoCodes.filter((p) =>
//         p.code.toLowerCase().includes(search.toLowerCase())
//     );

//     // ===== Filter users for selection =====
//     const filteredUsers = usersList.filter(
//         (u) =>
//             u.name.toLowerCase().includes(newPromo.userSearch.toLowerCase()) ||
//             u.email.toLowerCase().includes(newPromo.userSearch.toLowerCase())
//     );

//     // ===== Save / Add promo =====
//     const handleSavePromo = async () => {
//         if (!newPromo.code || !newPromo.amount || !newPromo.startDate || !newPromo.endDate)
//             return alert("All fields are required");

//         const payload = {
//             id: newPromo.id,
//             code: newPromo.code,
//             type: newPromo.type,
//             amount: Number(newPromo.amount),
//             validity: `${newPromo.startDate} to ${newPromo.endDate}`,
//             users: newPromo.forAll
//                 ? []
//                 : usersList
//                     .filter((u) => newPromo.selectedUsers.includes(u.id))
//                     .map((u) => u.id),
//             active: true,
//         };

//         try {
//             if (newPromo.id) {
//                 await dispatch(updatePromoCode(payload));
//             } else {
//                 await dispatch(createPromoCode(payload));
//             }
//             setModalOpen(false);
//             setNewPromo({
//                 id: null,
//                 code: "",
//                 type: "Flat",
//                 amount: "",
//                 startDate: "",
//                 endDate: "",
//                 forAll: true,
//                 selectedUsers: [],
//                 userSearch: "",
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // ===== Delete promo =====
//     const handleDeletePromo = async () => {
//         if (!selectedPromo) return;
//         try {
//             await dispatch(deletePromoCode(selectedPromo.id));
//             setSelectedPromo(null);
//             setDeleteModalOpen(false);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // ===== Toggle active / inactive =====
//     const handleToggleActive = async (promo) => {
//         try {
//             await dispatch(
//                 updatePromoCode({ ...promo, active: !promo.active })
//             );
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // ===== Edit promo =====
//     const handleEdit = (promo) => {
//         setNewPromo({
//             id: promo.id,
//             code: promo.code,
//             type: promo.type,
//             amount: promo.amount,
//             startDate: promo.validity.split(" to ")[0],
//             endDate: promo.validity.split(" to ")[1],
//             forAll: promo.users.length === 0,
//             selectedUsers: promo.users.map((u) => u.id),
//             userSearch: "",
//         });
//         setModalOpen(true);
//     };

//     return (
//         <DefaultPageAdmin>
//             <div className="space-y-6">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <h1 className="text-2xl font-bold text-black">Promo Codes</h1>
//                     <div className="flex flex-col md:flex-row gap-2">
//                         <input
//                             type="text"
//                             placeholder="Search Promo Codes..."
//                             className="border border-black rounded px-3 py-2 w-full md:w-64"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                         <button
//                             className="border bg-black border-black px-4 py-2 rounded text-white hover:bg-gray-900 transition"
//                             onClick={() => {
//                                 setNewPromo({
//                                     id: null,
//                                     code: "",
//                                     type: "Flat",
//                                     amount: "",
//                                     startDate: "",
//                                     endDate: "",
//                                     forAll: true,
//                                     selectedUsers: [],
//                                     userSearch: "",
//                                 });
//                                 setModalOpen(true);
//                             }}
//                         >
//                             Add Promo Code
//                         </button>
//                     </div>
//                 </div>

//                 {/* Promo Codes Table */}
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border border-black bg-white text-sm">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-2 border-b border-black text-left">Code</th>
//                                 <th className="px-4 py-2 border-b border-black text-left">Type</th>
//                                 <th className="px-4 py-2 border-b border-black text-left">Amount</th>
//                                 <th className="px-4 py-2 border-b border-black text-left">Validity</th>
//                                 <th className="px-4 py-2 border-b border-black text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredPromoCodes.length ? (
//                                 filteredPromoCodes.map((promo) => (
//                                     <tr key={promo.id} className="hover:bg-gray-50 transition">
//                                         <td className="px-4 py-2 border-b border-black">{promo.code}</td>
//                                         <td className="px-4 py-2 border-b border-black">{promo.type}</td>
//                                         <td className="px-4 py-2 border-b border-black">{promo.amount}</td>
//                                         <td className="px-4 py-2 border-b border-black">{promo.validity}</td>
//                                         <td className="px-4 py-2 border-b border-black flex gap-2">
//                                             <button
//                                                 className={`px-2 py-1 border border-black rounded text-sm ${promo.active ? "bg-black text-white" : "bg-white text-black"
//                                                     }`}
//                                                 onClick={() => handleToggleActive(promo)}
//                                             >
//                                                 {promo.active ? "Active" : "Inactive"}
//                                             </button>
//                                             <button
//                                                 className="px-2 py-1 border border-black rounded text-sm"
//                                                 onClick={() => handleEdit(promo)}
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 className="px-2 py-1 border border-black rounded text-sm text-red-600"
//                                                 onClick={() => {
//                                                     setSelectedPromo(promo);
//                                                     setDeleteModalOpen(true);
//                                                 }}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={5} className="text-center py-4 text-gray-500">
//                                         {promoLoading ? "Loading..." : "No promo codes found."}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Add/Edit Modal */}
//                 {modalOpen && (
//                     <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white border border-black rounded-lg w-full max-w-3xl p-4 relative">
//                             <button
//                                 className="absolute top-3 right-3 text-black hover:text-gray-600"
//                                 onClick={() => setModalOpen(false)}
//                             >
//                                 ✕
//                             </button>

//                             <h2 className="text-xl font-semibold mb-4">
//                                 {newPromo.id ? "Edit Promo" : "Add Promo"}
//                             </h2>

//                             <div className="space-y-3">
//                                 <input
//                                     type="text"
//                                     placeholder="Promo Code"
//                                     className="border border-black px-3 py-2 rounded w-full"
//                                     value={newPromo.code}
//                                     onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
//                                 />

//                                 <div className="flex gap-2">
//                                     <select
//                                         className="border border-black px-3 py-2 rounded w-full"
//                                         value={newPromo.type}
//                                         onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
//                                     >
//                                         <option value="Flat">Flat</option>
//                                         <option value="Percentage">Percentage</option>
//                                     </select>

//                                     <input
//                                         type="number"
//                                         placeholder="Amount"
//                                         className="border border-black px-3 py-2 rounded w-full"
//                                         value={newPromo.amount}
//                                         onChange={(e) => setNewPromo({ ...newPromo, amount: e.target.value })}
//                                     />
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <input
//                                         type="date"
//                                         className="border border-black px-3 py-2 rounded w-full"
//                                         value={newPromo.startDate}
//                                         onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
//                                     />
//                                     <input
//                                         type="date"
//                                         className="border border-black px-3 py-2 rounded w-full"
//                                         value={newPromo.endDate}
//                                         onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
//                                     />
//                                 </div>

//                                 {/* All / Specific Users */}
//                                 <div className="flex items-center gap-4">
//                                     <label className="flex items-center gap-2">
//                                         <input
//                                             type="radio"
//                                             checked={newPromo.forAll}
//                                             onChange={() =>
//                                                 setNewPromo({ ...newPromo, forAll: true, selectedUsers: [] })
//                                             }
//                                         />
//                                         All Users
//                                     </label>
//                                     <label className="flex items-center gap-2">
//                                         <input
//                                             type="radio"
//                                             checked={!newPromo.forAll}
//                                             onChange={() => setNewPromo({ ...newPromo, forAll: false })}
//                                         />
//                                         Specific Users
//                                     </label>
//                                 </div>

//                                 {!newPromo.forAll && (
//                                     <div className="space-y-2 border border-black rounded p-2 max-h-60 overflow-y-auto">
//                                         <input
//                                             type="text"
//                                             placeholder="Search by name or email"
//                                             className="border border-black px-3 py-1 rounded w-full"
//                                             value={newPromo.userSearch}
//                                             onChange={(e) =>
//                                                 setNewPromo({ ...newPromo, userSearch: e.target.value })
//                                             }
//                                         />
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
//                                             {filteredUsers.map((user) => (
//                                                 <label key={user.id} className="flex items-center gap-2">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={newPromo.selectedUsers.includes(user.id)}
//                                                         onChange={(e) => {
//                                                             if (e.target.checked) {
//                                                                 setNewPromo({
//                                                                     ...newPromo,
//                                                                     selectedUsers: [...newPromo.selectedUsers, user.id],
//                                                                 });
//                                                             } else {
//                                                                 setNewPromo({
//                                                                     ...newPromo,
//                                                                     selectedUsers: newPromo.selectedUsers.filter(
//                                                                         (id) => id !== user.id
//                                                                     ),
//                                                                 });
//                                                             }
//                                                         }}
//                                                     />
//                                                     {user.name} ({user.email})
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <button
//                                     className="border border-black px-6 py-2 rounded hover:bg-gray-100 transition"
//                                     onClick={handleSavePromo}
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Delete Confirmation Modal */}
//                 {deleteModalOpen && selectedPromo && (
//                     <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white border border-black rounded-lg w-full max-w-md p-4">
//                             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//                             <p className="mb-4">
//                                 Are you sure you want to delete promo{" "}
//                                 <strong>{selectedPromo.code}</strong>?
//                             </p>
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     className="border border-black px-4 py-2 rounded hover:bg-gray-100"
//                                     onClick={() => setDeleteModalOpen(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="border border-black px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//                                     onClick={handleDeletePromo}
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </DefaultPageAdmin>
//     );
// };

// export default Page;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page