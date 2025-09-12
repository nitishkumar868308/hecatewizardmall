"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "@/app/redux/slices/address/addressSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";

const AddressSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required("Mobile number is required"),
    pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Enter valid 6-digit pincode")
        .required("Pincode is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    landmark: Yup.string(),
    type: Yup.string().required("Address type is required"),
});

const Address = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loadingPin, setLoadingPin] = useState(false);

    const { user } = useSelector((state) => state.me);
    const { addresses, loading } = useSelector((state) => state.address);

    useEffect(() => {
        if (!user) {
            dispatch(fetchMe());
        }
        dispatch(fetchAddresses());
    }, [dispatch, user]);

    // Fetch city & state from pincode
    const fetchPincodeData = async (pincode, setFieldValue) => {
        if (pincode.length === 6) {
            setLoadingPin(true);
            try {
                const res = await fetch(
                    `https://api.postalpincode.in/pincode/${pincode}`
                );
                const data = await res.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setFieldValue("city", postOffice.District);
                    setFieldValue("state", postOffice.State);
                } else {
                    setFieldValue("city", "");
                    setFieldValue("state", "");
                    toast.error("Invalid pincode");
                }
            } catch (error) {
                toast.error("Error fetching pincode");
            } finally {
                setLoadingPin(false);
            }
        }
    };

    const openModal = (type, address = null) => {
        setModalType(type);
        setSelectedAddress(address);
        setShowModal(true);
    };

    // handle delete
    const handleDelete = async (id) => {
        console.log("id" , id)
        try {
            const res = await dispatch(deleteAddress(id)).unwrap();
            toast.success(res.message || "Address deleted successfully");
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || "Failed to delete address");
        }
    };

    return (
        <>
            <div className="space-y-6 max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black">Your Addresses</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer shadow"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </button>
                </div>

                {/* Address List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : addresses.length === 0 ? (
                        <p className="text-gray-500">No addresses found.</p>
                    ) : (
                        addresses.map((item) => (
                            <div
                                key={item.id}
                                className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white flex justify-between items-start"
                            >
                                <div>
                                    <p className="font-semibold text-black text-lg">{item.type}</p>
                                    <p className="text-gray-500 text-sm mt-1">{item.address}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {item.city}, {item.state} - {item.pincode}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => openModal("edit", item)}
                                        className="text-gray-700 hover:text-black transition cursor-pointer"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => openModal("delete", item)}
                                        className="text-gray-700 hover:text-black transition cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                        {/* Close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Heading */}
                        {modalType === "add" && (
                            <h3 className="text-xl font-bold text-black mb-4">
                                Add New Address
                            </h3>
                        )}
                        {modalType === "edit" && (
                            <h3 className="text-xl font-bold text-black mb-4">
                                Edit Address
                            </h3>
                        )}
                        {modalType === "delete" && (
                            <h3 className="text-xl font-bold text-black mb-4">
                                Delete Address
                            </h3>
                        )}

                        {/* Add / Edit Form */}
                        {(modalType === "add" || modalType === "edit") && (
                            <Formik
                                initialValues={{
                                    userId: user?.id || "",
                                    name: selectedAddress?.name || "",
                                    mobile: selectedAddress?.mobile || "",
                                    pincode: selectedAddress?.pincode || "",
                                    address: selectedAddress?.address || "",
                                    city: selectedAddress?.city || "",
                                    state: selectedAddress?.state || "",
                                    landmark: selectedAddress?.landmark || "",
                                    type: selectedAddress?.type || "Home",
                                }}
                                validationSchema={AddressSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        let res;
                                        if (modalType === "add") {
                                            res = await dispatch(createAddress(values)).unwrap();
                                            toast.success(res.message || "Address added successfully");
                                        } else {
                                            res = await dispatch(
                                                updateAddress({ ...values, id: selectedAddress.id })
                                            ).unwrap();
                                            toast.success(res.message || "Address updated successfully");
                                        }
                                        setShowModal(false);
                                    } catch (error) {
                                        toast.error(error.message || "Something went wrong");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting, values, setFieldValue }) => (
                                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <Field
                                                name="name"
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* Mobile */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number
                                            </label>
                                            <Field
                                                name="mobile"
                                                placeholder="Enter mobile number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            />
                                            <ErrorMessage
                                                name="mobile"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Pincode
                                            </label>
                                            <Field
                                                name="pincode"
                                                placeholder="Enter pincode"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                                onBlur={(e) =>
                                                    fetchPincodeData(e.target.value, setFieldValue)
                                                }
                                            />
                                            <ErrorMessage
                                                name="pincode"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <Field
                                                as="textarea"
                                                rows="3"
                                                name="address"
                                                placeholder="Flat, House no., Street"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none resize-none"
                                            />
                                            <ErrorMessage
                                                name="address"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <Field
                                                name="city"
                                                placeholder="Enter city"
                                                value={values.city}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            />
                                            <ErrorMessage
                                                name="city"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State
                                            </label>
                                            <Field
                                                name="state"
                                                value={values.state}
                                                placeholder="Enter state"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            />
                                            <ErrorMessage
                                                name="state"
                                                component="p"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>

                                        {/* Landmark */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Landmark (Optional)
                                            </label>
                                            <Field
                                                name="landmark"
                                                placeholder="Nearby landmark"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            />
                                        </div>

                                        {/* Type */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Type
                                            </label>
                                            <Field
                                                as="select"
                                                name="type"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Office">Office</option>
                                                <option value="Other">Other</option>
                                            </Field>
                                        </div>

                                        {/* Buttons */}
                                        <div className="col-span-2 flex justify-end gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-5 py-2 rounded-lg border border-gray-400 font-medium text-gray-700 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                                            >
                                                {isSubmitting ? "Saving..." : "Save Address"}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}

                        {/* Delete */}
                        {modalType === "delete" && selectedAddress && (
                            <div className="space-y-6">
                                <p className="text-gray-700">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">
                                        {selectedAddress?.type}
                                    </span>{" "}
                                    address?
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-400 font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedAddress?.id) {
                                                handleDelete(selectedAddress.id);
                                            } else {
                                                toast.error("No address selected to delete");
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Animation */}
            <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </>
    );
};

export default Address;
