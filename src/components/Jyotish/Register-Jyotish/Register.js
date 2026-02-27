"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAstrologer } from "@/app/redux/slices/jyotish/Register/RegisterSlice";
import { toast } from "react-hot-toast";
import Loader from "@/components/Include/Loader";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Globe,
    IndianRupee,
    Upload,
    Award,
    CheckCircle2,
} from "lucide-react";

const Register = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.jyotishRegister);

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const initialFormState = {
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        experience: "",
        bio: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        languages: [],
        services: [],
        documents: [],
    };

    const [formData, setFormData] = useState(initialFormState);

    const [languageInput, setLanguageInput] = useState("");
    const [newService, setNewService] = useState({ serviceName: "", price: "" });

    const serviceOptions = [
        "Vedic Astrology",
        "Numerology",
        "Tarot Reading",
        "Palmistry",
        "Vastu",
    ];

    const statesOfIndia = [
        "Delhi",
        "Maharashtra",
        "Karnataka",
        "Uttar Pradesh",
        "Gujarat",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)) {
            return toast.error("Please fill required fields");
        }
        setStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const addLanguage = () => {
        if (languageInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, languageInput.trim()],
            }));
            setLanguageInput("");
        }
    };

    const addService = () => {
        if (!newService.serviceName || !newService.price)
            return toast.error("Select service and price");

        setFormData((prev) => ({
            ...prev,
            services: [...prev.services, newService],
        }));
        setNewService({ serviceName: "", price: "" });
    };

    const handleFileUpload = (type, file) => {
        if (!file) return;
        setFormData((prev) => ({
            ...prev,
            documents: [
                ...prev.documents.filter((d) => d.type !== type),
                { type, fileUrl: file.name },
            ],
        }));
    };

    const handleSubmit = async () => {
        try {

            const payload = {
                ...formData,
                experience: formData.experience
                    ? parseInt(formData.experience)
                    : null,

                services: formData.services.map((s) => ({
                    serviceName: s.serviceName,
                    price: parseInt(s.price),
                })),
            };

            console.log("FINAL PAYLOAD", payload);

            const result = await dispatch(registerAstrologer(payload)).unwrap();

            toast.success(result.message || "Registration successful");

            // ✅ RESET EVERYTHING ONLY ON SUCCESS
            setFormData(initialFormState);
            setLanguageInput("");
            setNewService({ serviceName: "", price: "" });
            setStep(1);

        } catch (err) {
            // ❌ DO NOTHING (no reset)
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#061c2f] via-[#082D3F] to-[#0e4b63] flex items-center justify-center p-4">
            {loading && <Loader />}

            <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col md:flex-row">

                {/* LEFT PANEL */}
                <div className="md:w-1/3 bg-gradient-to-b from-[#0e4b63] to-[#061c2f] p-10 text-white hidden md:flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold leading-snug">
                            Join The Divine Network
                        </h2>
                        <p className="mt-4 text-sm text-white/70">
                            Start your journey as a verified spiritual consultant.
                        </p>
                    </div>

                    <div className="space-y-3 text-sm text-white/70">
                        <div>✔ Secure Verification</div>
                        <div>✔ Set Your Own Pricing</div>
                        <div>✔ Earn With Trust</div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 bg-white p-6 md:p-12 rounded-t-3xl md:rounded-none">

                    {/* STEP INDICATOR */}
                    <div className="flex justify-between mb-10">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${step >= i
                                    ? "bg-gradient-to-r from-[#0e4b63] to-[#082D3F] text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {step > i ? <CheckCircle2 size={18} /> : i}
                            </div>
                        ))}
                    </div>

                    {/* STEP CONTENT */}
                    {step === 1 && (
                        <div className="space-y-5 animate-fade">
                            <h3 className="text-2xl font-bold text-[#082D3F]">Basic Info</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input icon={<User size={16} />} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                                <Input icon={<Mail size={16} />} name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                                <Input icon={<Phone size={16} />} name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                                <select name="gender" className="input" onChange={handleChange}>
                                    <option value="">Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>

                            {/* Languages */}
                            <div>
                                <div className="flex gap-3">
                                    <Input icon={<Globe size={16} />} value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} placeholder="Add Language" />
                                    <button onClick={addLanguage} className="primary-btn">Add</button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.languages.map((l, i) => (
                                        <span key={i} className="tag">
                                            {l}
                                            <Trash2 size={14} onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_, idx) => idx !== i) })} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-fade">
                            <h3 className="text-2xl font-bold text-[#082D3F]">Expertise</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input icon={<Briefcase size={16} />} value={formData.experience} name="experience" placeholder="Experience (Years)" onChange={handleChange} />
                                <Input icon={<MapPin size={16} />} name="city" value={formData.city} placeholder="City" onChange={handleChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input name="address" value={formData.address} placeholder="Address" onChange={handleChange} />
                                <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} />
                            </div>
                            <textarea
                                name="bio"
                                placeholder="Short Bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl border bg-gray-50"
                            />

                            <div className="bg-gray-50 p-5 rounded-2xl border">
                                <div className="grid md:grid-cols-2 gap-3 mb-3">
                                    <select className="input" onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}>
                                        <option value="">Select Service</option>
                                        {serviceOptions.map(s => <option key={s}>{s}</option>)}
                                    </select>

                                    <Input icon={<IndianRupee size={14} />} placeholder="Price" type="number"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    />
                                </div>
                                <button onClick={addService} className="primary-btn w-full">Add Service</button>

                                <div className="mt-4 space-y-2">
                                    {formData.services.map((s, i) => (
                                        <div key={i} className="flex justify-between bg-white p-3 rounded-xl shadow-sm">
                                            <span>{s.serviceName}</span>
                                            <span className="font-bold text-[#0e4b63]">₹{s.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center animate-fade">
                            <h3 className="text-2xl font-bold text-[#082D3F]">Verification</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <DocCard
                                    title="ID Proof"
                                    icon={<Upload size={22} />}
                                    type="ID_PROOF"
                                    setFormData={setFormData}
                                    formData={formData}
                                />

                                <DocCard
                                    title="Certificate"
                                    icon={<Award size={22} />}
                                    type="CERTIFICATE"
                                    setFormData={setFormData}
                                    formData={formData}
                                />
                            </div>
                        </div>
                    )}

                    {/* NAV BUTTONS */}
                    <div className="mt-10 flex justify-between">
                        {step > 1 && (
                            <button onClick={prevStep} className="secondary-btn">
                                <ChevronLeft size={16} /> Back
                            </button>
                        )}
                        <button onClick={step < totalSteps ? nextStep : handleSubmit}
                            className="primary-btn ml-auto">
                            {step < totalSteps ? <>Continue <ChevronRight size={16} /></> : "Complete"}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: white;
        }
        .primary-btn {
          background: linear-gradient(135deg,#0e4b63,#082D3F);
          color: white;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          transition: .3s;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .secondary-btn {
          background: #f1f5f9;
          padding: 10px 20px;
          border-radius: 12px;
        }
        .tag {
          background:#0e4b63;
          color:white;
          padding:4px 10px;
          border-radius:20px;
          display:flex;
          align-items:center;
          gap:6px;
        }
        .animate-fade {
          animation: fade .4s ease-in-out;
        }
        @keyframes fade {
          from {opacity:0; transform: translateY(10px);}
          to {opacity:1; transform: translateY(0);}
        }
      `}</style>
        </div>
    );
};

const Input = ({ icon, ...props }) => (
    <div className="relative w-full">
        {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                {icon}
            </div>
        )}
        <input
            {...props}
            className="w-full h-12 pl-11 pr-4 rounded-xl 
      bg-gray-50 border border-gray-300 
      focus:border-[#0e4b63] focus:ring-2 focus:ring-[#0e4b63]/20 
      outline-none transition-all duration-200
      text-gray-800 placeholder-gray-400"
        />
    </div>
);

const DocCard = ({ title, icon, type, setFormData, formData }) => {

    const uploadedDoc = formData.documents.find(doc => doc.type === type);

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const url = await handleImageUpload(file);

            setFormData(prev => ({
                ...prev,
                documents: [
                    ...prev.documents.filter(doc => doc.type !== type),
                    { type, fileUrl: url, fileName: file.name }
                ]
            }));

            toast.success(`${title} uploaded`);

        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-dashed text-center">
            <div className="w-12 h-12 mx-auto bg-[#0e4b63]/10 text-[#0e4b63] rounded-full flex items-center justify-center mb-3">
                {icon}
            </div>

            <h4 className="font-bold">{title}</h4>

            <input
                type="file"
                onChange={handleChange}
                className="mt-3 text-xs w-full"
            />

            {uploadedDoc && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
                    <div className="flex items-center justify-between gap-2">

                        <span className="text-green-700 font-medium truncate max-w-[200px]">
                            ✅ {uploadedDoc.fileName}
                        </span>

                        <button
                            onClick={() =>
                                setFormData(prev => ({
                                    ...prev,
                                    documents: prev.documents.filter(doc => doc.type !== type)
                                }))
                            }
                            className="text-red-500 text-xs hover:underline"
                        >
                            Remove
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    let data;
    try {
        data = await res.json();
    } catch (err) {
        throw new Error("Server did not return valid JSON");
    }

    if (!res.ok) throw new Error(data.message || "Upload failed");

    return data.urls;
};

export default Register;