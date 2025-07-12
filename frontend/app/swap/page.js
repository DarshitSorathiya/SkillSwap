"use client"
import SwapCard from '@/components/SwapCard';
import React from 'react'
import { useState } from "react";

const page = () => {
  const [selected, setSelected] = useState("All");
  const options = ["All", "Approved", "Pending", "Rejected"];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Example data array - replace with your actual data
  const dummyData = [
    { id: 1, status: "Approved", name: "John Doe", skillsOffered: ["React", "Node.js"], skillsWanted: ["Python"] },
    { id: 2, status: "Pending", name: "Jane Smith", skillsOffered: ["Python"], skillsWanted: ["JavaScript"] },
    { id: 3, status: "Rejected", name: "Mike Johnson", skillsOffered: ["UI/UX"], skillsWanted: ["React"] },
    { id: 4, status: "Pending", name: "Sarah Williams", skillsOffered: ["JavaScript"], skillsWanted: ["Python"] },
    { id: 5, status: "Approved", name: "Tom Brown", skillsOffered: ["Angular"], skillsWanted: ["Node.js"] },
    { id: 6, status: "Rejected", name: "Emily Davis", skillsOffered: ["Python"], skillsWanted: ["React"] },
  ];

  // Filter data based on status and search query
  const filteredData = dummyData.filter(item => {
    const matchesStatus = selected === "All" || item.status === selected;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selected, searchQuery]);

  return (
    <>
      <div className="px-8 mt-5 flex mx-38 gap-4 justify-end">
        <div className="relative w-64 ">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 text-left bg-green-50 border border-gray-300 rounded-md hover:bg-gray-300"
          >
            {selected}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              ▼
            </span>
          </button>

          {isOpen && (
            <div className="absolute w-full mt-1 bg-gray-100 border border-green-800 rounded-md shadow-lg">
              {options.map((option, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-96 px-4 py-2 bg-green-50 border border-green-300 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mx-38 px-8 mt-4">
        {currentItems.map((item) => (
          <SwapCard key={item.id} status={item.status} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 py-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-md bg-green-50 border border-green-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-100 transition-colors flex items-center justify-center"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                currentPage === page
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-gray-700 hover:bg-green-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-md bg-green-50 border border-green-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-100 transition-colors flex items-center justify-center"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default page


