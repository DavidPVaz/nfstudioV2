import React from 'react';
import { ToggleTheme } from '@/components';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur">
            <div className="container flex h-14 items-center">
                <div className="flex">ICON</div>
                <div className="flex flex-row items-center">
                    <ToggleTheme />
                </div>
            </div>
        </header>
    );
};
