import React from 'react';
import { PageTitle } from '@/components/molecules/page-title';

const STEPS = [
    'You can refresh your selected NFTs at anytime by clicking the refresh button in the toolbar.',
    'You can access your previous downloads at anytime by clicking the folder button in the toolbar.',
    'Select the NFT you wish to convert. Only one NFT can be selected at a time.',
    "Click 'Create'.",
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
    'Once the payment is confirmed, you will be able to download your recently created wallpaper/banner.',
    "The download will start automatically. If it doesn't, click the 'Download' button.",
    'Congratulations! Display it with pride!'
];
// TODO: make the first two out of steps and present as !info
export const HelpContent = () => (
    <div className="relative flex h-full w-full flex-col gap-y-6 overflow-y-auto bg-background pb-6">
        <PageTitle
            title="You can create social media banners, desktop and mobile wallpapers."
            className="pl-6 text-left text-xl leading-none 2xs:text-2xl lg:text-3xl"
        />
        <div className="relative flex flex-col gap-y-4">
            {STEPS.map((step, index) => (
                <div key={index} className="relative flex flex-row gap-x-4 sm:gap-x-8">
                    <div className="relative flex max-h-11 min-w-[52.69px] rounded-br-lg rounded-tr-lg bg-foreground pb-2 pl-6 pr-2 pt-2 sm:max-h-12 sm:min-w-[54.97px]">
                        <span className="flex items-center text-xl font-bold text-background sm:text-2xl">
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
