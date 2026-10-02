import { isomorphicLocalStorage } from 'utils/ts/env';

// 예전에는 회원 유형을 이 키로 영속했다. 더는 쓰지 않으므로 남아 있는 값을 한 번 지운다.
const LEGACY_SESSION_STORAGE_KEY = 'refresh-token-storage';

export const clearLegacySessionStorage = () => isomorphicLocalStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
