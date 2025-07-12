"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    
    // Example data - replace with actual user data
    const userData = {
        name: "John Doe",
        image: "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        skillsOffered: ["React", "Node.js", "TypeScript", "Next.js"],
        skillsWanted: ["Python", "UI/UX Design", "AWS"],
        availability: "Weekdays (Evening)",
        feedbacks: [
            { id: 1, rating: 5, comment: "Great mentor! Very helpful and knowledgeable.", author: "Alice Smith" },
            { id: 2, rating: 4, comment: "Clear explanations and patient teaching style.", author: "Bob Johnson" }
        ]
    };

    const handleClick = () => {
        router.push('/request');
    };

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        console.log({ rating, feedback });
        setRating(0);
        setFeedback('');
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                    <div className="flex gap-8 items-start">
                        {/* Profile Image Section */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-40 rounded-full bg-gray-100 overflow-hidden">
                                <img
                                    src={userData.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-grow">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-4">{userData.name}</h1>

                            {/* Availability */}
                            <div className="mb-6">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {userData.availability}
                                </span>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-6">
                                {/* Skills Offered */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills Offered</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skillsOffered.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Wanted */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills Wanted</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skillsWanted.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                    onClick={handleClick}
                                >
                                    Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Feedback & Ratings</h2>
                    
                    {/* Submit Feedback Form */}
                    <form onSubmit={handleSubmitFeedback} className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Leave Your Feedback</h3>
                        
                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="text-3xl text-yellow-400 focus:outline-none"
                                >
                                    {star <= (hoveredStar || rating) ? "★" : "☆"}
                                </button>
                            ))}
                        </div>

                        {/* Feedback Text */}
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors min-h-[100px] mb-4"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Submit Feedback
                        </button>
                    </form>

                    {/* Previous Feedbacks */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Previous Feedbacks</h3>
                        {userData.feedbacks.map((feedback) => (
                            <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-800">{feedback.author}</span>
                                    <div className="text-yellow-400">
                                        {"★".repeat(feedback.rating)}
                                        {"☆".repeat(5 - feedback.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-600">{feedback.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
