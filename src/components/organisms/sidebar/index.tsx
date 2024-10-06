'use client';

import React from 'react';
import Link from 'next/link';
import { AlignJustify, Mail } from 'lucide-react';
import { default as TwitterIcon } from '@/resources/TwitterIcon.svg';
import { ToggleColorTheme } from '@/components/molecules/toggle-color-theme';
import { Button } from '@/components/atoms/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader
} from '@/components/atoms/sheet';
import { useModal } from '@/hooks/use-modal';
import { PAGES } from '@/enums';

const SIDEBAR_PAGES = {
    COLLECTIONS: { href: PAGES.COLLECTIONS, ariaLabel: 'Go to collections' },
    FAQ: { href: PAGES.FAQ, ariaLabel: 'Go to frequently asked questions' },
    ['TERMS OF SERVICE']: { href: PAGES.TERMS_OF_SERVICE, ariaLabel: 'Go to terms of service' },
    ['PRIVACY POLICY']: { href: PAGES.PRIVACY_POLICY, ariaLabel: 'Go to privacy policy' }
};

export const Sidebar = () => {
    const { isOpen, open, toggle } = useModal();

    return (
        <>
            <Button
                className="flex 2xs:hidden"
                variant="ghost"
                size="icon2x"
                onClick={open}
                disabled={isOpen}
            >
                <AlignJustify className="h-[1.6rem] w-[1.6rem]" />
                <span className="sr-only">Open sidebar</span>
            </Button>

            <Sheet open={isOpen} onOpenChange={toggle}>
                <SheetContent
                    side={'left'}
                    className="flex h-full w-full flex-col gap-y-5 bg-background/90 pt-24 backdrop-blur-sm dark:bg-background/70 dark:backdrop-blur-md"
                >
                    <SheetHeader className="m-0 flex flex-row items-center">
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
                    </SheetHeader>

                    <nav className="flex flex-1 flex-col gap-y-4">
                        {Object.entries(SIDEBAR_PAGES).map(([text, { href, ariaLabel }]) => (
                            <SheetClose asChild key={text}>
                                <Button
                                    className="flex justify-start p-0 text-2xl font-medium text-foreground"
                                    variant="link"
                                    asChild
                                >
                                    <Link aria-label={ariaLabel} href={href}>
                                        {text}
                                    </Link>
                                </Button>
                            </SheetClose>
                        ))}
                    </nav>
                    <SheetFooter>
                        <span className="text-center">© 2024, NFStudio</span>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
};
