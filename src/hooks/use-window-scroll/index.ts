'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
    window.addEventListener('scroll', callback);

    return () => {
        window.removeEventListener('scroll', callback);
    };
};
const getServerSnapshot = () => false;

/**
 * Allows to react to a change in window Y scroll value by asserting a Y position.
 *
 * @param selector - selector function that takes the current scrollY
 */
export const useWindowScroll = (selector: (scrollY: number) => boolean) =>
    useSyncExternalStore(subscribe, () => selector(scrollY), getServerSnapshot);
