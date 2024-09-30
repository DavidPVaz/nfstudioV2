import React, { useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/atoms/tooltip';
import { Modal } from '@/components/molecules/modal';
import type { NotificationProps } from '@/components/atoms/notification';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';
import { useNetworkState } from '@/hooks/use-network-state';
import { LoadForm } from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts/load-form';
import {
    type IncompleteNFT,
    useStudioContext
} from '@/app/collections/[collection]/_studio/client';

const Content = () => (
    <>
        <CardTitle className="text-lg text-foreground sm:text-xl">
            Please <strong>provide</strong> <strong>the</strong> <strong>IDs</strong> of the{' '}
            <strong>NFTs</strong> you wish to convert.
        </CardTitle>
        <CardDescription className="text-base text-foreground sm:text-lg">
            You can load up to <strong>20</strong> <strong>NFTs</strong>, but you will{' '}
            <strong>only</strong> <strong>be</strong> <strong>able</strong> to work on them{' '}
            <strong>individually</strong>. Please add the <strong>IDs</strong>{' '}
            <strong>separated</strong> <strong>by</strong> <strong>comma</strong>.
        </CardDescription>
        <CardDescription className="text-base text-foreground sm:text-lg">
            When you are done, <strong>click</strong> <strong>Load</strong>.
        </CardDescription>
    </>
);

const notification = {
    title: 'You are offline.',
    description: 'Please retry loading the NFTs when you come back online.',
    variant: 'offline' as NotificationProps['variant']
};

export const LoadNFTs = () => {
    const { onIncompleteNFTsLoad } = useStudioContext();
    const { notify } = useNotification();
    const { isOnline } = useNetworkState();

    const onSubmit = useCallback(
        (incompleteNFTs: { ids: IncompleteNFT[] }) => {
            if (!isOnline) {
                notify(notification);
                return;
            }

            onIncompleteNFTsLoad(incompleteNFTs);
        },
        [onIncompleteNFTsLoad, isOnline, notify]
    );

    return (
        <div className="container flex w-full items-center justify-center overflow-y-auto">
            <Card className="relative h-full w-full max-w-lg border-0 bg-background 2xs:h-auto 2xs:border">
                <CardHeader className="gap-y-2 pb-2 pl-0 pr-0 pt-6 2xs:p-6 2xs:pb-3 sm:gap-y-3">
                    <Content />
                </CardHeader>
                <div className="pb-6 pl-0 pr-0 pt-2 2xs:p-6 2xs:pt-3">
                    <LoadForm onSubmit={onSubmit} />
                </div>
            </Card>
        </div>
    );
};

const tooltipContent = 'Refresh NFT selection';

export const RefreshNFTs = React.memo(() => {
    const { onIncompleteNFTsLoad } = useStudioContext();
    const { isOpen, open, toggle, close } = useModal();

    const { notify } = useNotification();
    const { isOnline } = useNetworkState();

    const onSubmit = useCallback(
        (incompleteNFTs: { ids: IncompleteNFT[] }) => {
            if (!isOnline) {
                notify(notification);
                return;
            }

            close();
            onIncompleteNFTsLoad(incompleteNFTs);
        },
        [onIncompleteNFTsLoad, isOnline, notify, close]
    );

    return (
        <>
            <Tooltip content={tooltipContent}>
                <Button variant="ghost" size="icon2x" onClick={open} disabled={isOpen}>
                    <RefreshCcw className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                    <span className="sr-only">{tooltipContent}</span>
                </Button>
            </Tooltip>
            <Modal
                open={isOpen}
                onOpenChange={toggle}
                title={tooltipContent}
                description={tooltipContent}
                className="max-w-lg border-0 2xs:min-h-[526px] 2xs:border"
            >
                <Card className="relative h-full w-full border-0 bg-background">
                    <CardHeader className="gap-y-2 pb-2 pl-6 pr-6 pt-6 sm:gap-y-3">
                        <Content />
                    </CardHeader>
                    <div className="pb-6 pl-6 pr-6 pt-2 2xs:pt-3">
                        <LoadForm onSubmit={onSubmit} />
                    </div>
                </Card>
            </Modal>
        </>
    );
});
