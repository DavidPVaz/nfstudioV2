import React from 'react';
import { NFStudioIcon, NFStudioLettersIcon } from '@/resources';

export const Footer = () => {
    return (
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-row items-center gap-1">
                    By <NFStudioIcon className="h-[1.2rem] w-auto fill-current sm:h-[2rem]" />
                    <NFStudioLettersIcon className="h-[1.2rem] w-auto fill-current sm:h-[2rem]" />
                </div>
            </div>
        </footer>
    );
};
