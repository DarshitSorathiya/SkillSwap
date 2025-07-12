"use client";
import Link from "next/link";
import Login from "./Login";
import { useState } from "react";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [login, setLogin] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <nav className="px-48 py-4 flex shadow-md justify-between items-center">
                {/* Brand Name */}
                <div className="text-green-500 text-2xl font-bold">
                    <Link href="/">SkillSwap</Link>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-3 space-x-4">
                    <Link
                        href="/swap"
                        className={`font-medium hover:text-green-600 transition-colors ${pathname === '/swap' ? 'text-green-500' : 'text-black'
                            }`}
                    >
                        Swap Request
                    </Link>

                    <Link href="/" className={`font-medium hover:text-green-600 transition-colors ${pathname === '/' ? 'text-green-500' : 'text-black'
                        }`}>
                        Home
                    </Link>

                    <button
                        onClick={() => setLogin(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {login && <Login onClose={() => setLogin(false)} />}
        </>
    );
}
