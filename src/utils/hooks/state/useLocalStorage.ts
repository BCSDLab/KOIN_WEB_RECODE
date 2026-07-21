import { useSyncExternalStore } from 'react';
import { getStorageJSONValue, isomorphicLocalStorage } from 'utils/ts/env';

// storage 이벤트 구독
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

// getSnapshot은 참조가 동일해야 useSyncExternalStore가 무한 재렌더링을 일으키지 않으므로,
// 원본 문자열이 바뀌지 않았다면 이전에 파싱한 값을 그대로 재사용합니다.
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function getSnapshot<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  const raw = isomorphicLocalStorage.getItem(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }

  const value = isomorphicLocalStorage.getJSONItem(key, defaultValue);
  snapshotCache.set(key, { raw, value });
  return value;
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
