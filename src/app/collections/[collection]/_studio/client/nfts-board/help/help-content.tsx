import React from 'react';
import { Info, RefreshCcw, FolderDown } from 'lucide-react';
import { PageTitle } from '@/components/molecules/page-title';

const STEPS = [
    'Select the NFT you want to create from. Only one can be selected at a time.',
    "Click 'Start'.",
    'Select your desired platform.',
    'Select your desired option.',
    "Optionally select your preferred logo and the NFT's position in the image to be created (if available).",
    "Review your choices and click 'Order' to proceed to payment.",
    <>
        Complete your payment through our{' '}
        <a href={'https://www.hel.io/'} rel="noopener noreferrer" target={'_blank'}>
            Helio
        </a>{' '}
        integration on Solana network.
    </>,
    'Once your payment is confirmed, your wallpaper or banner will be created.',
    "You will be able to download it as soon as it is ready by clicking the 'Download' button.",
    'Congratulations! Display it with pride!'
];

export const HelpContent = () => (
    <div className="relative flex h-full w-full flex-col gap-y-6 overflow-y-auto bg-background pb-6">
        <PageTitle
            title="You can create social media banners, desktop and mobile wallpapers."
            className="pl-6 text-left text-xl leading-none 2xs:pl-0 2xs:text-2xl lg:text-3xl"
        />
        <div className="relative flex flex-col gap-y-1 pb-5">
            <div className="flex flex-row items-center gap-2 bg-accent/70 p-2">
                <Info className="h-10 w-10 2xs:h-7 2xs:w-7 lg:h-5 lg:w-5" />
                <div className="relative">
                    You can refresh your selected NFTs at anytime by clicking the refresh button in
                    the toolbar. <RefreshCcw className="inline-block h-4 w-4" />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 bg-accent/70 p-2">
                <Info className="h-10 w-10 2xs:h-7 2xs:w-7 lg:h-5 lg:w-5" />
                <div className="relative">
                    You can access your previous downloads at anytime by clicking the folder button
                    in the toolbar. <FolderDown className="inline-block h-4 w-4" />
                </div>
            </div>
        </div>
        <div className="relative flex flex-col gap-y-4">
            {STEPS.map((step, index) => (
                <div key={index} className="relative flex flex-row items-center gap-x-3 sm:gap-x-6">
                    <div className="relative flex max-h-11 min-w-[52.69px] justify-center rounded-sm bg-primary-brand p-2 sm:max-h-12 sm:min-w-[54.97px]">
                        <span className="flex items-center text-xl font-bold text-primary-brand-white sm:text-2xl">
                            {index + 1}
                        </span>
                    </div>
                    <p className="inline-block text-pretty text-left text-lg sm:text-2xl [&_a]:underline">
                        {step}
                    </p>
                </div>
            ))}
        </div>
    </div>
);
