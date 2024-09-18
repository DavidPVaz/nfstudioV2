'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Allows to subscribe to changes in media-query.
 *
 * @param mediaQuery - media query to subscribe to
 */
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
