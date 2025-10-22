import { useSyncExternalStore } from 'react';

function subscribe(onStateChange: () => void) {
  const id = setTimeout(onStateChange, 0);
  return () => clearTimeout(id);
}

const useMount = (): boolean => useSyncExternalStore(subscribe, () => true, () => false);

export default useMount;
