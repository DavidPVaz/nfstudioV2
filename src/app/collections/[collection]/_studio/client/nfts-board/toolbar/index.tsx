import React, { useCallback } from 'react';
import type { NFT, LoadIncompleteNFTs } from '@/app/collections/[collection]/_studio/client';
import { RefreshNFTs } from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts';
import { Help } from '@/app/collections/[collection]/_studio/client/nfts-board/help';
import { Wizard } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard';
import { useNotification } from '@/hooks/use-notification';

export const Toolbar = React.memo(
    ({
        disabled,
        selectedNFT,
        onRefresh
    }: {
        disabled: boolean;
        selectedNFT?: NFT;
        onRefresh: LoadIncompleteNFTs;
    }) => {
        const { notify } = useNotification();

        const canCreate = useCallback(() => {
            if (!selectedNFT) {
                notify({
                    title: 'No NFT selected!',
                    description: 'Select the NFT before starting the creation.',
                    duration: 3000
                });

                return false;
            }

            return true;
        }, [notify, selectedNFT]);

        return (
            <>
                <div className="sticky bottom-0 flex h-16 w-full flex-row items-center justify-center gap-x-2 rounded-b-lg border-t xs:gap-x-4 sm:h-20 sm:gap-x-6">
                    <div className="relative flex flex-row gap-x-1 sm:gap-x-2">
                        <RefreshNFTs onRefresh={onRefresh} />
                        <Help />
                    </div>

                    <Wizard disabled={disabled} canCreate={canCreate} selectedNFT={selectedNFT} />
                </div>
            </>
        );
    },
    (previousProps, nextProps) =>
        previousProps.disabled === nextProps.disabled &&
        previousProps.selectedNFT === nextProps.selectedNFT &&
        previousProps.onRefresh === nextProps.onRefresh
);
