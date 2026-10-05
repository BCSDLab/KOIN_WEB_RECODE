export const isBrowser = typeof window !== 'undefined';
export const isServer = !isBrowser;

type StorageVariant = 'local' | 'session';

const stringifyStorageValue = (value: unknown): string | null => {
  try {
    const serializedValue = JSON.stringify(value);
    return typeof serializedValue === 'string' ? serializedValue : null;
  } catch {
    return null;
  }
};

export const getBrowserStorage = (variant: StorageVariant): Storage | null => {
  if (!isBrowser) return null;

  try {
    return variant === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const createIsomorphicStorage = (variant: StorageVariant) => {
  const storageAdapter = {
    getItem(key: string): string | null {
      const storage = getBrowserStorage(variant);
      if (!storage) return null;

      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      const storage = getBrowserStorage(variant);
      if (!storage) return;

      try {
        storage.setItem(key, value);
      } catch {
        // 제한된 브라우저 환경에서는 Storage 접근이 불가능하거나 용량이 가득 찰 수 있습니다.
      }
    },
    getJSONItem<T>(key: string, defaultValue: T): T {
      const item = storageAdapter.getItem(key);
      if (!item) return defaultValue;

      try {
        return JSON.parse(item) as T;
      } catch {
        return defaultValue;
      }
    },
    setJSONItem(key: string, value: unknown): void {
      const serializedValue = stringifyStorageValue(value);
      if (serializedValue === null) return;

      storageAdapter.setItem(key, serializedValue);
    },
    removeItem(key: string): void {
      const storage = getBrowserStorage(variant);
      if (!storage) return;

      try {
        storage.removeItem(key);
      } catch {
        // 제한된 브라우저 환경에서는 Storage 접근이 불가능할 수 있습니다.
      }
    },
    clear(): void {
      const storage = getBrowserStorage(variant);
      if (!storage) return;

      try {
        storage.clear();
      } catch {
        // 제한된 브라우저 환경에서는 Storage 접근이 불가능할 수 있습니다.
      }
    },
  };

  return storageAdapter;
};

export const getStorageJSONValue = (value: unknown): string | null => stringifyStorageValue(value);

/** isomorphic-localStorage */
export const isomorphicLocalStorage = createIsomorphicStorage('local');

/** isomorphic-sessionStorage */
export const isomorphicSessionStorage = createIsomorphicStorage('session');

/** isomorphic-document */
export const isomorphicDocument = {
  getElementById(id: string): HTMLElement | null {
    return isBrowser ? window.document.getElementById(id) : null;
  },
  querySelector<T extends Element = Element>(selector: string): T | null {
    return isBrowser ? (window.document.querySelector(selector) as T) : null;
  },
  createElement<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] | null {
    return isBrowser ? window.document.createElement(tag) : null;
  },
};
