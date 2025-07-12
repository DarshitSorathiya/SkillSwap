"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { swaps } from '@/utils/api';

const SwapCard = ({
  id,
  recipientName,
  requesterName,
  offeredSkill,
  requestedSkill,
  status,
  profilePhoto,
  message,
  onStatusUpdate
}) => {
  const router = useRouter();

  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const handleAction = async (action) => {
    try {
      await swaps.respondToSwap(id, action);
      if (onStatusUpdate) {
        onStatusUpdate(id, action);
      }
    } catch (err) {
      console.error('Failed to update swap status:', err);
    }
  };

  return (
    <div className="w-full gap-12 bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <Link href={`/profile/${id}`} className="flex items-center gap-4 flex-grow">
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mr-6">
            <img
              src={profilePhoto || "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900">
                  {recipientName}
                </h2>
                {message && (
                  <p className="text-gray-600 text-sm mb-4">{message}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">Skill Offered:</span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {offeredSkill}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">Skill Wanted:</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {requestedSkill}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col items-end gap-4">
          <div className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
            {status}
          </div>

          {status?.toLowerCase() === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("approved")}
                className="px-4 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("rejected")}
                className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapCard;