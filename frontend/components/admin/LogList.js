import React from 'react';

export default function LogList({ logs }) {
  return (
    <ul className="space-y-2">
      {logs.map((log) => (
        <li key={log._id} className="p-3 border rounded bg-gray-50 text-sm">
          <p>
            <strong>{log.action}</strong> by <em>{log.performedBy?.username}</em> on{' '}
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
