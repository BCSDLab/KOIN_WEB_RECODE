import { isomorphicLocalStorage } from 'utils/ts/env';

// 예전에 회원 유형을 영속하던 키. 남아 있는 값을 지운다.
const LEGACY_SESSION_STORAGE_KEY = 'refresh-token-storage';

export const clearLegacySessionStorage = () => isomorphicLocalStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
