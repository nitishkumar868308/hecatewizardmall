"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser, registerUser } from '@/app/redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    // Login validation schema
    const loginValidation = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    // Signup validation schema
    const signupValidation = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });


    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (isLogin) {
                const resultAction = await dispatch(loginUser({ email: values.email, password: values.password }));
                if (loginUser.fulfilled.match(resultAction)) {
                    await dispatch(fetchMe());
                    localStorage.setItem("selectedCountry", "IND");
                    toast.success(resultAction.payload.message || 'Login successful');
                    onClose?.()
                } else {
                    toast.error(resultAction.payload?.message || 'Login failed');
                }
            } else {
                const resultAction = await dispatch(registerUser({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }));
                if (registerUser.fulfilled.match(resultAction)) {

                    toast.success(resultAction.payload.message || 'Registration successful');
                    onClose?.()
                } else {
                    toast.error(resultAction.payload?.message || 'Registration failed');
                }
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong!');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className=" flex items-center justify-center px-4 ">
            <div className="w-full min-w-md rounded-2xl bg-white border border-gray-200 shadow-lg p-6 sm:p-8 relative">

                <h2 className="text-2xl sm:text-3xl font-functionPro text-center mb-2 text-black">
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>


                <div className="mt-4">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const { credential } = credentialResponse;
                                // backend me POST request bhejna
                                const res = await fetch("/api/auth/google", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ token: credential }),
                                });

                                const data = await res.json();
                                if (res.ok) {
                                    toast.success(data.message || "Login successful");
                                    await dispatch(fetchMe()); // user ko redux store me fetch kar do
                                    onClose?.();
                                } else {
                                    toast.error(data.message || "Google login failed");
                                }
                            } catch (error) {
                                console.error(error);
                                toast.error("Something went wrong with Google login");
                            }
                        }}
                        onError={() => {
                            toast.error("Google login failed");
                        }}
                    />
                </div>

                <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full  text-gray-800 hover:bg-red-500 shadow-lg transition-colors duration-200 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>

                        <h1 className='mt-2 text-center'>OR</h1>

                <p className="text-center text-sm text-gray-500 mb-6 mt-3">
                    {isLogin
                        ? 'Sign in to continue'
                        : 'Start your journey with us'}
                </p>

                {error && (
                    <p className="text-center mb-4 text-md text-black bg-gray-100 border border-gray-300 rounded-md py-2 px-3">
                        {error.message || JSON.stringify(error)}
                    </p>
                )}

                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    }}
                    validationSchema={isLogin ? loginValidation : signupValidation}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">

                            {!isLogin && (
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        Full name
                                    </label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-black transition"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                                </div>
                            )}

                            <div>
                                <label className="block mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-black transition"
                                />
                                <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-black transition"
                                />
                                <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        Confirm password
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-black transition"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-xs text-red-500 mt-1"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full mt-4 bg-black text-white py-2.5 text-sm rounded-md font-medium hover:bg-gray-900 transition disabled:opacity-60 cursor-pointer"
                            >
                                {loading
                                    ? isLogin
                                        ? 'Signing in...'
                                        : 'Creating account...'
                                    : isLogin
                                        ? 'Sign in'
                                        : 'Create account'}
                            </button>
                        </Form>
                    )}
                </Formik>



                <p className="text-center mt-6 text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-black font-medium hover:underline cursor-pointer"
                    >
                        {isLogin ? 'Create account' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>


    );
};

export default AuthPage;
