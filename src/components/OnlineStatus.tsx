import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const OnlineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Badge 
      variant={isOnline ? "default" : "destructive"} 
      className="flex items-center gap-2 px-3 py-1 text-sm font-medium"
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          Offline
        </>
      )}
    </Badge>
  );
};