'use client';

import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useRef(
        new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false
                },
                queries: {
                    retry: false,
                    refetchOnMount: false,
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,
                    retryOnMount: false,
                    staleTime: 1000 * 60 * 60 // 1 hour
                }
            }
        })
    );

    return <QueryClientProvider client={client.current}>{children}</QueryClientProvider>;
};
