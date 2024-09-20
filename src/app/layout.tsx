import type { Metadata } from 'next';
import { Chakra_Petch as FontSans } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cn } from '@/lib/utils';
import { ColorThemeProvider } from '@/app/color-theme-provider';
import { ReactQueryClientProvider } from '@/app/query-client-provider';
import { NotificationProvider } from '@/app/notification-provider';
import { Footer } from '@/components/organisms/footer';
import { Header } from '@/components/organisms/header';
import { ScrollUp } from '@/components/molecules/scroll-up';
import '@/styles/globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-sans',
    display: 'swap',
    preload: true
});

const title = 'NFStudio | Effortlessly Showcase NFTs';
const description =
    'Effortlessly create stunning social media banners, desktop and mobile wallpapers from your favorite NFTs in seconds!';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.APP_URL!),
    title,
    description,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
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
            </body>
        </html>
    );
}
