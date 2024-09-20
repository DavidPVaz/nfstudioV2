import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { PAGES } from '@/enums';
import { ToggleColorTheme } from '@/components/molecules/toggle-color-theme';
import { Button } from '@/components/atoms/button';
import { default as NFStudioIcon } from '@/resources/NFStudioIcon.svg';
import { default as NFStudioLettersIcon } from '@/resources/NFStudioLettersIcon.svg';
import { default as TwitterIcon } from '@/resources/TwitterIcon.svg';

export const Header = () => (
    <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full items-center justify-between gap-3 px-8">
            <nav className="flex flex-row items-center gap-4">
                <Button className="px-0 py-0" variant="link" asChild>
                    <Link className="flex flex-row items-center gap-1" href={PAGES.HOME}>
                        <NFStudioIcon className="h-[2.5rem] w-auto fill-primary-brand" />
                        <NFStudioLettersIcon className="hidden h-[2.5rem] w-auto fill-foreground 2xs:flex" />
                        <span className="sr-only">Go to main page</span>
                    </Link>
                </Button>
                <Button
                    className="hidden text-lg font-semibold text-foreground sm:flex"
                    variant="link"
                    asChild
                >
                    <Link aria-label="Go to collections page" href={PAGES.COLLECTIONS}>
                        Collections
                    </Link>
                </Button>
            </nav>

            <div className="flex flex-row items-center">
                <Button variant="ghost" size="icon2x" asChild>
                    <a
                        href={'mailto:info@nfstudio.xyz'}
                        rel="noopener noreferrer"
                        target={'_blank'}
                    >
                        <Mail className="h-[1.6rem] w-[1.6rem] stroke-current" />
                        <span className="sr-only">Send an email to NFStudio</span>
                    </a>
                </Button>
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
