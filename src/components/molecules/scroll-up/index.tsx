'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/atoms/button';
import { ArrowUp } from 'lucide-react';
import { useWindowScroll } from '@/hooks/use-window-scroll';

export const ScrollUp = () => {
    const show = useWindowScroll((scrollY: number) => scrollY > 150);

    const scrollToTop = useCallback(
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
            onClick={scrollToTop}
            className={`${show ? 'fixed' : 'hidden'} bottom-5 right-5 z-10`}
        >
            <ArrowUp className="text-primary-foreground" />
            <span className="sr-only">Go to the top of the page</span>
        </Button>
    );
};
