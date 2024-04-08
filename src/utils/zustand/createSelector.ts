/* eslint-disable no-restricted-syntax */
import { StoreApi, UseBoundStore } from 'zustand';

// usage 참고 : https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
// const useBearStore = createSelectors(useBearStoreBase)

// // get the property
// const bears = useBearStore.use.bears()
// // get the action
// const increment = useBearStore.use.increment()

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export default createSelectors;
