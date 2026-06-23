'use client';

import { useState, useEffect } from 'react';

export default function OnlineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
        online
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: online ? '#22c55e' : '#ef4444' }} />
      {online ? 'Online' : 'Offline'}
    </div>
  );
}