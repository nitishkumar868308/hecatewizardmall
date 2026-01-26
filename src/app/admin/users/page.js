"use client";
import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { useDispatch, useSelector } from "react-redux";
import {
    AiOutlinePlus,
    AiOutlineSearch,
    AiOutlineClose,
    AiOutlineEye,
    AiOutlineEdit,
} from "react-icons/ai";
import toast from "react-hot-toast";
import ViewUserModal from "@/components/Custom/ViewUserModal";
import { fetchCart } from "@/app/redux/slices/addToCart/addToCartSlice";
import { fetchOrders } from "@/app/redux/slices/order/orderSlice";
import Pagination from "@/components/Pagination";
import { registerUser } from "@/app/redux/slices/authSlice";

const Page = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector(
        (state) => state.getAllUser
    );
    const [role, setRole] = useState("USER");

    const { orders } = useSelector((state) => state.order);
    console.log("orders", orders)
    const [modalOpen, setModalOpen] = useState(false);
    const [actionModal, setActionModal] = useState({ open: false, user: null, type: "" });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [search, setSearch] = useState("");
    const { items } = useSelector((state) => state.cart);
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    console.log("items", items)
    console.log("users", users)
    // Fetch users
    useEffect(() => {
        dispatch(fetchOrders())
        dispatch(fetchCart())
        dispatch(fetchAllUsers());
    }, [dispatch]);

    // Random password generator
    function generateRandomPassword(length = 8) {
        const chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Add user
    const handleAddUser = async (e) => {
        e.preventDefault();
        const password = generateRandomPassword();
        const resultAction = await dispatch(registerUser({ name, email, role, password }));
        console.log("resultAction", resultAction);

        if (resultAction?.payload?.success) {
            toast.success(resultAction.payload.message || "User added successfully");
            setName("");
            setEmail("");
            setRole("USER");
            setModalOpen(false);
            dispatch(fetchAllUsers())
        } else {
            toast.error(resultAction.payload?.message || "Registration failed");
        }
    };
    // Filter users
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.phone || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / userPerPage);

    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUser = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <DefaultPageAdmin>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">All Users</h1>

                    <div className="flex gap-2 flex-col md:flex-row items-center">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email, phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full md:w-72"
                            />
                            <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>

                        {/* Add User Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            <AiOutlinePlus /> Add User
                        </button>
                    </div>
                </div>

                {/* Status */}
                {loading && <p className="text-gray-500">Loading users...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Users Table */}
                {currentUser.length > 0 ? (
                    <div className="overflow-x-auto">
                        <div className="min-w-full align-middle">
                            <div className="shadow overflow-hidden border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                S.No
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Provider
                                            </th>
                                            <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentUser.map((user, idx) => (
                                            <tr
                                                key={user.id}
                                                className={`transition transform hover:scale-[1.01] hover:bg-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap text-gray-800 font-medium">
                                                    {indexOfFirstUser + idx + 1}.
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {user.phone || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role.toLowerCase() === "admin"
                                                            ? "bg-black text-white"
                                                            : "bg-gray-200 text-gray-800"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {user.provider || "LOCAL"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            // Filter items for this user
                                                            const userItems = items.filter((item) => item.userId === user.id);
                                                            const userOrders = orders.filter(o => o.userId === user.id);
                                                            setActionModal({
                                                                open: true,
                                                                user: { ...user, items: userItems, orders: userOrders },
                                                                type: "view",
                                                            });
                                                        }}
                                                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                                                    >
                                                        <AiOutlineEye size={18} />
                                                    </button>

                                                    {/* <button
                                                        onClick={() =>
                                                            setActionModal({
                                                                open: true,
                                                                user,
                                                                type: "edit",
                                                            })
                                                        }
                                                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                                                    >
                                                        <AiOutlineEdit size={18} />
                                                    </button> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4">No users found.</p>
                )}

                {totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Add User Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
                        <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                            <h2 className="text-xl font-bold mb-4">Add User</h2>
                            <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full"
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full"
                                >
                                    <option value="USER">User</option>
                                    <option value="ASTROLOGER">Astrologer</option>
                                </select>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
                                >
                                    Add User
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Action Modal (Edit/View) */}
                {actionModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
                        <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                            <button
                                onClick={() => setActionModal({ open: false, user: null, type: "" })}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <AiOutlineClose size={20} />
                            </button>

                            {actionModal.type === "view" && (
                                <ViewUserModal
                                    user={actionModal.user}
                                    isOpen={actionModal.open}
                                    onClose={() => setActionModal({ open: false, user: null, type: "" })}
                                />
                            )}

                            {actionModal.type === "edit" && (
                                <>
                                    <h2 className="text-xl font-bold mb-4">Edit User</h2>
                                    <form
                                        className="flex flex-col gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            toast.success("Edit user feature not implemented yet!");
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            defaultValue={actionModal.user.name}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            defaultValue={actionModal.user.email}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DefaultPageAdmin>
    );
};

export default Page;
