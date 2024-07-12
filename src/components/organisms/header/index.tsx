import React from 'react';
import Link from 'next/link';
import { ToggleColorTheme } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { NFStudioIcon, NFStudioLettersIcon, TwitterIcon } from '@/resources';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur">
            <div className="container flex h-16 items-center justify-between gap-3">
                <nav className="flex flex-row items-center gap-4">
                    <Button className="px-0 py-0" variant="link" asChild>
                        <Link
                            className="flex flex-row items-center gap-1"
                            href={'http://localhost:3000'}
                        >
                            <NFStudioIcon className="h-[2.2rem] w-auto fill-current" />
                            <NFStudioLettersIcon className="hidden h-[2.2rem] w-auto fill-current sm:flex" />
                            <span className="sr-only">Go to NFStudio's main page</span>
                        </Link>
                    </Button>
                    <Button className="font-semibold sm:text-lg" variant="link" asChild>
                        <Link
                            aria-label="Go to collections"
                            className="flex flex-row items-center gap-1"
                            href={'http://localhost:3000/collections'}
                        >
                            Collections
                        </Link>
                    </Button>
                </nav>

                <div className="flex flex-row items-center">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href={'https://twitter.com/nfstudio_xyz'}
                            rel="noopener noreferrer"
                            target={'_blank'}
                        >
                            <TwitterIcon className="h-[1rem] w-[1rem] fill-current" />
                            <span className="sr-only">Go to NFStudio Twitter account</span>
                        </a>
                    </Button>

                    <ToggleColorTheme />
                </div>
            </div>
        </header>
    );
};
