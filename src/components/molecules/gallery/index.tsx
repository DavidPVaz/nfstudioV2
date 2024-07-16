import React from 'react';
import { Image } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface GalleryProps {
    className: string;
}

export const Gallery = ({ className }: GalleryProps) => {
    return (
        <div className={cn('flex flex-wrap', className)}>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
            </div>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
            </div>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
            </div>
            <div className="flex w-1/2 flex-wrap">
                <div className="w-full p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                    <Image
                        optimizedWidth={500}
                        alt="gallery"
                        className="rounded-md"
                        src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                        useCustomLoader={false}
                        variant={'fill_cover'}
                    />
                </div>
            </div>
        </div>
    );
};
