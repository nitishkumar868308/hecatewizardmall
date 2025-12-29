import React, { useState, useEffect } from 'react'
import { updateUser } from "@/app/redux/slices/updateUser/updateUserSlice";
import ReactSelect from "react-select";
import { useCountries, getStates, getCities, fetchPincodeData } from "@/lib/CustomHook/useCountries";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';

const getPhoneYup = (countryCode) =>
    Yup.string()
        .required("Phone is required")
        .test("is-valid-phone", "Enter a valid phone number", (value) => {
            if (!value) return false;
            try {
                const phoneNumber = parsePhoneNumberFromString(value, countryCode);
                return phoneNumber ? phoneNumber.isValid() : false;
            } catch {
                return false;
            }
        });

const BillingAddress = ({ userId, open, setOpen, user }) => {
      const dispatch = useDispatch();
    const initialValues = {
        id: userId || "",
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        address: user?.address || "",
        country: user?.country || "",
        state: user?.state || "",
        city: user?.city || "",
        pincode: user?.pincode || "",
        profileImage: null,
    };
    const { countries } = useCountries();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const validationSchema = Yup.object().shape({
        gender: Yup.string().required("Gender is required"),
        country: Yup.string().required("Country is required"),
        state: Yup.string().required("State is required"),
        city: Yup.string().required("City is required"),
        address: Yup.string().required("Address is required"),
        phone: getPhoneYup(
            countries.find((c) => c.name === selectedCountry)?.code
        ),
    });

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    useEffect(() => {
        if (selectedCountry) {
            setLoadingStates(true);
            getStates(selectedCountry)
                .then((res) => setStates(res))
                .finally(() => setLoadingStates(false));
            setCities([]);
            setSelectedState("");
        }
    }, [selectedCountry]);
    const countryCode = selectedCountry || "IND";
    console.log("countryCode", countryCode)
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // include all fields and defaults
            let payload = {
                id: userId,
                name: values.name || "",
                email: values.email || "",
                phone: values.phone || "",
                gender: values.gender || "",
                address: values.address || "",
                country: values.country || "",
                state: values.state || "",
                city: values.city || "",
                pincode: values.pincode || "",
                profileImage: values.profileImage || null,
            };

            // upload image if new file is selected
            if (values.profileImage instanceof File) {
                const uploadedUrl = await handleImageUpload(values.profileImage);
                payload.profileImage = uploadedUrl;
            }

            // dispatch update
            const response = await dispatch(updateUser(payload)).unwrap();
            console.log("response", response);
            toast.success(response.message || "Profile updated!");
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to update");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 animate-fadeIn relative 
                       max-h-[90vh] flex flex-col">


                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>


                        <div className="overflow-y-auto pr-2">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, setFieldValue, isSubmitting }) => (
                                    <Form className="w-full">


                                        <h2 className="text-2xl font-bold mb-6 text-center">Billing Address</h2>


                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pr-1">

                                            <div className="col-span-1">
                                                <label className="text-sm font-medium">Gender</label>
                                                <Field
                                                    as="select"
                                                    name="gender"
                                                    className="w-full border rounded-lg p-3 mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
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


                                            <div className="col-span-1">
                                                <label className="mb-2 font-medium text-gray-700">Country</label>
                                                <ReactSelect
                                                    options={countries.map((c) => ({
                                                        value: c.name,
                                                        label: `${c.name} (${c.phoneCode})`,
                                                    }))}
                                                    value={
                                                        selectedCountry
                                                            ? { value: selectedCountry, label: selectedCountry }
                                                            : null
                                                    }
                                                    onChange={(option) => {
                                                        const countryName = option?.value || "";
                                                        setSelectedCountry(countryName);
                                                        setFieldValue("country", countryName);
                                                        setFieldValue("state", "");
                                                        setFieldValue("city", "");
                                                        setFieldValue("pincode", "");
                                                        setCities([]);

                                                        const phoneCode = countries.find(c => c.name === countryName)?.phoneCode;
                                                        if (phoneCode && !values.phone.startsWith(phoneCode)) {
                                                            setFieldValue("phone", phoneCode + " ");
                                                        }
                                                    }}
                                                    isClearable
                                                    placeholder="Select Country..."
                                                />
                                                <ErrorMessage
                                                    name="country"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>


                                            <div className="col-span-1">
                                                <label className="mb-2 font-medium text-gray-700">Pincode</label>
                                                <Field name="pincode">
                                                    {({ field }) => (
                                                        <input
                                                            type="text"
                                                            {...field}
                                                            placeholder="Enter Pincode"
                                                            className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                                            onChange={async (e) => {
                                                                const value = e.target.value;
                                                                setFieldValue("pincode", value);

                                                                if (selectedCountry === "India" && value.length === 6) {
                                                                    await fetchPincodeData(value, (fieldName, val) =>
                                                                        setFieldValue(fieldName, val)
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </div>


                                            <div className="col-span-1">
                                                <label className="mb-2 font-medium text-gray-700">State</label>
                                                <ReactSelect
                                                    options={states.map(s => ({ value: s, label: s }))}
                                                    value={values.state ? { value: values.state, label: values.state } : null}
                                                    onChange={(option) => {
                                                        const stateVal = option?.value || "";
                                                        setSelectedState(stateVal);
                                                        setFieldValue("state", stateVal);
                                                        setFieldValue("city", "");

                                                        if (option?.value && selectedCountry) {
                                                            setLoadingCities(true);
                                                            getCities(selectedCountry, option.value).then(res => {
                                                                setCities(res);
                                                                setLoadingCities(false);
                                                            });
                                                        }
                                                    }}
                                                    isClearable
                                                    isLoading={loadingStates}
                                                    placeholder="Select State..."
                                                />
                                                <ErrorMessage
                                                    name="state"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>


                                            <div className="col-span-1">
                                                <label className="mb-2 font-medium text-gray-700">City</label>
                                                <ReactSelect
                                                    options={cities.map(c => ({ value: c, label: c }))}
                                                    value={values.city ? { value: values.city, label: values.city } : null}
                                                    onChange={(option) => setFieldValue("city", option?.value || "")}
                                                    isClearable
                                                    isLoading={loadingCities}
                                                    placeholder="Select City..."
                                                />
                                                <ErrorMessage
                                                    name="city"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>


                                            <div className="col-span-1">
                                                <label className="mb-2 font-medium text-gray-700">Phone Number</label>
                                                <Field name="phone">
                                                    {({ field, form }) => {
                                                        const phoneCode = countries.find(c => c.name === values.country)?.phoneCode || "+";
                                                        const numberPart = field.value?.replace(/^\+\d+\s*/, "") || "";
                                                        return (
                                                            <input
                                                                type="tel"
                                                                value={`${phoneCode} ${numberPart}`}
                                                                placeholder={`${phoneCode} 98765 43210`}
                                                                className="w-full border rounded-lg h-10 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                                                                onChange={e => {
                                                                    const newNumber = e.target.value.replace(/^\+\d+\s*/, "");
                                                                    form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                                                }}
                                                                onPaste={e => {
                                                                    const pasteData = e.clipboardData.getData("text");
                                                                    const newNumber = pasteData.replace(/^\+\d+\s*/, "");
                                                                    form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                                                    e.preventDefault();
                                                                }}
                                                                onKeyDown={e => {
                                                                    if (
                                                                        e.target.selectionStart <= phoneCode.length &&
                                                                        ["Backspace", "Delete"].includes(e.key)
                                                                    ) e.preventDefault();
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                                <ErrorMessage
                                                    name="phone"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <div className="col-span-1 sm:col-span-2">
                                                <label className="text-sm font-medium">Address</label>
                                                <Field
                                                    name="address"
                                                    placeholder="Enter Address"
                                                    className="w-full border rounded-lg p-3 mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="address"
                                                    component="p"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4 mt-8">
                                            <button
                                                type="button"
                                                onClick={() => setOpen(false)}
                                                className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer font-medium"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-black cursor-pointer font-medium"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default BillingAddress