import { useTokenStore } from 'utils/zustand/auth';

const isBrowser = () => typeof window !== 'undefined';

interface NativeTokens {
  access: string;
  refresh: string;
}

type NativeCallbackResult = NativeTokens | boolean | void;

class IOSWebBridge {
  private callbackMap: Record<string, (result: NativeCallbackResult) => void> = {};

  private callbackIdCounter = 0;

  private generateCallbackId(): string {
    this.callbackIdCounter += 1;
    return `cb_${Date.now()}_${this.callbackIdCounter}`;
  }

  call<T extends NativeCallbackResult>(methodName: string, ...args: unknown[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      this.callbackMap[callbackId] = resolve as (result: NativeCallbackResult) => void;

      const payload = {
        method: methodName,
        args,
        callbackId,
      };

      try {
        // iOS 웹뷰 통신 - tokenBridge 사용 (iOS에서 등록한 이름)
        window.webkit?.messageHandlers?.tokenBridge?.postMessage(JSON.stringify(payload));
      } catch {
        delete this.callbackMap[callbackId]; // clean up
        reject(new Error('iOS WebView 통신 실패'));
      }
    });
  }

  handleCallback(callbackId: string, result: NativeCallbackResult): void {
    if (this.callbackMap[callbackId]) {
      this.callbackMap[callbackId](result);
      delete this.callbackMap[callbackId];
    }
  }
}

// 전역 브릿지 인스턴스
if (isBrowser()) {
  window.NativeBridge = new IOSWebBridge();

  // 네이티브에서 호출할 콜백 함수
  window.onNativeCallback = (callbackId: string, result: NativeCallbackResult) => {
    window.NativeBridge?.handleCallback(callbackId, result);
  };
}

export function setTokensFromNative(access: string, refresh: string) {
  if (access) useTokenStore.getState().setToken(access);
  if (refresh) useTokenStore.getState().setRefreshToken(refresh);
}

export async function requestTokensFromNative(): Promise<NativeTokens> {
  // 이미 토큰이 있으면 그냥 반환
  const existingToken = useTokenStore.getState().token;
  const existingRefresh = useTokenStore.getState().refreshToken;

  if (!isBrowser()) return { access: '', refresh: '' };

  if (existingToken && existingRefresh) {
    return { access: existingToken, refresh: existingRefresh };
  }

  try {
    const tokens = await window.NativeBridge?.call<NativeTokens>('getUserToken');
    return {
      access: tokens?.access || '',
      refresh: tokens?.refresh || '',
    };
  } catch {
    return { access: '', refresh: '' };
  }
}

export async function saveTokensToNative(access: string, refresh: string): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    await window.NativeBridge?.call<boolean>('putUserToken', { access, refresh });
    return true;
  } catch {
    return false;
  }
}

export async function backButtonTapped(): Promise<void> {
  if (isBrowser()) {
    await window.NativeBridge?.call<void>('backButtonTapped');
  }
}
