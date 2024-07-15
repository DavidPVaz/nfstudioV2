import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardFooter, Image } from '@/components/atoms';

interface CardProps {
    imgSrc: string;
    href: string;
}

export const NFTCard = ({ imgSrc, href }: CardProps) => {
    return (
        <Card
            className="h-auto w-fit min-w-[100px] transition-all will-change-transform hover:-translate-y-1 hover:border-2"
            asChild
        >
            <Link href={href}>
                <CardContent className="flex flex-col gap-y-2 p-2 sm:p-4">
                    <Image
                        className="rounded-md"
                        src={imgSrc}
                        alt={'image'}
                        optimizedWidth={300}
                        useCustomLoader={false}
                    />
                    <CardTitle className="text-center">NAME</CardTitle>
                    <CardFooter className="flex justify-between"></CardFooter>
                </CardContent>
            </Link>
        </Card>
    );
};
