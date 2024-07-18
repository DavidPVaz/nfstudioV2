import React from 'react';
import Link from 'next/link';
import { ToggleColorTheme } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { NFStudioIcon, NFStudioLettersIcon, TwitterIcon } from '@/resources';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md">
            <div className="mx-auto flex h-20 w-full items-center justify-between gap-3 px-8">
                <nav className="flex flex-row items-center gap-4">
                    <Button className="px-0 py-0" variant="link" asChild>
                        <Link
                            className="flex flex-row items-center gap-1"
                            href={'http://localhost:3000'}
                        >
                            <NFStudioIcon className="h-[2.5rem] w-auto fill-current" />
                            <NFStudioLettersIcon className="hidden h-[2.5rem] w-auto fill-current sm:flex" />
                            <span className="sr-only">Go to main page</span>
                        </Link>
                    </Button>
                    <Button className="hidden text-lg font-semibold sm:flex" variant="link" asChild>
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
                    <Button variant="ghost" size="icon2x" asChild>
                        <a
                            href={'https://twitter.com/nfstudio_xyz'}
                            rel="noopener noreferrer"
                            target={'_blank'}
                        >
                            <TwitterIcon className="h-[1.4rem] w-[1.4rem] fill-current" />
                            <span className="sr-only">Go to twitter account</span>
                        </a>
                    </Button>

                    <ToggleColorTheme />
                </div>
            </div>
        </header>
    );
};
