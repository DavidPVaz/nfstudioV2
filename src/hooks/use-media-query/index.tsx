'use client';

import { useCallback, useSyncExternalStore } from 'react';

export const useMediaQuery = (mediaQuery: string) => {
    const subscribe = useCallback(
        (callback: () => void) => {
            const matchMedia = window.matchMedia(mediaQuery);
            matchMedia.addEventListener('change', callback);

            return () => matchMedia.removeEventListener('change', callback);
        },
        [mediaQuery]
    );

    const getSnapshot = useCallback(() => window.matchMedia(mediaQuery).matches, [mediaQuery]);
    const getServerSnapshot = useCallback(() => true, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
