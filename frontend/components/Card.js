"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Add props for flexibility
const Card = ({
  name = "Card Title",
  skilloffered = ["React", "Node.js"],
  skillwanted = ["JavaScript"],
  onAction,
  actionLabel = "Request"
}) => {
  const router = useRouter();
  // Ensure skills are arrays
  const offered = Array.isArray(skilloffered) ? skilloffered : [skilloffered];
  const wanted = Array.isArray(skillwanted) ? skillwanted : [skillwanted];

  const handleClick = () => {
    router.push('/request');
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
          <h2 className="text-lg font-semibold mb-2 text-gray-900">{name}</h2>

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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleClick}
        >
          Request
        </button>
      </div>

    </div >
  )
}

export default Card