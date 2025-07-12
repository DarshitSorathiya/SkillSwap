"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Login from "./Login";

export default function Navbar() {
    const [login, setLogin] = useState(false);
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <nav className="px-48 py-4 flex shadow-md justify-between items-center">
                {/* Brand Name */}
                <div className="text-green-500 text-2xl font-bold">
                    <Link href="/">Skil Swapie</Link>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-3 space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/swap"
                                className={`font-medium hover:text-green-600 transition-colors ${pathname === '/swap' ? 'text-green-500' : 'text-black'
                                    }`}
                            >
                                Swap Request
                            </Link>

                            <Link
                                href="/profile"
                                className={`font-medium hover:text-green-600 transition-colors ${pathname === '/profile' ? 'text-green-500' : 'text-black'
                                    }`}
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setLogin(true)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {login && !isAuthenticated && (
                <Login onClose={() => setLogin(false)} />
            )}
        </>
    );
}
