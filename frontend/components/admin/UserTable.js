import React from 'react';

export default function UserTable({ users, onBanToggle, onAdminToggle }) {
  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-t">
            <td className="p-2">{u.username}</td>
            <td>{u.email}</td>
            <td>{u.isAdmin ? 'Admin' : 'User'}</td>
            <td>{u.isBanned ? 'Banned' : 'Active'}</td>
            <td className="text-right space-x-2">
              <button onClick={() => onBanToggle(u._id)} className="text-red-600 hover:underline">
                {u.isBanned ? 'Unban' : 'Ban'}
              </button>
              <button onClick={() => onAdminToggle(u._id)} className="text-blue-600 hover:underline">
                {u.isAdmin ? 'Demote' : 'Promote'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}