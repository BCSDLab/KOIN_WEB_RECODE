import { useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};

const useMount = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export default useMount;
