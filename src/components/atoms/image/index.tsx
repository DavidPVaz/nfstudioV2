'use client';

import React from 'react';
import { default as NextImage, type ImageLoader } from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { getLoader } from '@/components/atoms/image/loader';
import { generatePlaceholder } from '@/components/atoms/image/placeholder';
import { cn } from '@/lib/utils';

const imageVariants = cva('pointer-events-none object-center', {
    variants: {
        variant: {
            default: 'object-cover',
            contain: 'object-contain',
            fill_contain_h: 'object-contain !relative !h-full !w-[unset]',
            fill_contain_w: 'object-contain !relative !w-full !h-[unset]',
            fill_contain: 'object-contain !relative'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> &
    VariantProps<typeof imageVariants> & {
        src: string;
        alt: string;
        width?: number | `${number}` | undefined;
        height?: number | `${number}` | undefined;

        priority?: boolean;
        useCustomLoader?: boolean;
        customUsageLoader?: ImageLoader;
        usePlaceholder?: boolean;
        optimizedWidth?: number;
        quality?: number;
        maxAge?: number | null;
        sMaxAge?: number | null;
    };

export const Image = ({
    className,
    src,
    alt,
    onClick,
    variant,
    priority = false,
    useCustomLoader = true,
    customUsageLoader,
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
            'relative flex max-h-full max-w-full justify-center overflow-hidden',
            className
        )}
        onClick={onClick}
    >
        <NextImage
            className={cn(imageVariants({ variant }))}
            loader={
                useCustomLoader
                    ? customUsageLoader ??
                      getLoader({
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
