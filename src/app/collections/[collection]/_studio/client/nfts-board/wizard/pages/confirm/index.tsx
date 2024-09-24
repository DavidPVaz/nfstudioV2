import React, { useCallback } from 'react';
import Link from 'next/link';
import { PAGES } from '@/enums';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { NFTPositionSwitch } from '@/components/molecules/nft-position-switch';
import { ArrowLeft } from 'lucide-react';

const BackArrow = React.memo(
    ({ onBack }: { onBack: () => void }) => (
        <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-muted hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
        >
            <ArrowLeft className="h-10 w-10 2xs:h-6 2xs:w-6" />
            <span className="sr-only">Go to previous page</span>
        </Button>
    ),
    (previousProps, nextProps) => previousProps.onBack === nextProps.onBack
);

const Actions = React.memo(() => (
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
));

const NFTDisplay = React.memo(
    ({
        src,
        id,
        maxAge,
        sMaxAge
    }: {
        src: string;
        id: number;
        maxAge?: number;
        sMaxAge?: number;
    }) => (
        <div className="flex w-full justify-center px-14 lg:px-0">
            <Image
                width={350}
                height={350}
                className="rounded-lg"
                src={src}
                alt={`NFT #${id}`}
                optimizedWidth={800}
                quality={50}
                maxAge={maxAge}
                sMaxAge={sMaxAge}
            />
        </div>
    )
);

const Selectors = ({
    checked,
    onCheckChange
}: {
    checked: boolean;
    onCheckChange: (checked: boolean) => void;
}) => (
    <>
        <span className="text-base 2xs:text-xl">NFT&#39;s positioning?</span>

        <NFTPositionSwitch
            leftLabel="Center"
            rightLabel="Right"
            checked={checked}
            onCheckChange={onCheckChange}
        />
    </>
);

export const Confirm = () => {
    const { cacheStrategy } = useStudioContext();
    const {
        previous,
        updateData,
        data: { selectedNFT, atRight }
    } = useWizardContext();

    const onNFTPositionCheck = useCallback(
        (atRight: boolean) => updateData({ atRight }),
        [updateData]
    );

    return (
        <>
            <BackArrow onBack={previous} />
            <div className="relative grid h-[calc(100%-100px+1.5rem)] w-full grid-cols-1 2xs:h-[calc(100%-92px+1.5rem)] lg:grid-cols-2">
                <div className="relative flex w-full flex-1 flex-col items-center justify-start gap-y-3 lg:justify-center">
                    <NFTDisplay {...selectedNFT} {...cacheStrategy} />
                    <div className="relative flex w-full flex-col items-center gap-y-2 lg:hidden">
                        <Selectors checked={atRight} onCheckChange={onNFTPositionCheck} />
                    </div>
                </div>
                <div className="hidden w-full flex-1 flex-col items-center justify-center gap-y-6 lg:flex">
                    <Selectors checked={atRight} onCheckChange={onNFTPositionCheck} />
                </div>
            </div>
            <Actions />
        </>
    );
};
