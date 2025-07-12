'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '@/components/admin/UserTable';
import FilterBar from '@/components/admin/FilterBar';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', banned: '', search: '' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', { params: filters });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const toggleBan = async (userId) => {
    await axios.put(`/api/admin/ban/${userId}`);
    fetchUsers();
  };

  const toggleAdmin = async (userId) => {
    await axios.put(`/api/admin/admin/${userId}`);
    fetchUsers();
  };

  const downloadCSV = () => {
    window.location.href = '/api/admin/download-report';
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <FilterBar filters={filters} setFilters={setFilters} onDownload={downloadCSV} />
      <UserTable users={users} onBanToggle={toggleBan} onAdminToggle={toggleAdmin} />
    </div>
  );
}
