"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Loader from "@/components/Include/Loader";
import { AlertCircle, ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        {
            label: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            label: "1 uppercase letter",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "1 lowercase letter",
            valid: /[a-z]/.test(password),
        },
        {
            label: "1 number",
            valid: /\d/.test(password),
        },
        {
            label: "1 special character (@$!%*?&)",
            valid: /[@$!%*?&]/.test(password),
        },
    ];

    return (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {criteria.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                >
                    {item.valid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                        className={item.valid ? "text-green-600" : "text-red-500"}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};




const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    useEffect(() => {
        if (!email || !token) {
            setLoading(false);
            setValid(false);
            return;
        }

        fetch(`/api/auth/validate-token?email=${email}&token=${token}`)
            .then(res => res.json())
            .then(data => {
                setValid(data.valid);
                setLoading(false);
            })
            .catch(() => {
                setValid(false);
                setLoading(false);
            });
    }, [email, token]);

    if (loading)
        return (
            <div className="text-center mt-10">
                <Loader />
            </div>
        );

    if (!valid) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center transition-all animate-in fade-in zoom-in duration-300">

                    {/* Icon Container */}
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Invalid or expired link
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Oops! It looks like this password reset link is no longer valid or has already been used.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-md outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Request New Link
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
            .matches(/[a-z]/, "Must contain at least 1 lowercase letter")
            .matches(/\d/, "Must contain at least 1 number")
            .matches(/[@$!%*?&]/, "Must contain at least 1 special character"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, password: values.password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Password updated successfully");
                router.push("/");
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 bg-gray-50/50">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Please enter your new password below to secure your account.
                    </p>
                </div>

                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched, values }) => (
                        <Form className="space-y-6">
                            {/* New Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">
                                    New Password
                                </label>

                                <div className="relative group">
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className={`w-full pl-4 pr-4 py-3 bg-gray-50 border ${errors.password && touched.password
                                            ? "border-red-400"
                                            : "border-gray-200"
                                            } rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200`}
                                    />
                                </div>

                                <PasswordCriteria password={values.password} />

                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-xs font-medium text-red-500 ml-1 mt-1"
                                />
                            </div>


                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className={`w-full pl-4 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : 'border-gray-200'
                                            } rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 placeholder:text-gray-300`}
                                    />
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="text-xs font-medium text-red-500 ml-1 mt-1" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
