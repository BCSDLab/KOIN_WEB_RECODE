import { useTokenStore } from 'utils/zustand/auth';
import showToast from './showToast';

export function setTokensFromNative(access: string, refresh: string) {
  if (access) useTokenStore.getState().setToken(access);
  if (refresh) useTokenStore.getState().setRefreshToken(refresh);
  showToast('default', `엑세스 토큰 :${access} 리프레쉬토큰 : ${refresh}`);
}

export function requestTokensFromNative() {
  window.webkit?.messageHandlers?.tokenBridge?.postMessage('getUserToken');
  window.webkit?.messageHandlers?.tokenBridge?.postMessage('getRefreshToken');
}

export function saveTokensToNative(access: string, refresh: string) {
  const payload = JSON.stringify({ access, refresh });
  window.webkit?.messageHandlers?.tokenBridge.postMessage(
    `saveTokens:${payload}`,
  );
}

export function backbuttonTapp() {
  window.webkit?.messageHandlers?.tokenBridge?.postMessage('backbuttonTapped');
}
