export const isBrowser = typeof window !== 'undefined';
export const isServer = !isBrowser;

/** isomorphic-localStorage */
export const isomorphicLocalStorage = {
  getItem(key: string): string | null {
    return isBrowser ? window.localStorage.getItem(key) : null;
  },
  setItem(key: string, value: string): void {
    if (isBrowser) window.localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (isBrowser) window.localStorage.removeItem(key);
  },
  clear(): void {
    if (isBrowser) window.localStorage.clear();
  },
};

/** isomorphic-sessionStorage */
export const isomorphicSessionStorage = {
  getItem(key: string): string | null {
    return isBrowser ? window.sessionStorage.getItem(key) : null;
  },
  setItem(key: string, value: string): void {
    if (isBrowser) window.sessionStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (isBrowser) window.sessionStorage.removeItem(key);
  },
  clear(): void {
    if (isBrowser) window.sessionStorage.clear();
  },
};

/** isomorphic-document */
export const isomorphicDocument = {
  getElementById(id: string): HTMLElement | null {
    return isBrowser ? window.document.getElementById(id) : null;
  },
  querySelector<T extends Element = Element>(selector: string): T | null {
    return isBrowser ? (window.document.querySelector(selector) as T) : null;
  },
  createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
  ): HTMLElementTagNameMap[K] | null {
    return isBrowser ? window.document.createElement(tag) : null;
  },
};
