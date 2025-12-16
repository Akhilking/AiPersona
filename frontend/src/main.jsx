import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnMount: true, // Always refetch when component mounts
            refetchOnReconnect: true, // Refetch when internet reconnects
            staleTime: 0, // Data is immediately stale (can be increased for caching)
            cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
            retry: 1, // Retry failed requests once
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
