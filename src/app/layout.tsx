import type { Metadata } from 'next';
import { Chakra_Petch as FontSans } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cn } from '@/lib/utils';
import { ColorThemeProvider } from '@/app/color-theme-provider';
import { ReactQueryClientProvider } from '@/app/query-client-provider';
import { NotificationProvider } from '@/app/notification-provider';
import { NetworkStatus } from '@/app/network-status';
import { Footer } from '@/components/organisms/footer';
import { Header } from '@/components/organisms/header';
import { ScrollUp } from '@/components/molecules/scroll-up';
import '@/styles/globals.css';

// TODO: sidebar
// TODO: PWA
// TODO: CI/CD
// TODO: MOBILE USE CASES - can't download inside wallet's application browser
// TODO: e2e
// TODO: Containerize

const fontSans = FontSans({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-sans',
    display: 'swap',
    preload: true
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.ORIGIN!),
    title: 'NFStudio | Effortlessly Showcase NFTs',
    description:
        'Effortlessly create stunning social media banners, desktop and mobile wallpapers from your favorite NFTs in seconds!',
    keywords: [
        'NFT',
        'NFT wallpaper',
        'NFT banner',
        'NFTs',
        'NFTs wallpapers',
        'NFTs banners',
        'blockchain'
    ],
    robots: {
        noarchive: true,
        'max-snippet': -1,
        index: process.env.VERCEL_ENV === 'production',
        follow: process.env.VERCEL_ENV === 'production'
    }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
                'min-h-screen min-w-[290px] bg-background font-sans antialiased',
                fontSans.variable
            )}
        >
            <ColorThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                <ReactQueryClientProvider>
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1 pb-10 sm:pb-20">
                            <div className="container relative">{children}</div>
                        </main>
                        <Footer />
                    </div>
                    <ScrollUp />
                    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
                </ReactQueryClientProvider>
            </ColorThemeProvider>
            <NotificationProvider />
            <NetworkStatus />
            <div id="extra" />
        </body>
    </html>
);

export default RootLayout;
