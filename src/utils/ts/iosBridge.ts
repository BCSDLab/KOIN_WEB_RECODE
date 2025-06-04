import { useTokenStore } from 'utils/zustand/auth';

export function setTokensFromNative(access: string, refresh: string) {
  useTokenStore.getState().setToken(access);
  useTokenStore.getState().setRefreshToken(refresh);
}

export function requestTokensFromNative() {
  window.webkit?.messageHandlers?.WebViewBridge?.postMessage(
    JSON.stringify({ method: 'getUserToken', args: [], callbackId: 'accessToken' }),
  );
  window.webkit?.messageHandlers?.WebViewBridge?.postMessage(
    JSON.stringify({ method: 'getRefreshToken', args: [], callbackId: 'refreshToken' }),
  );
}
