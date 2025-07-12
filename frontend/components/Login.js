"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import '../app/globals.css';

export default function Login({ onClose }) {
    const router = useRouter();
    const { login, register, error: authError } = useAuth();
    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [isProfilePublic, setIsProfilePublic] = useState(true);
    const [skillsOfferedInput, setSkillsOfferedInput] = useState("");
    const [skillsWantedInput, setSkillsWantedInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state === "Sign Up" && !isTextDataSubmitted) {
            if (!name || !email || !password) {
                setError("Please fill in all required fields");
                return;
            }
            return setIsTextDataSubmitted(true);
        }

        setError("");
        setLoading(true);

        try {
            if (state === "Login") {
                if (!username && !email) {
                    throw new Error("Username or email is required");
                }
                if (!password) {
                    throw new Error("Password is required");
                }

                await login({
                    username: username || email,
                    password,
                });
            } else {
                // Validation for registration
                if (!username || !name || !email || !password || !phone || !dob) {
                    throw new Error("Please fill in all required fields");
                }

                const skillsOffered = skillsOfferedInput.split(/[ ,]+/).filter(Boolean);
                const skillsWanted = skillsWantedInput.split(/[ ,]+/).filter(Boolean);

                if (skillsOffered.length === 0) {
                    throw new Error("Please add at least one skill you can offer");
                }

                const formData = new FormData();
                formData.append("username", username);
                formData.append("fullname", name);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("phoneNo", phone);
                formData.append("dob", dob);
                formData.append("gender", gender);
                formData.append("isPublicProfile", isProfilePublic);
                formData.append("skillsOffered", JSON.stringify(skillsOffered));
                formData.append("skillsWanted", JSON.stringify(skillsWanted));
                formData.append("availability", JSON.stringify([]));
                
                if (image) {
                    formData.append("profilePhoto", image);
                }

                await register(formData);
            }
            onClose();
            router.refresh();
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.message || err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    };

    const formVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
        exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } },
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] font-semibold flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.form
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-[400px] sm:w-96 text-gray-800 relative border border-gray-200"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
            >
                <button
                    type="button"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                        {state === "Login" ? "Welcome back!" : "Welcome!"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
                        {state === "Login"
                            ? "Please sign in to continue your journey"
                            : "Create an account to get started"}
                    </p>
                </div>

                {state === "Sign Up" && isTextDataSubmitted ? (
                    <>
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <label htmlFor="image" className="cursor-pointer group">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden group-hover:border-green-400 transition-colors">
                                    <Image
                                        src={image ? URL.createObjectURL(image) : "/placeholder-image.png"}
                                        alt="Upload"
                                        width={80}
                                        height={80}
                                        className="rounded-full"
                                    />
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    hidden
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </label>
                            <p className="text-xs sm:text-sm text-gray-400">Profile Picture</p>
                        </div>

                        {/* Additional Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                            <input
                                type="text"
                                placeholder="Username"
                                className="input-style"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="input-style"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                            <input
                                type="date"
                                className="input-style"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                            <select
                                className="input-style"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                            <input
                                type="checkbox"
                                checked={isProfilePublic}
                                onChange={(e) => setIsProfilePublic(e.target.checked)}
                            />
                            Make profile public?
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Skills Offered (space separated)"
                                className="input-style"
                                value={skillsOfferedInput}
                                onChange={(e) => setSkillsOfferedInput(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Skills Wanted (space separated)"
                                className="input-style"
                                value={skillsWantedInput}
                                onChange={(e) => setSkillsWantedInput(e.target.value)}
                            />
                        </div>

                    </>
                ) : (

                    <>
                        {state === "Sign Up" && (
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {state === "Sign Up" && (
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="input-style"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        )}
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                {state === "Login" && (
                    <p className="text-xs sm:text-sm text-green-600 hover:text-green-500 text-right cursor-pointer mb-3 sm:mb-4 transition-colors">
                        Forgot password?
                    </p>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 shadow-md`}
                >
                    {loading ? 'Please wait...' : state === "Login" ? "Login" : isTextDataSubmitted ? "Create Account" : "Next"}
                </button>

                <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6">
                    {state === "Login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <span
                                className="text-green-600 hover:text-green-500 cursor-pointer transition-colors"
                                onClick={() => setState("Sign Up")}
                            >
                                Sign Up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span
                                className="text-green-600 hover:text-green-500 cursor-pointer transition-colors"
                                onClick={() => setState("Login")}
                            >
                                Login
                            </span>
                        </>
                    )}
                </p>
            </motion.form>
        </motion.div>
    );
}