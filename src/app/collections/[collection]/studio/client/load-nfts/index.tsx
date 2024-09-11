'use client';

import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { LoadForm } from '@/app/collections/[collection]/studio/client/load-nfts/load-form';
import type { LoadIncompleteNFTs } from '@/app/collections/[collection]/studio/client';

export const LoadNfts = ({ onSubmit }: { onSubmit: LoadIncompleteNFTs }) => (
    <div className="container flex w-full items-center justify-center overflow-y-auto">
        <Card className="relative h-full w-full max-w-sm border-0 bg-background 2xs:h-auto 2xs:border">
            <CardHeader className="gap-y-2 pb-2 pl-0 pr-0 pt-6 2xs:p-6 2xs:pb-3 sm:gap-y-3">
                <CardTitle className="text-lg text-foreground sm:text-xl">
                    Please <strong>provide</strong> <strong>the</strong> <strong>IDs</strong> of the{' '}
                    <strong>NFTs</strong> you wish to convert.
                </CardTitle>
                <CardDescription className="text-sm text-foreground sm:text-lg">
                    You can load up to <strong>20</strong> <strong>NFTs</strong>, but you will{' '}
                    <strong>only</strong> <strong>be</strong> <strong>able</strong> to work on them{' '}
                    <strong>individually</strong>. Please add the <strong>IDs</strong>{' '}
                    <strong>separated</strong> <strong>by</strong> <strong>comma</strong>.
                </CardDescription>
                <CardDescription className="text-sm text-foreground sm:text-lg">
                    When you are done, <strong>click</strong> <strong>Load</strong>.
                </CardDescription>
            </CardHeader>
            <div className="pb-6 pl-0 pr-0 pt-2 2xs:p-6 2xs:pt-3">
                <LoadForm onSubmit={onSubmit} />
            </div>
        </Card>
    </div>
);
