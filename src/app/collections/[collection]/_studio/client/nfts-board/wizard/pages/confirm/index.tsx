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

export const Confirm = () => {
    const { cacheStrategy } = useStudioContext();
    const {
        previous,
        data: { selectedNFT }
    } = useWizardContext();

    return (
        <>
            <BackArrow onBack={previous} />
            <div className="relative flex max-h-full min-h-full min-w-full flex-col items-start justify-center">
                <div className="flex w-full flex-1 flex-col items-center justify-start gap-y-6">
                    <div className="flex w-full justify-center">
                        <Image
                            width={200}
                            height={200}
                            className="rounded-lg"
                            src={selectedNFT.src}
                            alt={`NFT #${selectedNFT.id}`}
                            optimizedWidth={800}
                            quality={50}
                            {...cacheStrategy}
                        />
                    </div>
                    <span className="text-base">NFT's positioning?</span>
                    <span className="h-10 text-base">toggle</span>
                </div>
                <div className="absolute bottom-0 flex w-full flex-col items-center justify-center gap-y-4">
                    <div className="flex flex-row gap-x-4">
                        <Button size="lg">PREVIEW</Button>
                        <Button size="lg">ORDER</Button>
                    </div>
                    <span className="w-full text-center text-xs">
                        By clicking 'Order', you agree to the{' '}
                        <Link aria-label="Consult terms of services" href={PAGES.TERMS_OF_SERVICE}>
                            <strong>NFStudio Terms of Service</strong>
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
};
