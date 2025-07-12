'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState('');

  const clearExpired = async () => {
    try {
      const res = await axios.put('/api/admin/clear-notifications');
      setMessage(res.data.message || 'Expired notifications archived successfully.');
    } catch (err) {
      setMessage('Error archiving notifications.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clear Expired Notifications</h1>
      <button
        onClick={clearExpired}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Archive Expired Notifications
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
