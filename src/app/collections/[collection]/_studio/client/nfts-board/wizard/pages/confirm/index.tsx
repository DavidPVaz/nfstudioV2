import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { PAGES, PLATFORMS, type Platform } from '@/enums';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { Switch } from '@/components/molecules/nft-position-switch';
import { SelectableLogo } from '@/components/molecules/selectable-logo';
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

const Logos = React.memo(
    ({
        logos,
        selectedLogo,
        onSelect
    }: {
        logos: string[];
        selectedLogo?: string;
        onSelect: (logo?: string) => void;
    }) => (
        <div
            className={`grid w-[95%] ${logos.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3 transition-all`}
        >
            {logos.map((logo, index) => (
                <SelectableLogo
                    key={logo}
                    logo={logo}
                    selected={logo === selectedLogo}
                    onSelect={onSelect}
                    ariaLabel={`Select logo ${index + 1}`}
                />
            ))}
        </div>
    ),
    (previousProps, nextProps) =>
        previousProps.selectedLogo === nextProps.selectedLogo &&
        previousProps.onSelect === nextProps.onSelect
);

const Selectors = ({
    platform,
    nftPositionChecked,
    onNFTPositionCheckChange,
    coverStyleChecked,
    onCoverStyleCheckChange,
    logos,
    selectedLogo,
    onLogoSelect
}: {
    platform: Platform;
    nftPositionChecked: boolean;
    onNFTPositionCheckChange: (checked: boolean) => void;
    coverStyleChecked: boolean;
    onCoverStyleCheckChange: (checked: boolean) => void;
    logos: string[];
    selectedLogo?: string;
    onLogoSelect: (logo?: string) => void;
}) => {
    const userSelectedMobilePlatform = useMemo(() => platform === PLATFORMS.MOBILE, [platform]);
    const switchLabel = useMemo(
        () => (userSelectedMobilePlatform ? 'Cover style?' : "NFT's positioning?"),
        [userSelectedMobilePlatform]
    );

    return (
        <div className="relative flex w-full flex-col items-center gap-y-4 md:gap-y-6">
            <div className="relative flex w-full flex-col items-center gap-y-3 md:gap-y-4">
                <span className="text-base 2xs:text-xl">{switchLabel}</span>
                {userSelectedMobilePlatform ? (
                    <Switch
                        leftLabel="No"
                        rightLabel="yes"
                        checked={coverStyleChecked}
                        onCheckChange={onCoverStyleCheckChange}
                    />
                ) : (
                    <Switch
                        leftLabel="Center"
                        rightLabel="Right"
                        checked={nftPositionChecked}
                        onCheckChange={onNFTPositionCheckChange}
                    />
                )}
            </div>

            <div
                className={`relative ${!coverStyleChecked ? 'flex' : 'hidden'} w-full flex-col items-center gap-y-3 md:gap-y-4`}
            >
                <span className="text-base 2xs:text-xl">Logos</span>
                <Logos logos={logos} selectedLogo={selectedLogo} onSelect={onLogoSelect} />
            </div>
        </div>
    );
};

export const Confirm = () => {
    const { cacheStrategy, logos } = useStudioContext();
    const {
        previous,
        updateData,
        data: { platform, selectedNFT, atRight, logo, coverStyle }
    } = useWizardContext();

    const onBack = useCallback(
        () =>
            previous({
                platform: undefined,
                option: undefined,
                logo: undefined,
                atRight: false,
                coverStyle: false
            }),
        [previous]
    );
    const onNFTPositionCheck = useCallback(
        (atRight: boolean) => updateData({ atRight }),
        [updateData]
    );
    const onCoverStyleCheck = useCallback(
        (coverStyle: boolean) => updateData({ coverStyle }),
        [updateData]
    );
    const onLogoSelect = useCallback((logo?: string) => updateData({ logo }), [updateData]);

    return (
        <>
            <BackArrow onBack={onBack} />
            <div className="relative grid max-h-[calc(100%-100px+1.5rem)] w-full grid-cols-1 overflow-y-auto 2xs:max-h-[calc(100%-92px+1.5rem)] lg:grid-cols-2">
                <div className="relative flex w-full flex-1 flex-col items-center justify-start gap-y-3 pb-3 lg:justify-center">
                    <NFTDisplay {...selectedNFT} {...cacheStrategy} />
                    <div className="relative flex w-full flex-1 flex-col items-center lg:hidden">
                        <Selectors
                            platform={platform!}
                            nftPositionChecked={atRight}
                            onNFTPositionCheckChange={onNFTPositionCheck}
                            coverStyleChecked={coverStyle}
                            onCoverStyleCheckChange={onCoverStyleCheck}
                            logos={logos}
                            selectedLogo={logo}
                            onLogoSelect={onLogoSelect}
                        />
                    </div>
                </div>
                <div className="hidden w-full flex-1 flex-col items-center justify-center lg:flex">
                    <Selectors
                        platform={platform!}
                        nftPositionChecked={atRight}
                        onNFTPositionCheckChange={onNFTPositionCheck}
                        coverStyleChecked={coverStyle}
                        onCoverStyleCheckChange={onCoverStyleCheck}
                        logos={logos}
                        selectedLogo={logo}
                        onLogoSelect={onLogoSelect}
                    />
                </div>
            </div>
            <Actions />
        </>
    );
};
