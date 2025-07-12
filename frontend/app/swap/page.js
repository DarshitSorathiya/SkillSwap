"use client";
import { useState, useEffect } from "react";
import SwapCard from '@/components/SwapCard';
import { swaps } from '@/utils/api';

export default function SwapPage() {
  const [selected, setSelected] = useState("All");
  const options = ["All", "Approved", "Pending", "Rejected", "Completed"];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swapRequests, setSwapRequests] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const { data } = await swaps.getMySwaps();
      setSwapRequests(data || []);
    } catch (err) {
      console.error('Failed to fetch swap requests:', err);
      setError(err.response?.data?.message || 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (swapId, newStatus) => {
    setSwapRequests(prevSwaps => 
      prevSwaps.map(swap => 
        swap._id === swapId ? { ...swap, status: newStatus } : swap
      )
    );
  };

  // Filter swaps based on status and search query
  const filteredSwaps = swapRequests.filter(swap => {
    const matchesStatus = selected === "All" || swap.status.toLowerCase() === selected.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      swap.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.offeredSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.requestedSkill.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSwaps.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSwaps.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {selected}
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2">▼</span>
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {options.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelected(option);
                      setIsOpen(false);
                      setCurrentPage(1);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search swaps..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {currentItems.map((swap) => (
              <SwapCard
                key={swap._id}
                id={swap._id}
                recipientName={swap.recipientName}
                requesterName={swap.requesterName}
                offeredSkill={swap.offeredSkill}
                requestedSkill={swap.requestedSkill}
                status={swap.status}
                profilePhoto={swap.recipientPhoto}
                message={swap.message}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>

          {filteredSwaps.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-md bg-white border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-md bg-white border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}

          {currentItems.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No swap requests found
            </div>
          )}
        </>
      )}
    </div>
  );
}


