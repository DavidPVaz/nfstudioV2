'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/atoms';
import { ArrowUp } from 'lucide-react';

// TODO: lazy load this ?
export const ScrollUp = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handler);

        return () => window.removeEventListener('scroll', handler);
    }, [setScrollY]);

    const backToTop = useCallback(
        () =>
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            }),
        []
    );

    return (
        <Button
            size={'icon2x'}
            onClick={backToTop}
            className={`${scrollY > 150 ? 'fixed' : 'hidden'} bottom-5 right-5 z-10`}
        >
            <ArrowUp className="text-primary-foreground" />
            <span className="sr-only">Go to the top of the page</span>
        </Button>
    );
};
