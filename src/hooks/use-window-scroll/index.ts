'use client';

import { useState, useEffect, useCallback } from 'react';

export const useWindowScroll = () => {
    const [yPosition, setYPosition] = useState<number | null>(null);

    const scrollToTop = useCallback(
        () =>
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            }),
        []
    );

    useEffect(() => {
        const handler = () => setYPosition(window.scrollY);
        window.addEventListener('scroll', handler);

        return () => window.removeEventListener('scroll', handler);
    }, []);

    return { yPosition, scrollToTop };
};
