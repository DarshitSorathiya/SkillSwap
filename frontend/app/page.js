"use client";
import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "@/utils/api";

export default function Home() {
  const [selected, setSelected] = useState("All Skills");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const itemsPerPage = 6;

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [skillFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Assuming you have an endpoint that returns users with their skills
      const response = await api.get('/users', {
        params: {
          search: searchQuery,
          skillType: skillFilter !== 'all' ? skillFilter : undefined,
        }
      });
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / itemsPerPage);

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
                {["All Skills", "Skills Offered", "Skills Wanted"].map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelected(option);
                      setSkillFilter(option.toLowerCase().replace(' ', '_'));
                      setIsOpen(false);
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
            placeholder="Search skills or users..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {currentItems.map((user) => (
              <Card
                key={user._id}
                id={user._id}
                name={user.fullname}
                skillsOffered={user.skillsOffered}
                skillsWanted={user.skillsWanted}
                availability={user.availability}
                profilePhoto={user.profilePhoto?.url}
                isPublicProfile={user.isPublicProfile}
              />
            ))}
          </div>

          {users.length > itemsPerPage && (
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
        </>
      )}
    </div>
  );
}
