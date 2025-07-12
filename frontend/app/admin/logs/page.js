'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LogList from '@/components/admin/LogList';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/logs')
      .then(res => setLogs(res.data.data))
      .catch(err => console.error('Failed to load logs', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Logs</h1>
      <LogList logs={logs} />
    </div>
  );
}
