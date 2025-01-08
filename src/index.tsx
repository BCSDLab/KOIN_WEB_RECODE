import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sendClientError } from '@bcsdlab/koin';
import ReactDOM from 'react-dom/client';
import PortalProvider from 'components/common/Modal/PortalProvider';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => sendClientError(error),
  }),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <PortalProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PortalProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
