const isBrowser = () => typeof window !== 'undefined';

type NativeCallbackResult = boolean | void;

// 네이티브가 콜백을 부르지 않아도 호출한 쪽이 끝없이 기다리지 않게 한다
const NATIVE_CALLBACK_TIMEOUT_MS = 15000;

/**
 * iOS 앱 웹뷰인가. iOS 앱이 `tokenBridge` 메시지 핸들러를 등록한 웹뷰에서만 `true`다.
 * 서버는 이 값을 모르므로 렌더 중에 쓰지 않고 이벤트 핸들러에서만 쓴다.
 */
export const isIOSApp = () => isBrowser() && window.webkit?.messageHandlers?.tokenBridge != null;

/**
 * Android 앱 웹뷰인가. Android 앱이 `addJavascriptInterface`로 `window.Android`를 주입한 웹뷰에서만 `true`다.
 * 서버는 이 값을 모르므로 렌더 중에 쓰지 않고 이벤트 핸들러에서만 쓴다.
 */
export const isAndroidApp = () => isBrowser() && window.Android != null;

/** iOS·Android 앱 웹뷰인가. 렌더 중에 쓰지 않고 이벤트 핸들러에서만 쓴다. */
export const isNativeApp = () => isIOSApp() || isAndroidApp();

interface PendingCallback {
  resolve: (result: NativeCallbackResult) => void;
  reject: (error: Error) => void;
  timer: number;
}

class NativeWebBridge {
  private callbackMap: Record<string, PendingCallback> = {};

  private callbackIdCounter = 0;

  private generateCallbackId(): string {
    this.callbackIdCounter += 1;

    return `cb_${Date.now()}_${this.callbackIdCounter}`;
  }

  private post(methodName: string, args: unknown[], callbackId: string): void {
    if (isIOSApp()) {
      // iOS는 메시지를 받아 처리한 뒤 `window.onNativeCallback(callbackId, result)`를 부른다
      window.webkit?.messageHandlers?.tokenBridge?.postMessage(
        JSON.stringify({ method: methodName, args, callbackId }),
      );

      return;
    }

    const androidMethod = window.Android?.[methodName];
    if (typeof androidMethod === 'function') {
      // Android의 `@JavascriptInterface` 메서드는 동기로 실행되고 콜백을 부르지 않으므로 반환값으로 바로 끝낸다
      const result = androidMethod.apply(window.Android, args) as NativeCallbackResult;
      this.handleCallback(callbackId, result);

      return;
    }

    throw new Error(`네이티브 브릿지를 사용할 수 없습니다: ${methodName}`);
  }

  call<T extends NativeCallbackResult>(methodName: string, ...args: unknown[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const callbackId = this.generateCallbackId();
      const timer = window.setTimeout(() => {
        delete this.callbackMap[callbackId];
        reject(new Error(`네이티브 브릿지 응답 시간 초과: ${methodName}`));
      }, NATIVE_CALLBACK_TIMEOUT_MS);

      this.callbackMap[callbackId] = { resolve: resolve as (result: NativeCallbackResult) => void, reject, timer };

      try {
        this.post(methodName, args, callbackId);
      } catch (error) {
        window.clearTimeout(timer);
        delete this.callbackMap[callbackId];
        reject(error instanceof Error ? error : new Error(`네이티브 브릿지 호출 실패: ${methodName}`));
      }
    });
  }

  handleCallback(callbackId: string, result: NativeCallbackResult): void {
    const pending = this.callbackMap[callbackId];
    if (!pending) return;

    window.clearTimeout(pending.timer);
    delete this.callbackMap[callbackId];
    pending.resolve(result);
  }
}

// 전역 브릿지 인스턴스
if (isBrowser()) {
  window.NativeBridge = new NativeWebBridge();

  // 네이티브에서 호출할 콜백 함수
  window.onNativeCallback = (callbackId: string, result: NativeCallbackResult) => {
    window.NativeBridge?.handleCallback(callbackId, result);
  };
}

// 호출부는 결과를 기다리지 않고 부르므로, 실패는 여기서 기록만 하고 삼킨다
async function callNative(methodName: string, ...args: unknown[]): Promise<void> {
  if (!isBrowser()) return;

  try {
    await window.NativeBridge?.call<void>(methodName, ...args);
  } catch (error) {
    console.warn(error);
  }
}

export async function backButtonTapped(): Promise<void> {
  await callNative('backButtonTapped');
}

/**
 * 주문 웹뷰에서 앱으로 돌아간다. 어디로 갈지는 앱이 현재 웹뷰 경로를 보고 정한다
 */
export async function navigateBack(): Promise<void> {
  await callNative('navigateBack');
}

export async function goToShopDetail(orderableShopId: number): Promise<void> {
  await callNative('goToShopDetail', orderableShopId);
}
