"use client";
import React, { useState, useEffect } from 'react';

export default function RequestPage() {
  const [formData, setFormData] = useState({
    skillsOffered: '',
    skillsWanted: '',
    message: ''
  });

  // This would be replaced with actual login data
  const [userData, setUserData] = useState({
    name: 'John Doe', // This should come from your login/auth system
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      name: userData.name,
      ...formData
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Request</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {userData.name}
            </div>
          </div>

          <div>
            <label htmlFor="skillsOffered" className="block text-sm font-medium text-gray-700 mb-2">
              Skills You Can Offer (comma-separated)
            </label>
            <input
              type="text"
              id="skillsOffered"
              name="skillsOffered"
              value={formData.skillsOffered}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="e.g., React, Node.js, Python"
              required
            />
          </div>

          <div>
            <label htmlFor="skillsWanted" className="block text-sm font-medium text-gray-700 mb-2">
              Skills You Want to Learn (comma-separated)
            </label>
            <input
              type="text"
              id="skillsWanted"
              name="skillsWanted"
              value={formData.skillsWanted}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="e.g., JavaScript, UI/UX Design"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
              placeholder="Write a message to describe your learning goals or what you can offer..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
