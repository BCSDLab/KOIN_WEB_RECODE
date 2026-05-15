import { useSyncExternalStore } from 'react';
import { getStorageJSONValue, isomorphicLocalStorage } from 'utils/ts/env';

// storage 이벤트 구독
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  return isomorphicLocalStorage.getJSONItem(key, defaultValue);
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
    const nextStorageValue = newValue === null ? null : getStorageJSONValue(newValue);

    if (newValue === null) {
      isomorphicLocalStorage.removeItem(key);
    } else {
      isomorphicLocalStorage.setJSONItem(key, newValue);
    }
    // 같은 탭에서도 리렌더링 되도록 강제로 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: nextStorageValue }));
  };

  return [value, setValue] as const;
}
