import { useTokenStore } from 'utils/zustand/auth';

export function setTokensFromNative(access: string, refresh: string) {
  useTokenStore.getState().setToken(access);
  useTokenStore.getState().setRefreshToken(refresh);
}

export function requestTokensFromNative() {
  window.webkit?.messageHandlers?.tokenBridge?.postMessage('getUserToken');
  window.webkit?.messageHandlers?.tokenBridge?.postMessage('getRefreshToken');
}
