"use client";
import React, { useEffect, useState } from "react";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUser } from "@/app/redux/slices/updateUser/updateUserSlice";
import toast from 'react-hot-toast';

// Validation schema
const ProfileSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
});

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.me);
    const [preview, setPreview] = useState(null);
    console.log("user", user)
    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };


    useEffect(() => {
        if (!user) {
            dispatch(fetchMe());
        }
    }, [dispatch, user]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file); // ✅ change "video" → "image"

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        let data;
        try {
            data = await res.json();
            console.log("data", data);
        } catch (err) {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        // Handle array or string
        const url = Array.isArray(data.urls) ? data.urls[0] : data.urls;
        if (!url) throw new Error("No URL returned from server");

        return url;
    };



    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>

            <Formik
                enableReinitialize
                initialValues={{
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    gender: user?.gender || "",
                    address: user?.address || "",
                    profileImage: null,
                }}
                validationSchema={ProfileSchema}
                onSubmit={async (values) => {
                    console.log("Updated values:", values);
                    try {
                        let uploadedImageUrl = null;
                        if (values.profileImage) {
                            uploadedImageUrl = await handleImageUpload(values.profileImage);
                            console.log("uploadedImageUrl", uploadedImageUrl)
                            values.profileImage = uploadedImageUrl;
                        }
                        const response = await dispatch(updateUser(values)).unwrap();
                        console.log("response", response)
                        toast.success(response.message || "User updated successfully!");
                    } catch {
                        toast.error(error.message || "Failed to update user!")
                    }
                }}
            >
                {({ setFieldValue }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg">
                        {/* Profile Image */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <label className="mb-4 font-medium text-gray-700">Profile Picture</label>

                            {/* Profile Image Container */}
                            <div className="relative">
                                {/* Circle for image / initials */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100 overflow-hidden cursor-pointer group">
                                    {preview ? (
                                        <img
                                            key={preview}
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-600">
                                            {getInitials(user?.name || "User")}
                                        </span>
                                    )}

                                    {/* Hover overlay text */}
                                    <span className="absolute bottom-0 bg-black/60 text-white text-xs px-2 py-1 rounded-b-full opacity-0 group-hover:opacity-100 transition">
                                        Click to upload
                                    </span>

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFieldValue("profileImage", file);
                                                setPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Name (Read-only) */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Name</label>
                            <Field
                                name="name"
                                type="text"
                                readOnly
                                className="w-full border rounded-lg p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Email</label>
                            <Field
                                name="email"
                                type="email"
                                readOnly
                                className="w-full border rounded-lg p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">
                                Phone Number
                            </label>
                            <Field
                                name="phone"
                                type="tel"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="+91 98765 43210"
                            />
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Gender</label>
                            <Field
                                as="select"
                                name="gender"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </Field>
                            <ErrorMessage
                                name="gender"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-2 font-medium text-gray-700">Address</label>
                            <Field
                                name="address"
                                type="text"
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                placeholder="123 Street, City, State, 12345"
                            />
                            <ErrorMessage
                                name="address"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Submit button */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition cursor-pointer"
                            >
                                Update Profile
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
