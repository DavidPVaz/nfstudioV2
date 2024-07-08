import React from 'react';
import { ToggleTheme } from '@/components';

export default function Topbar() {
    return (
        <nav className="h-nav md:h-navMd fixed left-0 top-0 z-10 flex w-full flex-row items-center justify-between gap-x-5 border-b border-gray-300 bg-gradient-to-b from-zinc-200 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit md:px-8">
            <div className="flex">ICON</div>
            <div className="flex flex-row items-center">
                <ToggleTheme />
            </div>
        </nav>
    );
}
