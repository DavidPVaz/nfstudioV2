'use client';

import React, { useMemo } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { ManagedDialog, ManagedDrawer } from '@/components/molecules/modal';
import { LoadForm } from '@/app/collections/[collection]/studio/client/load-nfts/load-form';
import { type LoadIncompleteNFTs } from '@/app/collections/[collection]/studio/client';
import { useMediaQuery } from '@/hooks/use-media-query';

export const LoadNFTs = ({ onIncompleteLoad }: { onIncompleteLoad: LoadIncompleteNFTs }) => (
    <div className="container flex w-full items-center justify-center overflow-y-auto">
        <Card className="relative h-full w-full max-w-lg border-0 bg-background 2xs:h-auto 2xs:border">
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
                <LoadForm onSubmit={onIncompleteLoad} />
            </div>
        </Card>
    </div>
);

export const RefreshNFTsModal = ({
    open,
    onOpenChange,
    onRefresh
}: {
    open: boolean;
    onOpenChange: () => void;
    onRefresh: LoadIncompleteNFTs;
}) => {
    const isDesktop = useMediaQuery('(min-width: 475px)');
    const Modal = useMemo(() => (isDesktop ? ManagedDialog : ManagedDrawer), [isDesktop]);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Refresh NFT selection"
            description="Refresh NFT selection"
            className="max-w-lg border-0 2xs:border"
        >
            <Card className="relative h-full w-full border-0 bg-background">
                <CardHeader className="gap-y-2 pb-2 pl-6 pr-6 pt-6 sm:gap-y-3">
                    <CardTitle className="text-lg text-foreground sm:text-xl">
                        Please <strong>provide</strong> <strong>the</strong> <strong>IDs</strong> of
                        the <strong>NFTs</strong> you wish to convert.
                    </CardTitle>
                    <CardDescription className="text-base text-foreground sm:text-lg">
                        You can load up to <strong>20</strong> <strong>NFTs</strong>, but you will{' '}
                        <strong>only</strong> <strong>be</strong> <strong>able</strong> to work on
                        them <strong>individually</strong>. Please add the <strong>IDs</strong>{' '}
                        <strong>separated</strong> <strong>by</strong> <strong>comma</strong>.
                    </CardDescription>
                    <CardDescription className="text-base text-foreground sm:text-lg">
                        When you are done, <strong>click</strong> <strong>Load</strong>.
                    </CardDescription>
                </CardHeader>
                <div className="pb-6 pl-6 pr-6 pt-2 2xs:pt-3">
                    <LoadForm onSubmit={onRefresh} />
                </div>
            </Card>
        </Modal>
    );
};
