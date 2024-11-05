import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import PortalProvider from 'components/common/Modal/PortalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

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
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PortalProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PortalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
