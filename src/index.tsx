import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient as QueryClientV3, QueryClientProvider as QueryClientProviderV3 } from 'react-query'; // V3 버전 사용
// 순차적 진행을 위해. 기존의 V3는 다른 이름으로 남겨둠. 작업 완료 후 삭제할 것.

import PortalProvider from 'components/common/Modal/PortalProvider';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import reportWebVitals from './reportWebVitals';
import showToast from './utils/ts/showToast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const queryClientV3 = new QueryClientV3({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
      onError: () => {
        showToast('error', '네트워크 연결을 확인해주세요.');
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <PortalProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <QueryClientProviderV3 client={queryClientV3}>
              <App />
            </QueryClientProviderV3>
          </QueryClientProvider>
        </BrowserRouter>
      </PortalProvider>
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
