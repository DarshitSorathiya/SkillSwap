// 'use client'; // Only if using Next.js App Router

import React from 'react';

const page = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 my-10">
      {/* Top Section: Name + Avatar */}
      <div className="flex justify-between items-start flex-wrap gap-6">
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold text-gray-900">Sarah Johnson</h2>
          <p className="text-xl text-gray-600 mt-1">📍 San Francisco, CA</p>

          {/* Contact Details */}
          <div className="mt-4 space-y-2 text-gray-700 text-base">
            <p><span className="font-medium">Username:</span> sarahj_dev</p>
            <p><span className="font-medium">Email:</span> sarah.johnson@example.com</p>
            <p><span className="font-medium">Phone:</span> (123) 456-7890</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="w-44 h-44 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl font-bold shadow-inner">
          SJ
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skills Offered</h3>
          <div className="flex flex-wrap gap-3">
            {["React", "JavaScript", "Node.js", "UI/UX Design", "Python", "MongoDB"].map(skill => (
              <span key={skill} className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skills Wanted</h3>
          <div className="flex flex-wrap gap-3">
            {["Machine Learning", "DevOps", "Mobile Development", "Blockchain"].map(skill => (
              <span key={skill} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-base font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Availability</h3>
        <div className="flex flex-wrap gap-4">
          {[
            "Weekday Morning",
            "Weekday Evening",
            "Weekend Morning",
            "Weekend Evening",
            "Flexible Anytime"
          ].map(time => (
            <span key={time} className="bg-green-100 text-green-800 px-6 py-3 rounded-xl text-base font-medium">
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Type Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Profile Type</h3>
        <div className="flex gap-6">
          <button className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 text-base font-semibold">
            Public Profile
          </button>
          <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-base font-medium flex items-center gap-2">
            🔒 Private Available
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
