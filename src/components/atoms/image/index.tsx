'use client';

import React from 'react';
import { default as NextImage, type ImageLoader } from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import loader from './loader';
import { generatePlaceholder } from './placeholder';
import { cn } from '@/lib/utils';

const imageVariants = cva('pointer-events-none object-center', {
    variants: {
        variant: {
            default: 'object-contain',
            cover: 'object-cover',
            fill_cover: 'object-cover !relative !h-[unset] !w-full',
            fill_contain: 'object-contain !relative !h-[unset] !w-full'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

export interface ImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement>,
        VariantProps<typeof imageVariants> {
    src: string;
    alt: string;
    width?: number | `${number}` | undefined;
    height?: number | `${number}` | undefined;

    priority?: boolean;
    useCustomLoader?: boolean;
    customLoader?: ImageLoader;
    usePlaceholder?: boolean;
    optimizedWidth: number;
    quality?: number;
    maxAge?: number;
    sMaxAge?: number;
}

export const Image = ({
    className,
    src,
    alt,
    onClick,
    variant,
    priority = false,
    useCustomLoader = true,
    customLoader,
    usePlaceholder = true,
    optimizedWidth,
    quality,
    maxAge,
    sMaxAge,
    width,
    height
}: ImageProps) => (
    <div
        className={cn(
            'relative flex w-full items-center justify-center overflow-hidden',
            className
        )}
        onClick={onClick}
    >
        <NextImage
            className={cn(imageVariants({ variant }))}
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
            width={width}
            height={height}
            src={src}
            alt={alt}
            unoptimized={!useCustomLoader}
            priority={priority}
            fill={!(width && height)}
            loading={priority ? 'eager' : 'lazy'}
            placeholder={usePlaceholder ? generatePlaceholder() : undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
    </div>
);
