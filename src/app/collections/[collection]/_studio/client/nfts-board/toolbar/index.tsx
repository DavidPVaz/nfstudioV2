import React, { useCallback } from 'react';
import type { NFT, LoadIncompleteNFTs } from '@/app/collections/[collection]/_studio/client';
import { Button } from '@/components/atoms/button';
import { RefreshNFTs } from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts';
import { Help } from '@/app/collections/[collection]/_studio/client/nfts-board/help';
import { WizardModal } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';

export const Toolbar = React.memo(
    ({
        canCreate,
        selectedNFT,
        onRefresh
    }: {
        canCreate: boolean;
        selectedNFT?: NFT;
        onRefresh: LoadIncompleteNFTs;
    }) => {
        const wizardModal = useModal();
        const { notify } = useNotification();

        const onCreate = useCallback(() => {
            if (!selectedNFT) {
                notify({
                    title: 'No NFT selected!',
                    description: 'Select the NFT before starting the creation.',
                    duration: 3000
                });
                return;
            }

            wizardModal.open();
        }, [notify, selectedNFT, wizardModal]);

        return (
            <>
                <div className="sticky bottom-0 flex h-16 w-full flex-row items-center justify-center gap-x-2 rounded-b-lg border-t xs:gap-x-4 sm:h-20 sm:gap-x-6">
                    <div className="relative flex flex-row gap-x-1 sm:gap-x-2">
                        <RefreshNFTs onRefresh={onRefresh} />
                        <Help />
                    </div>

                    <Button disabled={!canCreate} size="lg" onClick={onCreate}>
                        CREATE
                    </Button>
                </div>

                {selectedNFT && (
                    <WizardModal
                        open={wizardModal.isOpen}
                        onOpenChange={wizardModal.toggle}
                        selectedNFT={selectedNFT}
                    />
                )}
            </>
        );
    },
    (previousProps, nextProps) =>
        previousProps.canCreate === nextProps.canCreate &&
        previousProps.selectedNFT === nextProps.selectedNFT &&
        previousProps.onRefresh === nextProps.onRefresh
);
