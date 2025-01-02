import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/button';
import { PAGES } from '@/enums';
import { default as NFStudioIcon } from '@/resources/NFStudioIcon.svg';
import { default as NFStudioLettersIcon } from '@/resources/NFStudioLettersIcon.svg';

export const Footer = () => (
    <footer className="py-6 md:px-8 md:py-0 md:pb-6">
        <div className="container flex flex-col items-center justify-center gap-4">
            <div className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                    <NFStudioIcon className="h-[2.5rem] w-auto fill-primary-brand sm:h-[4rem]" />
                    <NFStudioLettersIcon className="hidden w-auto fill-current 2xs:flex 2xs:h-[2.5rem] sm:h-[4rem]" />
                </div>

                <div className="flex flex-col items-end">
                    <Button
                        className="text-base font-medium text-foreground 2xs:text-lg"
                        variant="link"
                        asChild
                    >
                        <Link aria-label="Go to frequently asked questions" href={PAGES.FAQ}>
                            FAQ
                        </Link>
                    </Button>
                    <Button
                        className="text-base font-medium text-foreground 2xs:text-lg"
                        variant="link"
                        asChild
                    >
                        <Link aria-label="Go to terms of service" href={PAGES.TERMS_OF_SERVICE}>
                            TERMS OF SERVICE
                        </Link>
                    </Button>
                    <Button
                        className="text-base font-medium text-foreground 2xs:text-lg"
                        variant="link"
                        asChild
                    >
                        <Link aria-label="Go to privacy policy" href={PAGES.PRIVACY_POLICY}>
                            PRIVACY POLICY
                        </Link>
                    </Button>
                </div>
            </div>

            <span>{`© ${new Date().getFullYear()}, NFStudio`}</span>
        </div>
    </footer>
);
