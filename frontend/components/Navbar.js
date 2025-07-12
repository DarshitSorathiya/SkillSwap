
"use client";
import Link from "next/link";
import Login from "./Login";
import { useState } from "react";

export default function Navbar() {
    const [login, setLogin] = useState(false);

    return (
        <>
            <nav className="bg-black text-white px-48 py-4 flex justify-between items-center">
                {/* Brand Name */}
                <div className="text-2xl font-bold">
                    Skil Swapie
                </div>

                {/* Navigation Links
                <div className="hidden md:flex space-x-8">
                    <Link href="/" className="hover:text-gray-400 transition">
                        Home
                    </Link>
                    <Link href="/" className="hover:text-gray-400 transition">
                        
                    </Link>
                    <Link href="#services" className="hover:text-gray-400 transition">
                        Services
                    </Link>
                    <Link href="#effects" className="hover:text-gray-400 transition">
                        Effects
                    </Link>
                    <Link href="#ai" className="hover:text-gray-400 transition">
                        AI
                    </Link>
                    <Link href="#contact" className="hover:text-gray-400 transition">
                        Contact
                    </Link>
                </div> */}

                {/* Right Side Buttons */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setLogin(true)}
                        className="bg-white text-black px-4 py-2 rounded-md font-medium"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {login && <Login onClose={() => setLogin(false)} />}
        </>
    );
}
