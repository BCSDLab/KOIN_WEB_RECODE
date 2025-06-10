import { useTokenStore } from 'utils/zustand/auth';
import showToast from './showToast';

class IOSWebBridge {
  private callbackMap: { [key: string]: (result: any) => void } = {};

  private callbackIdCounter = 0;

  private generateCallbackId(): string {
    this.callbackIdCounter += 1;
    return `cb_${Date.now()}_${this.callbackIdCounter}`;
  }

  call(methodName: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      this.callbackMap[callbackId] = resolve;

      const payload = {
        method: methodName,
        args,
        callbackId,
      };

      try {
        // iOS 웹뷰 통신 - tokenBridge 사용 (iOS에서 등록한 이름)
        window.webkit?.messageHandlers?.tokenBridge?.postMessage(JSON.stringify(payload));
      } catch (e) {
        delete this.callbackMap[callbackId]; // clean up
        reject(new Error('iOS WebView 통신 실패'));
      }
    });
  }

  handleCallback(callbackId: string, result: any): void {
    if (this.callbackMap[callbackId]) {
      this.callbackMap[callbackId](result);
      delete this.callbackMap[callbackId];
    }
  }
}

// 전역 브릿지 인스턴스
window.NativeBridge = new IOSWebBridge();

// 네이티브에서 호출할 콜백 함수
window.onNativeCallback = (callbackId: string, result: any) => {
  window.NativeBridge?.handleCallback(callbackId, result);
};

export function setTokensFromNative(access: string, refresh: string) {
  if (access) useTokenStore.getState().setToken(access);
  if (refresh) useTokenStore.getState().setRefreshToken(refresh);
}

export async function requestTokensFromNative(): Promise<{ access: string, refresh: string }> {
  try {
    const accessPromise = window.NativeBridge?.call('getUserToken');
    const refreshPromise = window.NativeBridge?.call('getRefreshToken');

    const [accessResult, refreshResult] = await Promise.all([accessPromise, refreshPromise]);

    return {
      access: accessResult?.access || '',
      refresh: refreshResult?.refresh || '',
    };
  } catch (error) {
    return { access: '', refresh: '' };
  }
}

export async function saveTokensToNative(access: string, refresh: string): Promise<boolean> {
  try {
    await window.NativeBridge?.call('saveTokens', { access, refresh });
    return true;
  } catch (error) {
    return false;
  }
}

export async function backButtonTapped(): Promise<void> {
  try {
    await window.NativeBridge?.call('backButtonTapped');
  } catch (error) {
    showToast('error', '에러 발생');
  }
}
