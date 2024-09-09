'use client';

import React from 'react';
import { Button } from '@/components/atoms';
import { ArrowUp } from 'lucide-react';
import { useWindowScroll } from '@/hooks/use-window-scroll';

export const ScrollUp = () => {
    const { yPosition, scrollToTop } = useWindowScroll();

    return (
        <Button
            size={'icon2x'}
            onClick={scrollToTop}
            className={`${yPosition && yPosition > 150 ? 'fixed' : 'hidden'} bottom-5 right-5 z-10`}
        >
            <ArrowUp className="text-primary-foreground" />
            <span className="sr-only">Go to the top of the page</span>
        </Button>
    );
};
