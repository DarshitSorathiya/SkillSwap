"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Add props for flexibility
const SwapCard = ({
    name = "Card Title",
    skilloffered = ["React", "Node.js"],
    skillwanted = ["JavaScript"],
    onAction,
    actionLabel = "Request",
    status = "Pending"
}) => {
    const router = useRouter();
    // Ensure skills are arrays
    const offered = Array.isArray(skilloffered) ? skilloffered : [skilloffered];
    const wanted = Array.isArray(skillwanted) ? skillwanted : [skillwanted];

    const handleClick = () => {
        router.push('/request');
    };

    const getStatusStyles = () => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "Pending":
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    return (
        <div className="w-full gap-12 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex ">
            <Link href="/porfo" className="flex items-center gap-4">

                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mr-6">
                    <img
                        src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>

                <div>

                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">{name}</h2>
                    </div>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-700">Skill Offered:</span>
                            {offered.map((skill, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-700">Skill Wanted:</span>
                            {wanted.map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </Link>

            <div className='flex items-center justify-end ml-auto'>
                <div className={`p-4 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
                    {status}
                </div>
            </div>
        </div>
    )
}

export default SwapCard