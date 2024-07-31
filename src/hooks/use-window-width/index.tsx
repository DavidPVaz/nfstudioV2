'use client';

import { useState, useLayoutEffect } from 'react';

export const useWindowWidth = () => {
    const [width, setWidth] = useState<number | null>(null);

    useLayoutEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler);
    }, []);

    return { width };
};
