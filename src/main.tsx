import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import PortalProvider from 'components/modal/Modal/PortalProvider';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/browser';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (import.meta.env.MODE === 'production' && import.meta.env.VITE_GLITCHTIP_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_GLITCHTIP_DSN,
    release: 'koin@0.1.0',
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [name: string]: { postMessage(body: unknown): void };
      };
    };
    onNativeCallback?: (id: string, value: string) => void;
    setTokens?: (access: string, refresh: string) => void;
  }
}

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PortalProvider>
            <App />
          </PortalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
