import type { Metadata } from 'next';
import React from 'react';
import { PageTitle } from '@/components/molecules/page-title';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from '@/components/atoms/accordion';

export const metadata: Metadata = {
    title: 'FAQ | NFStudio'
};

const FAQS = [
    {
        question: 'What is NFStudio?',
        answer: 'NFStudio is a user-friendly service designed to simplify the creation of wallpapers and banners using your favorite NFTs PNG image. With our tool, you can effortlessly transform your NFTs into stunning graphics for social media, desktop and mobile wallpapers in just a few clicks.'
    },
    {
        question:
            'I am the creator of a NFT collection and I am interested in partnering up with NFStudio. How can I reach you?',
        answer: 'We believe such partnership could offer your collection an exciting opportunity to increase visibility, generate additional revenue and provide enhanced utility to your community members. Please reach out to us at partners@nfstudio.xyz to discuss this opportunity further.'
    },
    {
        question: 'Can you have collections from other chains, or just Solana?',
        answer: 'NFStudio can have collections from multiple chains, not just Solana.'
    },
    {
        question: 'Do I need to pay to use this service? How much?',
        answer: 'Yes, NFStudio is a paid service. The fee for creating your wallpaper or banner is a fixed $4 per creation, paid in any of the supported cryptocurrencies on Solana network.'
    },
    {
        question: 'Why do NFStudio only support payments on Solana network?',
        answer: "With Solana's high throughput and low transaction costs we can provide a seamless and efficient user experience."
    },
    {
        question: 'How is this payment processed?',
        answer: (
            <>
                NFStudio has integrated one of the payment solutions of the renowned and established
                Web3 payments platform,{' '}
                <a
                    href={'https://www.hel.io/'}
                    rel="noopener noreferrer"
                    target={'_blank'}
                    className="underline"
                >
                    Helio
                </a>
                . This way you can be safe and have trust while you pay for your product.
            </>
        )
    },
    {
        question:
            'I have payed for my wallpaper/banner but there was an error saying the creation has failed. What now?',
        answer: "Do not worry, you will be automatically refunded. This service runs on an application layer over the internet protocol, and although it has a very small chance, the creation of your wallpaper/banner might fail. If that happens, you don't need to ask for it. Our system knows when it happened and your refund will be processed."
    },
    {
        question: 'When can I expect to be refunded?',
        answer: 'If any, NFStudio usually process all refunds once a day at approximately 06:00 AM UTC. This can change over time.'
    },
    {
        question: 'If I am being refunded, will I get 100% of the value I paid for?',
        answer: (
            <>
                Yes, you will be refunded with 100% of the cryptocurrency value you paid for the
                wallpaper/banner at the time of your purchase transaction, in whatever currency
                used. Except for the gas fees of course, that is on you.
                <br /> e.g. If you paid $0.0186 SOL + gas fees for the wallpaper/banner, you will be
                refunded with $0.0186 SOL.
            </>
        )
    },
    {
        question:
            "I have downloaded the wallpaper/banner after I paid for it. I don't like it. Can I ask for a refund?",
        answer: "Sorry that you feel that way. Unfortunately, you are not eligible for a refund. You are eligible for a refund only if you paid for your wallpaper/banner and didn't get it because of an error on NFStudio's side, and NFStudio's side only. Please use our preview feature to check how your wallpaper/banner would look like before you pay for it. Nevertheless, any feedback is highly appreciated."
    },
    {
        question:
            "I am trying to load a NFT that I know it exists, but it still says it can't be found. Why?",
        answer: 'Some images in the available collections might have certain traits that are not yet supported. These traits would not allow a clean image generation.'
    },
    {
        question: 'Can I pay and create a wallpaper on mobile?',
        answer: "Yes you can. If you are on a mobile, a new payment page will open for you within your preferred Web3 wallet software. Once completed, switch back to the NFStudio's browser tab and you will be able to download your image."
    }
];

const FaqPage = () => (
    <div className="relative flex w-full flex-col items-center justify-start gap-y-4 duration-300 animate-in fade-in-0 md:gap-y-8">
        <section className="relative flex w-full flex-col">
            <PageTitle title="FREQUENTLY ASKED QUESTIONS" />
        </section>

        <section className="relative flex w-full flex-col">
            <Accordion type="single" collapsible className="flex w-full flex-col gap-y-3">
                {FAQS.map(({ question, answer }) => (
                    <AccordionItem key={question} value={question}>
                        <AccordionTrigger>{question}</AccordionTrigger>
                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    </div>
);

export default FaqPage;
