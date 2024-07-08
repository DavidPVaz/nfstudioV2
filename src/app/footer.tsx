import React from 'react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="h-footer md:h-footerMd absolute bottom-0 left-0 flex w-full items-end justify-center bg-white">
            <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                By{' '}
                <Image
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    className="dark:invert"
                    width={100}
                    height={24}
                    priority
                />
            </a>
        </footer>
    );
}
