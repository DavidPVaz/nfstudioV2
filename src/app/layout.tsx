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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen min-w-[290px] bg-background font-sans antialiased',
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
