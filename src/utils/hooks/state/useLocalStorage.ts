import { useSyncExternalStore } from 'react';

// storage 이벤트 구독
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key, defaultValue),
    () => defaultValue,
  );

  // setter
  const setValue = (newValue: T | null) => {
    if (typeof window === 'undefined') return;
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
    // 같은 탭에서도 리렌더링 되도록 강제로 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: newValue ? JSON.stringify(newValue) : null }));
  };

  return [value, setValue] as const;
}
