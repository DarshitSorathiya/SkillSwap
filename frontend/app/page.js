"use client";
import Card from "@/components/Card";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Availability");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const options = ["Weekdays (Morning)", "Weekdays (Evening)", "Weekends (Morning)", "Weekends (Evening)"];

  // Example data array - replace this with your actual data
  const dummyData = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    skilloffered: ["React", "Node.js"],
    skillwanted: ["Python", "UI/UX"]
  }));

  // Calculate pagination
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dummyData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="px-8 mt-5 flex gap-4 justify-end">
        <div className="relative w-64">
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

        <div className="">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 px-4 py-2 bg-green-50 border border-green-300 rounded-md focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mx-38 px-8 mt-4">
        {currentItems.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            skilloffered={item.skilloffered}
            skillwanted={item.skillwanted}
          />
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
  );
}
