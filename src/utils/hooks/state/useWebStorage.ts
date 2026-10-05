import { useSyncExternalStore } from 'react';
import {
  getBrowserStorage,
  getStorageJSONValue,
  isomorphicLocalStorage,
  isomorphicSessionStorage,
} from 'utils/ts/env';

type StorageVariant = 'local' | 'session';

const getStorage = (variant: StorageVariant) => getBrowserStorage(variant);

const getIsomorphicStorage = (variant: StorageVariant) => (
  variant === 'local' ? isomorphicLocalStorage : isomorphicSessionStorage
);

const subscribe = (variant: StorageVariant, key: string) => {
  return (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const onStorage = (event: StorageEvent) => {
      const storage = getStorage(variant);
      if (event.key === key && (!storage || event.storageArea === storage)) {
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
    return getIsomorphicStorage(variant).getJSONItem(key, defaultValue);
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
    const nextStorageValue = newValue === null ? null : getStorageJSONValue(newValue);

    if (newValue === null) {
      getIsomorphicStorage(variant).removeItem(key);
    } else {
      getIsomorphicStorage(variant).setJSONItem(key, newValue);
    }

    const storage = getStorage(variant);
    const storageEventInit: StorageEventInit = { key, newValue: nextStorageValue };

    if (storage) {
      storageEventInit.storageArea = storage;
    }

    window.dispatchEvent(new StorageEvent('storage', storageEventInit));
  };

  return [value, setValue] as const;
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  return useWebStorage<T>(key, defaultValue, { variant: 'local' });
};

export const useSessionStorage = <T>(key: string, defaultValue: T) => {
  return useWebStorage<T>(key, defaultValue, { variant: 'session' });
};
