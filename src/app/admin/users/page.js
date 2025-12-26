"use client";
import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { registerUser } from '@/app/redux/slices/authSlice';
import toast from 'react-hot-toast';

const Page = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector(
        (state) => state.getAllUser
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [search, setSearch] = useState("");

    function generateRandomPassword(length = 8) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }


    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        console.log("Add user:", { name, email });
        const resultAction = await dispatch(registerUser({
            name: name,
            email: email,
            password: generateRandomPassword(),
        }));
        console.log("resultAction", resultAction)
        if (registerUser.fulfilled.match(resultAction)) {

            toast.success(resultAction.payload.message || 'Registration successful');
            setName("");
            setEmail("");
            setModalOpen(false);
        } else {
            toast.error(resultAction.payload?.message || 'Registration failed');
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.phone || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DefaultPageAdmin>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>

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
                {filteredUsers.length > 0 ? (
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user, idx) => (
                                            <tr
                                                key={user.id}
                                                className={`transition transform hover:scale-[1.01] hover:bg-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap text-gray-800 font-medium">
                                                    {idx + 1}
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

                {/* Add User Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 backdrop-blur-md">
                        <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                            <h2 className="text-xl font-bold mb-4">Add User</h2>
                            <form
                                onSubmit={handleAddUser}
                                className="flex flex-col gap-4"
                            >
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
            </div>
        </DefaultPageAdmin>
    );
};

export default Page;
