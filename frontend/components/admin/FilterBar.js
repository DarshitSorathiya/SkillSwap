import React from 'react';

export default function FilterBar({ filters, setFilters, onDownload }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))} className="border rounded px-2 py-1">
        <option value="">All Roles</option>
        <option value="admin">Admins</option>
        <option value="user">Users</option>
      </select>

      <select onChange={(e) => setFilters(f => ({ ...f, banned: e.target.value }))} className="border rounded px-2 py-1">
        <option value="">All</option>
        <option value="true">Banned</option>
        <option value="false">Not Banned</option>
      </select>

      <input
        type="text"
        placeholder="Search..."
        className="border px-2 py-1 rounded"
        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
      />

      <button
        onClick={onDownload}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Download CSV
      </button>
    </div>
  );
}
