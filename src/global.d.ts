import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknown;
  }
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  import React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

type NativeCallbackResult = boolean | void;

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [name: string]: { postMessage(body: unknown): void };
      };
    };
    onNativeCallback?: (callbackId: string, result: NativeCallbackResult) => void;
    NativeBridge?: {
      call: <T extends NativeCallbackResult>(methodName: string, ...args: unknown[]) => Promise<T>;
      handleCallback: (callbackId: string, result: NativeCallbackResult) => void;
    };
  }
}
