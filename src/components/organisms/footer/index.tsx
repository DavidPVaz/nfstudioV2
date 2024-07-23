import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { PAGES } from '@/shared/enums';
import { NFStudioIcon, NFStudioLettersIcon } from '@/resources';

export const Footer = () => {
    return (
        <footer className="py-6 md:px-8 md:py-0 md:pb-6">
            <div className="container flex flex-col items-center justify-center gap-4">
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-1">
                        <NFStudioIcon className="h-[2.5rem] w-auto fill-current sm:h-[4rem]" />
                        <NFStudioLettersIcon className="hidden w-auto fill-current 2xs:flex 2xs:h-[2.5rem] sm:h-[4rem]" />
                    </div>

                    <div className="flex flex-col items-end">
                        <Button
                            className="text-base font-medium 2xs:text-lg"
                            variant="link"
                            asChild
                        >
                            <Link
                                aria-label="Go to frequently asked questions"
                                href={PAGES.COLLECTIONS}
                            >
                                FAQ
                            </Link>
                        </Button>
                        <Button
                            className="text-base font-medium 2xs:text-lg"
                            variant="link"
                            asChild
                        >
                            <Link
                                target="_blank"
                                aria-label="Consult terms of service"
                                href={PAGES.TERMS_OF_SERVICE}
                            >
                                TERMS OF SERVICE
                            </Link>
                        </Button>
                        <Button
                            className="text-base font-medium 2xs:text-lg"
                            variant="link"
                            asChild
                        >
                            <Link
                                target="_blank"
                                aria-label="Consult privacy policy"
                                href={PAGES.PRIVACY_POLICY}
                            >
                                PRIVACY POLICY
                            </Link>
                        </Button>
                    </div>
                </div>

                <span>© 2024, NFStudio</span>
            </div>
        </footer>
    );
};

/*


*/
