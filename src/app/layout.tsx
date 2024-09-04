import type { Metadata } from 'next';
import { Chakra_Petch as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ColorThemeProvider } from '@/app/color-theme-provider';
import { Header, Footer } from '@/components/organisms';
import { ScrollUp } from '@/components/molecules';
import '@/styles/globals.css';

const fontSans = FontSans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-sans' });

const title = 'NFStudio | Effortlessly Showcase NFTs';
const description =
    'Effortlessly create stunning social media banners, desktop and mobile wallpapers from your favorite NFTs in seconds!';

export const metadata: Metadata = {
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
        index: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
        follow: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: 'https://bafkreif5ejpwwz4q3tihtasm7woa6v6zad7ym5lw4t5oda232tprcawk3i.ipfs.nftstorage.link/'
    }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                <ColorThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1 pb-10 sm:pb-20">
                            <div className="container relative">{children}</div>
                        </main>
                        <Footer />
                    </div>
                    <ScrollUp />
                </ColorThemeProvider>
            </body>
        </html>
    );
}
