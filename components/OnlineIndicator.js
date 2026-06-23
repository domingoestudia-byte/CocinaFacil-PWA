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
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-[14px_4px_14px_4px] text-sm font-medium shadow-lg transition-all duration-300 border ${
        online
          ? 'bg-primary/10 text-primary-dark border-primary/30'
          : 'bg-accent/10 text-accent border-accent/30'
      }`}
    >
      <span
        className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
        style={{ backgroundColor: online ? 'var(--primary)' : 'var(--accent)' }}
      />
      {online ? 'Online' : 'Offline'}
    </div>
  );
}
