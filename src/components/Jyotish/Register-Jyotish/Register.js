"use client";

import React, { useState, useEffect, useRef } from "react";
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
    Users,
    ChevronDown,
    Hash,
    Home,
    Languages,
    Navigation,
    X,
    Fingerprint,
    CreditCard,
    TextQuote
} from "lucide-react";
import { fetchCountries } from "@/app/redux/slices/country/countrySlice";
import { fetchStates } from "@/app/redux/slices/countryState/countryStateSlice";
import { fetchCities } from "@/app/redux/slices/countryCity/countryCitySlice";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { fetchServices } from "@/app/redux/slices/book_consultant/services/serviceSlice";

const Register = () => {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [stateSearch, setStateSearch] = useState("");
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState("");
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.jyotishRegister);
    const countries = useSelector((state) => state.countries.countries);
    const states = useSelector((state) => state.countriesStates.states);
    const cities = useSelector((state) => state.countriesCities.cities);
    const { services } = useSelector((state) => state.services);
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    console.log("states", states)
    console.log("countries", countries)
    console.log("cities", cities)
    console.log("services", services)
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
        country: "",
        postalCode: "",
        phoneCode: "",
        languages: [],
        services: [],
        documents: [],
        selectedIdProof: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    const [languageInput, setLanguageInput] = useState("");
    const [newService, setNewService] = useState({ serviceNames: [], price: "" });

    useEffect(() => {
        if (countries.length === 0) {
            dispatch(fetchCountries());
        }
        dispatch(fetchStates());
        dispatch(fetchCities());
        dispatch(fetchServices());
    }, [countries.length, dispatch]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            // ✅ Only digits allow
            const cleanedValue = value.replace(/\D/g, "");

            setFormData((prev) => ({
                ...prev,
                [name]: cleanedValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)) {
            return toast.error("Please fill required fields");
        }
        if (!validatePhone()) return;
        if (!validatePostalCode()) return;
        if (!validateLocation()) return;

        if (step === 2) {
            if (!formData.services.length) {
                return toast.error("Please add at least one service");
            }

            if (!formData.bio || formData.bio.trim().length < 20) {
                return toast.error("Bio should be at least 20 characters");
            }

            if (!formData.experience || isNaN(formData.experience) || Number(formData.experience) <= 0) {
                return toast.error("Please enter valid experience (in years)");
            }
        }
        setStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const addLanguage = () => {
        if (!languageInput.trim()) return;

        if (formData.languages.includes(languageInput.trim())) {
            return toast.error("Language already added");
        }

        setFormData(prev => ({
            ...prev,
            languages: [...prev.languages, languageInput.trim()],
        }));

        setLanguageInput("");
    };

    const addService = () => {
        if (!newService.serviceNames.length || !newService.price) {
            return toast.error("Select services and price");
        }

        setFormData((prev) => ({
            ...prev,
            services: [...prev.services, newService],
        }));

        setNewService({
            serviceNames: [],
            price: ""
        });
    };

    const selectedCountry = countries.find(c => c.name === formData.country);

    const currencySymbol = selectedCountry?.currency_symbol || "₹";

    const handleSubmit = async () => {
        try {

            if (!validatePhone()) return;
            if (!validatePostalCode()) return;

            if (!formData.languages.length) {
                return toast.error("Please add at least one language");
            }

            // ❗ Service validation
            if (!formData.services.length) {
                return toast.error("Please add at least one service");
            }

            const hasIdProof = formData.documents.some(doc => doc.type === "ID_PROOF");
            const hasCertificate = formData.documents.some(doc => doc.type === "CERTIFICATE");

            if (!hasIdProof || !hasCertificate) {
                return toast.error("Please upload both ID Proof and Certificate");
            }

            const payload = {
                ...formData,
                phone: `+${formData.phoneCode}${formData.phoneNumber}`,
                countryCode: `+${formData.phoneCode}`,
                phoneLocal: formData.phoneNumber,
                idProofType: formData.selectedIdProof,
                idProofValue: formData[formData.selectedIdProof],
                experience: formData.experience
                    ? parseInt(formData.experience)
                    : null,

                services: formData.services.flatMap((s) =>
                    s.serviceNames.map((name) => ({
                        serviceName: name,
                        price: parseInt(s.price),

                        // ✅ ADD THESE
                        currency: selectedCountry?.currency || "INR",
                        currencySymbol: selectedCountry?.currency_symbol || "₹",
                    }))
                ),
            };

            console.log("FINAL PAYLOAD", payload);

            const result = await dispatch(registerAstrologer(payload)).unwrap();

            toast.success(result.message || "Registration successful");

            // ✅ RESET EVERYTHING ONLY ON SUCCESS
            setFormData(initialFormState);
            setLanguageInput("");
            setNewService({ serviceNames: [], price: "" });
            setStep(1);

        } catch (err) {
            // ❌ DO NOTHING (no reset)
            toast.error(err.message || "Something went wrong");
        }
    };

    const validatePhone = () => {
        const phone = formData.phoneNumber;

        if (!phone) return true;

        if (!formData.phoneCode) {
            toast.error("Please select country first");
            return false;
        }

        try {
            const fullPhone = `+${formData.phoneCode}${phone}`;

            const phoneNumber = parsePhoneNumberFromString(fullPhone);

            if (!phoneNumber || !phoneNumber.isValid()) {
                toast.error("Invalid phone number for selected country");
                return false;
            }

            return true;

        } catch (err) {
            toast.error("Invalid phone number");
            return false;
        }
    };

    const validatePostalCode = () => {
        const value = formData.postalCode;

        // Agar country postal code require karti hai
        if (formData.postalRegex) {
            if (!value) {
                toast.error("Postal code is required for selected country");
                return false;
            }

            const regex = new RegExp(formData.postalRegex);

            if (!regex.test(value)) {
                toast.error("Invalid postal code format");
                return false;
            }
        }

        // Agar country postal code not required, allow empty
        return true;
    };

    const validateLocation = () => {
        if (!formData.state) {
            toast.error("Please select a state");
            return false;
        }
        if (!formData.city) {
            toast.error("Please select a city");
            return false;
        }
        return true;
    };

    const isPackageAdded = formData.services.length > 0;

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
                        <div className="max-w-4xl mx-auto space-y-5 animate-fade p-2">
                            <h3 className="text-xl font-bold text-[#082D3F] border-b pb-2">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Full Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                                    <Input icon={<User size={16} className="text-gray-400" />} name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                                    <Input icon={<Mail size={16} className="text-gray-400" />} name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                                </div>

                                {/* Gender */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 z-10 text-gray-400"><Users size={16} /></span>
                                        <select name="gender" className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm" onChange={handleChange} value={formData.gender}>
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        <div className="absolute right-3 pointer-events-none text-gray-400"><ChevronDown size={14} /></div>
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="flex flex-col gap-1 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                        Country
                                    </label>

                                    <div className="relative">
                                        <div
                                            className="w-full h-11 pl-10 pr-10 flex items-center rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                                            onClick={() => setShowCountryDropdown(prev => !prev)}
                                        >
                                            <span className="absolute left-3 text-gray-400">
                                                <Globe size={16} />
                                            </span>

                                            <span className="text-sm text-gray-800">
                                                {formData.country || "Select Country"}
                                            </span>

                                            <ChevronDown className="absolute right-3 text-gray-400" size={14} />
                                        </div>

                                        {/* DROPDOWN */}
                                        {showCountryDropdown && (
                                            <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">

                                                {/* SEARCH */}
                                                <input
                                                    type="text"
                                                    placeholder="Search country..."
                                                    className="w-full p-2 border-b outline-none"
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                />

                                                {/* LIST */}
                                                {countries
                                                    .filter(c =>
                                                        c.name.toLowerCase().includes(countrySearch.toLowerCase())
                                                    )
                                                    .map(c => (
                                                        <div
                                                            key={c.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    country: c.name,
                                                                    phoneCode: c.phonecode || "",
                                                                    postalRegex: c.postal_code_regex || "",
                                                                    postalFormat: c.postal_code_format || "",
                                                                    state: "",
                                                                    city: ""
                                                                }));
                                                                setShowCountryDropdown(false);
                                                            }}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                        >
                                                            <span>{c.emoji}</span>
                                                            <span>{c.name}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* State */}
                                {/* State */}
                                <div className="flex flex-col gap-1 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                        State
                                    </label>

                                    <div className="relative">
                                        <div
                                            className="w-full h-11 pl-10 pr-10 flex items-center rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                                            onClick={() => setShowStateDropdown(prev => !prev)}
                                        >
                                            <span className="absolute left-3 text-gray-400">
                                                <MapPin size={16} />
                                            </span>

                                            <span className="text-sm text-gray-800">
                                                {formData.state || "Select State"}
                                            </span>

                                            <ChevronDown className="absolute right-3 text-gray-400" size={14} />
                                        </div>

                                        {/* DROPDOWN */}
                                        {showStateDropdown && (
                                            <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">

                                                {/* SEARCH */}
                                                <input
                                                    type="text"
                                                    placeholder="Search state..."
                                                    className="w-full p-2 border-b outline-none"
                                                    onChange={(e) => setStateSearch(e.target.value)}
                                                />

                                                {/* LIST */}
                                                {states
                                                    .filter(s =>
                                                        s.country_name === formData.country &&
                                                        s.name.toLowerCase().includes(stateSearch.toLowerCase())
                                                    )
                                                    .map(s => (
                                                        <div
                                                            key={s.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    state: s.name,
                                                                    state_id: s.id,
                                                                    city: ""
                                                                }));
                                                                setShowStateDropdown(false);
                                                            }}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            {s.name}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* City */}
                                {/* City */}
                                <div className="flex flex-col gap-1 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                        City
                                    </label>

                                    <div className="relative">
                                        <div
                                            className="w-full h-11 pl-10 pr-10 flex items-center rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                                            onClick={() => setShowCityDropdown(prev => !prev)}
                                        >
                                            <span className="absolute left-3 text-gray-400">
                                                <Navigation size={16} />
                                            </span>

                                            <span className="text-sm text-gray-800">
                                                {formData.city || "Select City"}
                                            </span>

                                            <ChevronDown className="absolute right-3 text-gray-400" size={14} />
                                        </div>

                                        {/* DROPDOWN */}
                                        {showCityDropdown && (
                                            <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">

                                                {/* SEARCH */}
                                                <input
                                                    type="text"
                                                    placeholder="Search city..."
                                                    className="w-full p-2 border-b outline-none"
                                                    onChange={(e) => setCitySearch(e.target.value)}
                                                />

                                                {/* LIST */}
                                                {cities
                                                    .filter(c =>
                                                        c.state_name === formData.state &&
                                                        c.name.toLowerCase().includes(citySearch.toLowerCase())
                                                    )
                                                    .map(c => (
                                                        <div
                                                            key={c.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    city: c.name
                                                                }));
                                                                setShowCityDropdown(false);
                                                            }}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            {c.name}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Postal Code */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Postal Code</label>
                                    <Input icon={<Hash size={16} className="text-gray-400" />} name="postalCode" placeholder="110001" value={formData.postalCode} onChange={(e) => setFormData(p => ({ ...p, postalCode: e.target.value }))} onBlur={(e) => {
                                        const value = e.target.value;

                                        if (!formData.postalRegex) {
                                            // toast.error("This country does not support postal codes");
                                            return;
                                        }

                                        if (formData.postalRegex && value) {
                                            const regex = new RegExp(formData.postalRegex);
                                            if (!regex.test(value)) {
                                                toast.error("Invalid postal code format");
                                            }
                                        }
                                    }} />
                                </div>

                                {/* Address */}
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Street Address</label>
                                    <Input icon={<Home size={16} className="text-gray-400" />} name="address" value={formData.address} placeholder="Flat, Street, Landmark" onChange={handleChange} />
                                </div>

                                {/* Phone Number */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all h-11">
                                        <div className="flex items-center gap-1.5 px-3 border-r bg-gray-100 h-full">
                                            <span className="text-base">{countries.find(c => c.name === formData.country)?.emoji || "🏳️"}</span>
                                            <span className="text-xs font-bold text-gray-600">+{formData.phoneCode || "0"}</span>
                                        </div>
                                        <input type="tel" onBlur={validatePhone} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Mobile number" className="flex-1 px-3 bg-transparent outline-none text-sm text-gray-800" />
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Languages</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input icon={<Languages size={16} className="text-gray-400" />} value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} placeholder="Add e.g. English" />
                                        </div>
                                        <button onClick={addLanguage} className="bg-[#082D3F] text-white px-6 rounded-xl text-sm font-medium hover:scale-[1.02] active:scale-95 transition-all">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {formData.languages.map((l, i) => (
                                            <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-[#082D3F] px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                                                {l}
                                                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_, idx) => idx !== i) })} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-4xl mx-auto space-y-6 animate-fade p-2">
                            <h3 className="text-xl font-bold text-[#082D3F] border-b pb-2">Professional Expertise</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Experience */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Experience (Years)</label>
                                    <Input icon={<Briefcase size={16} className="text-gray-400" />} value={formData.experience} name="experience" placeholder="e.g. 5" onChange={handleChange} />
                                </div>

                                {/* ID Proof Selection Inline */}
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                        ID Proof
                                    </label>

                                    <div className="flex gap-2 items-center">
                                        {/* Select Dropdown */}
                                        <div className="relative flex-1">
                                            <select
                                                name="selectedIdProof"
                                                value={formData.selectedIdProof || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, selectedIdProof: e.target.value }))
                                                }
                                                className="w-full h-11 pl-3 pr-10 rounded-xl  border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm cursor-pointer"
                                            >
                                                <option value="">Select ID Proof</option>
                                                <option value="aadhaar">Aadhaar / Driving Licence</option>
                                                <option value="pan">PAN Number</option>
                                                <option value="passport">Passport</option>
                                                <option value="voterId">Voter ID</option>
                                            </select>
                                        </div>

                                        {/* Conditional Input Field */}
                                        {formData.selectedIdProof && (
                                            <div className="flex-1">
                                                <Input
                                                    icon={
                                                        formData.selectedIdProof === "aadhaar" ? (
                                                            <Fingerprint size={16} className="text-gray-400" />
                                                        ) : formData.selectedIdProof === "pan" ? (
                                                            <CreditCard size={16} className="text-gray-400" />
                                                        ) : (
                                                            <TextQuote size={16} className="text-gray-400" />
                                                        )
                                                    }
                                                    name={formData.selectedIdProof} // dynamic key
                                                    value={formData[formData.selectedIdProof] || ""}
                                                    placeholder={
                                                        formData.selectedIdProof === "aadhaar"
                                                            ? "Enter Aadhaar / Driving Licence"
                                                            : formData.selectedIdProof === "pan"
                                                                ? "ABCDE1234F"
                                                                : "Enter number"
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 ">Professional Bio</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><TextQuote size={18} /></span>
                                    <textarea
                                        name="bio"
                                        placeholder="Tell us about your professional journey..."
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px] text-sm"
                                    />
                                </div>
                            </div>

                            {/* Pricing & Services Card */}
                            <div className="bg-[#f8fafb] p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-[#082D3F] p-1.5 rounded-lg">
                                        <IndianRupee size={16} className="text-white" />
                                    </div>
                                    <h4 className="font-bold text-[#082D3F]">Services & Pricing</h4>
                                </div>
                                <div className="flex flex-col gap-4">

                                    {/* SERVICES SELECT */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                            Select Services (Multiple)
                                        </label>

                                        <div className="relative">
                                            <select
                                                disabled={isPackageAdded}
                                                className={`w-full h-11 pl-4 pr-10 rounded-xl border ${isPackageAdded ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                                    }`}
                                                onChange={(e) => {
                                                    if (isPackageAdded) return;
                                                    const selectedId = e.target.value;
                                                    const selectedService = services.find(s => s.id == selectedId);

                                                    if (
                                                        selectedService &&
                                                        !newService.serviceNames.includes(selectedService.title)
                                                    ) {
                                                        setNewService({
                                                            ...newService,
                                                            serviceNames: [...newService.serviceNames, selectedService.title]
                                                        });
                                                    }
                                                }}
                                            >
                                                <option value="">Choose Service...</option>
                                                {services
                                                    .filter((s) => s.active)
                                                    .map((s) => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.title}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* SELECTED TAGS */}
                                    {newService.serviceNames.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-dashed">
                                            {newService.serviceNames.map((sn, idx) => (
                                                <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                                    {sn}
                                                    <X size={12} onClick={() =>
                                                        setNewService({
                                                            ...newService,
                                                            serviceNames: newService.serviceNames.filter(name => name !== sn)
                                                        })
                                                    } />
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* PRICE INPUT (GLOBAL) */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                            Package Price (Applies to all selected services)
                                        </label>

                                        <Input
                                            disabled={isPackageAdded}
                                            icon={<span className="text-sm font-bold">{currencySymbol}</span>}
                                            placeholder="Enter package price"
                                            type="number"
                                            value={newService.price}
                                            onChange={(e) =>
                                                setNewService({ ...newService, price: e.target.value })
                                            }
                                        />
                                    </div>

                                    {/* ADD BUTTON */}
                                    <button
                                        onClick={addService}
                                        className="h-11 bg-[#082D3F] text-white rounded-xl font-bold text-sm"
                                    >
                                        Add Package
                                    </button>

                                </div>

                                {/* Selected Services Preview Tags */}
                                {newService.serviceNames.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 p-2 bg-white rounded-lg border border-dashed border-gray-200">
                                        {newService.serviceNames.map((sn, idx) => (
                                            <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                                                {sn}
                                                <X size={12} className="cursor-pointer" onClick={() => setNewService({ ...newService, serviceNames: newService.serviceNames.filter(name => name !== sn) })} />
                                            </span>
                                        ))}
                                        <p className="text-[10px] text-gray-400 w-full italic">*These services will be added under the specified price.</p>
                                    </div>
                                )}

                                {/* Display Added Service Packages */}
                                <div className="mt-6 space-y-3">
                                    {formData.services.map((s, i) => (
                                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-3 group hover:border-blue-200 transition-all">
                                            <div className="flex flex-wrap gap-2 flex-1">
                                                {/* Assuming s.serviceNames is an array in your state now */}
                                                {s.serviceNames.map((name, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
                                                <span className="font-extrabold text-[#082D3F] text-lg">{currencySymbol}{s.price}</span>
                                                <button
                                                    onClick={() => setFormData({ ...formData, services: formData.services.filter((_, idx) => idx !== i) })}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
    const inputRef = useRef();

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
        <div
            onClick={() => inputRef.current.click()}
            className="bg-gray-50 p-6 rounded-2xl border border-dashed text-center cursor-pointer hover:bg-gray-100 transition"
        >
            <div className="w-12 h-12 mx-auto bg-[#0e4b63]/10 text-[#0e4b63] rounded-full flex items-center justify-center mb-3">
                {icon}
            </div>

            <h4 className="font-bold">{title}</h4>

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                onChange={handleChange}
                className="hidden"
            />

            {uploadedDoc && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
                    <div className="flex items-center justify-between gap-2">

                        <span className="text-green-700 font-medium truncate max-w-[200px]">
                            ✅ {uploadedDoc.fileName}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // ❗ important
                                setFormData(prev => ({
                                    ...prev,
                                    documents: prev.documents.filter(doc => doc.type !== type)
                                }));
                            }}
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