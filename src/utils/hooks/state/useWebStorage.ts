import { useSyncExternalStore } from 'react';

type StorageVariant = 'local' | 'session';

const getStorage = (variant: StorageVariant): Storage => variant === 'local' ? localStorage : sessionStorage;

const subscribe = (variant: StorageVariant, key: string) => {
  return (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const onStorage = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === getStorage(variant)) {
        callback();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  };
};

const getSnapshot = <T>(variant: StorageVariant, key: string, defaultValue: T) => {
  return () => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = getStorage(variant).getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  };
};

export function useWebStorage<T>(key: string, defaultValue: T, options?: { variant?: StorageVariant }) {
  const variant: StorageVariant = options?.variant || 'session';

  const value = useSyncExternalStore(
    subscribe(variant, key),
    getSnapshot(variant, key, defaultValue),
    () => defaultValue,
  );

  const setValue = (newValue: T | null) => {
    if (typeof window === 'undefined') return;

    const storage = getStorage(variant);
    if (newValue === null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, JSON.stringify(newValue));
    }

    window.dispatchEvent(
      new StorageEvent('storage', { key, newValue: newValue ? JSON.stringify(newValue) : null, storageArea: storage }),
    );
  };

  return [value, setValue] as const;
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  return useWebStorage<T>(key, defaultValue, { variant: 'local' });
};

export const useSessionStorage = <T>(key: string, defaultValue: T) => {
  return useWebStorage<T>(key, defaultValue, { variant: 'session' });
};
