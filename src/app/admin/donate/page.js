"use client"
import React, { useEffect, useState } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDonations,
    createDonation,
    updateDonation,
    deleteDonation,
    donateToCampaign,
    fetchUserDonations,
    toggleCampaignStatus
} from "@/app/redux/slices/donate/donateSlice";
import toast from "react-hot-toast";

const DonationPage = () => {
    const dispatch = useDispatch();
    const { campaigns, userDonations, loading } = useSelector((state) => state.donation);
    console.log("userDonations", userDonations)
    console.log("campaigns", campaigns)

    const [activeTab, setActiveTab] = useState("campaigns");
    const [form, setForm] = useState({ id: null, title: "", description: "", amounts: "" });


    // Fetch campaigns and user donations on mount
    useEffect(() => {
        dispatch(fetchDonations());
        dispatch(fetchUserDonations());
    }, [dispatch]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle form submit for adding/updating donation campaign
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title || !form.description || !form.amounts) {
            return toast.error("All fields required");
        }

        const payload = {
            id: form.id,
            title: form.title,
            description: form.description,
            amounts: form.amounts.split(",").map(a => a.trim()),
        };

        if (form.id) {
            dispatch(updateDonation(payload));
        } else {
            dispatch(createDonation(payload));
        }

        setForm({ id: null, title: "", description: "", amounts: "" });
    };


    // Edit campaign
    const handleEdit = (campaign) => {
        setForm({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            amounts: campaign.amounts?.join(", ") || "",
        });
    };

    // Delete campaign
    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        dispatch(deleteDonation(id))
            .unwrap()
            .then(() => toast.success("Campaign deleted"))
            .catch((err) => toast.error(err.message || "Delete failed"));
    };

    // User donation
    const handleDonate = (id) => {
        const userName = prompt("Enter your name to donate:");
        if (!userName) return;

        const amount = prompt("Enter donation amount:");
        if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Invalid amount");

        dispatch(donateToCampaign({ donationCampaignId: id, userName, amount: Number(amount) }))
            .unwrap()
            .then(() => toast.success("Donation successful"))
            .catch((err) => toast.error(err.message || "Donation failed"));
    };

    const sortedDonations = [...userDonations].sort(
        (a, b) => new Date(b.donatedAt) - new Date(a.donatedAt)
    );

    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(sortedDonations.length / ITEMS_PER_PAGE);

    const paginatedDonations = sortedDonations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    return (
        <DefaultPageAdmin>
            <div className="p-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Donation Management</h1>

                {/* Form */}
                <div className="bg-white shadow-md rounded p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit" : "Add"} Donation Campaign</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block font-medium mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">
                                Donation Amounts (comma separated)
                            </label>
                            <input
                                type="text"
                                name="amounts"
                                placeholder="1, 5, 10, 50"
                                value={form.amounts}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>
                        <button
                            type="submit"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
                            disabled={loading}
                        >
                            {form.id ? "Update Campaign" : "Add Campaign"}
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                <div className="mb-4 flex gap-4 justify-center">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "campaigns" ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("campaigns")}
                    >
                        All Campaigns
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("users")}
                    >
                        User Donations
                    </button>
                </div>

                {/* Campaigns Table */}
                {activeTab === "campaigns" && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">#</th>
                                    <th className="border border-gray-300 px-4 py-2">Title</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    <th className="border border-gray-300 px-4 py-2">status</th>
                                    <th className="border border-gray-300 px-4 py-2">Created At</th>
                                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((don, idx) => (
                                    <tr key={don.id}>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{don.title}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{don.description}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {don.amounts?.join(", ")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold
        ${don.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {don.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {new Date(don.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>

                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="flex gap-2 items-center justify-center">
                                                {/* <button
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                    onClick={() => handleDonate(don.id)}
                                                >
                                                    Donate
                                                </button> */}

                                                <button
                                                    onClick={() => dispatch(toggleCampaignStatus(don.id))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer
    ${don.active ? "bg-green-500" : "bg-gray-400"}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition cursor-pointer
        ${don.active ? "translate-x-6" : "translate-x-1"}`}
                                                    />
                                                </button>



                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => handleEdit(don)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(don.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                                {campaigns.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                            No campaigns yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* User Donations Table */}
                {activeTab === "users" && (
                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">#</th>
                                    <th className="border px-4 py-2">User</th>
                                    <th className="border px-4 py-2">Campaign</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">Donated At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedDonations.map((ud, idx) => (
                                    <tr key={ud.id}>
                                        <td className="border px-4 py-2 text-center">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        </td>
                                        <td className="border px-4 py-2 text-center">{ud.userName}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {ud.donationCampaign?.title}
                                        </td>
                                        <td className="border px-4 py-2 text-center">₹{ud.amount}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {formatDate(ud.donatedAt)}
                                        </td>
                                    </tr>
                                ))}

                                {paginatedDonations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            No donations yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <span className="px-3 py-1">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </DefaultPageAdmin>
    );
};

export default DonationPage;
