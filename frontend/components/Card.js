"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Card = ({
  id,
  name = "Card Title",
  skillsOffered = ["React", "Node.js"],
  skillsWanted = ["JavaScript"],
  availability = [],
  profilePhoto,
  isPublicProfile = true,
  onAction,
  actionLabel = "Request"
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const offered = Array.isArray(skillsOffered) ? skillsOffered : [skillsOffered];
  const wanted = Array.isArray(skillsWanted) ? skillsWanted : [skillsWanted];

  const handleClick = () => {
    if (!isAuthenticated) {
      // Implement your login modal logic here
      return;
    }
    router.push(`/request?recipientId=${id}`);
  };

  return (
    <div className="w-full gap-12 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex">
      <Link href={`/profile/${id}`} className="flex items-center gap-4 flex-grow">
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mr-6">
          <img
            src={profilePhoto || "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"}
            alt={name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900">{name}</h2>

          <div className="mt-4 flex flex-col gap-2">
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
            {availability && availability.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">Availability:</span>
                {availability.map((time, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {time}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-end ml-auto">
        <button
          className={`px-4 py-2 rounded transition ${
            isAuthenticated
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          onClick={handleClick}
          title={!isAuthenticated ? 'Please login to request' : ''}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default Card;