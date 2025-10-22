import { STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';

type StorageSnapshot = {
  completion: string | null;
  sessionShown: boolean;
};

const subscribedListeners = new Set<() => void>();

// 실제 저장소에서 읽어오는 "원시 스냅샷"
function readStorageSnapshot(): StorageSnapshot {
  if (typeof window === 'undefined') {
    return { completion: null, sessionShown: false };
  }
  return {
    completion: localStorage.getItem(STORAGE_KEY.USER_INFO_COMPLETION),
    sessionShown: sessionStorage.getItem(STORAGE_KEY.MODAL_SESSION_SHOWN) === 'true',
  };
}

// 마지막으로 알린 스냅샷(참조 유지)
let lastSnapshot: StorageSnapshot = readStorageSnapshot();

// 변경이 있을 때만 캐시 갱신 + 비동기 알림
function notifyIfChanged() {
  const next = readStorageSnapshot();
  const changed =
    next.completion !== lastSnapshot.completion ||
    next.sessionShown !== lastSnapshot.sessionShown;

  if (!changed) return;

  lastSnapshot = next;

  queueMicrotask(() => {
    subscribedListeners.forEach((listener) => listener());
  });
}

// 구독: storage 이벤트 들어오면 변경 감지 기반으로만 알림
function subscribeStorage(listener: () => void) {
  subscribedListeners.add(listener);

  const handleStorageEvent = (event: StorageEvent) => {
    if (!event.key) return;
    if (
      event.key === STORAGE_KEY.USER_INFO_COMPLETION ||
      event.key === STORAGE_KEY.MODAL_SESSION_SHOWN
    ) {
      notifyIfChanged();
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  return () => {
    subscribedListeners.delete(listener);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

export const storageStore = {
  getSnapshot: () => lastSnapshot,
  subscribe: subscribeStorage,

  setCompletion(value: string) {
    const prev = localStorage.getItem(STORAGE_KEY.USER_INFO_COMPLETION);
    if (prev === value) return;
    localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, value);
    notifyIfChanged();
  },

  setSessionShown() {
    const prev = sessionStorage.getItem(STORAGE_KEY.MODAL_SESSION_SHOWN);
    if (prev === 'true') return;
    sessionStorage.setItem(STORAGE_KEY.MODAL_SESSION_SHOWN, 'true');
    notifyIfChanged();
  },

  markCompleted() {
    storageStore.setCompletion(COMPLETION_STATUS.COMPLETED);
  },

  markSkipped() {
    storageStore.setCompletion(COMPLETION_STATUS.SKIPPED);
  },
};
