'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { default as NextImage, type ImageLoader } from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import loader from './loader';
import { generatePlaceholder } from './placeholder';
import { cn } from '@/lib/utils';

const imageVariants = cva(
    'relative flex items-center justify-center overflow-hidden object-center',
    {
        variants: {
            variant: {
                default: 'object-cover',
                contain: 'object-contain'
            },
            size: {
                default: 'h-full w-full'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export interface ImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement>,
        VariantProps<typeof imageVariants> {
    src: string;
    alt: string;

    priority?: boolean;
    useCustomLoader?: boolean;
    customLoader?: ImageLoader;
    usePlaceholder?: boolean;
    optimizedWidth: number;
    quality?: number;
    maxAge?: number;
    sMaxAge?: number;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
    (
        {
            className,
            src,
            alt,
            onClick,
            variant,
            size,
            priority = false,
            useCustomLoader = true,
            customLoader,
            usePlaceholder = true,
            optimizedWidth,
            quality,
            maxAge,
            sMaxAge
        }: ImageProps,
        ref
    ) => (
        <Slot
            ref={ref}
            className={cn(imageVariants({ variant, size, className }))}
            onClick={onClick}
        >
            <NextImage
                className="pointer-events-none !relative !h-[unset] !w-full"
                tabIndex={-1}
                loader={
                    useCustomLoader
                        ? customLoader
                            ? customLoader
                            : () =>
                                  loader({
                                      src: encodeURI(src),
                                      width: optimizedWidth,
                                      quality,
                                      maxAge,
                                      sMaxAge
                                  })
                        : undefined
                }
                src={src}
                alt={alt}
                unoptimized={!useCustomLoader}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                placeholder={usePlaceholder ? generatePlaceholder() : undefined}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </Slot>
    )
);
