"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

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

    const handleSubmit = (values, { setSubmitting }) => {
        console.log(isLogin ? 'Login Data:' : 'Signup Data:', values);
        setTimeout(() => setSubmitting(false), 1000);
    };

    return (
        <div className="flex items-center justify-center  bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-4">
            <div className=" p-8 rounded-xl shadow-xl w-full max-w-md">

                <h2 className="text-2xl font-functionPro text-center mb-6 text-gray-800">
                    {isLogin ? 'Login to Your Account' : 'Create an Account'}
                </h2>

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
                        <Form className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            )}

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Email</label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Password</label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Re-enter your password"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-200  cursor-pointer"
                            >
                                {isSubmitting ? (isLogin ? 'Logging in...' : 'Signing up...') : isLogin ? 'Login' : 'Sign Up'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-center mt-4 text-gray-500">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-500 hover:underline font-medium  cursor-pointer"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
