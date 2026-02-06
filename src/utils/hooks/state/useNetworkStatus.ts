/**
 * navigator.onLine은 "인터넷 연결"이 아닌 "네트워크 연결"을 감지합니다.
 * WiFi에 연결되어 있지만 인터넷이 안 되는 경우에도 true일 수 있습니다.
 */

import { useState, useEffect } from 'react';

export default function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });

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

  return isOnline;
}
