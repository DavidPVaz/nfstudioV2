import React from 'react';
import Link from 'next/link';
import { PAGES } from '@/enums';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { ArrowLeft } from 'lucide-react';

const BackArrow = ({ onBack }: { onBack: () => void }) => (
    <Button
        onClick={onBack}
        variant="ghost"
        size="icon"
        className="absolute left-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-muted hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
    >
        <ArrowLeft className="h-10 w-10 2xs:h-6 2xs:w-6" />
        <span className="sr-only">Go to previous page</span>
    </Button>
);

const Actions = () => (
    <div className="absolute bottom-0 flex w-full flex-col items-center justify-center gap-y-4 py-2">
        <div className="flex flex-row gap-x-4">
            <Button className="h-9 rounded-lg px-5 2xs:h-11 2xs:px-8">PREVIEW</Button>
            <Button className="h-9 rounded-lg px-5 2xs:h-11 2xs:px-8">ORDER</Button>
        </div>
        <span className="w-full text-center text-xs">
            By clicking &#39;Order&#39;, you agree to the{' '}
            <Link aria-label="Consult terms of services" href={PAGES.TERMS_OF_SERVICE}>
                <strong>NFStudio Terms of Service</strong>
            </Link>
        </span>
    </div>
);

const Selectors = () => (
    <>
        <span className="text-base">NFT&#39;s positioning?</span>
        <span className="h-10 text-base">toggle</span>
    </>
);

export const Confirm = () => {
    const { cacheStrategy } = useStudioContext();
    const {
        previous,
        data: { selectedNFT }
    } = useWizardContext();

    return (
        <>
            <BackArrow onBack={previous} />
            <div className="relative grid h-[calc(100%-100px+1.5rem)] w-full grid-cols-1 2xs:h-[calc(100%-92px+1.5rem)] lg:grid-cols-2">
                <div className="relative flex w-full flex-1 flex-col items-center justify-start gap-y-3 lg:justify-center">
                    <div className="flex w-full justify-center px-14 lg:px-0">
                        <Image
                            width={350}
                            height={350}
                            className="rounded-lg"
                            src={selectedNFT.src}
                            alt={`NFT #${selectedNFT.id}`}
                            optimizedWidth={800}
                            quality={50}
                            {...cacheStrategy}
                        />
                    </div>
                    <div className="relative flex flex-col items-center gap-y-2 lg:hidden">
                        <Selectors />
                    </div>
                </div>
                <div className="hidden w-full flex-1 flex-col items-center justify-center gap-y-6 lg:flex">
                    <Selectors />
                </div>
            </div>
            <Actions />
        </>
    );
};
