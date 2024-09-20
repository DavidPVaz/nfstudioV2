import React, { useCallback } from 'react';
import { CircleHelp, RefreshCcw } from 'lucide-react';
import type {
    IncompleteNFT,
    LoadIncompleteNFTs
} from '@/app/collections/[collection]/_studio/client';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/atoms/tooltip';
import { RefreshNFTsModal } from '@/app/collections/[collection]/_studio/client/nfts-board/load-nfts';
import { HelpModal } from '@/app/collections/[collection]/_studio/client/nfts-board/help';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';

export const Toolbar = React.memo(
    ({
        canCreate,
        selectedId,
        onRefresh
    }: {
        canCreate: boolean;
        selectedId?: number;
        onRefresh: LoadIncompleteNFTs;
    }) => {
        const refreshModal = useModal();
        const helpModal = useModal();
        const { notify } = useNotification();

        const onCreate = useCallback(() => {
            if (!selectedId) {
                notify({
                    title: 'No NFT selected!',
                    description: 'Select the NFT before starting the creation.',
                    duration: 3000
                });
                return;
            }

            alert(`open wizard with id ${selectedId}`);
        }, [notify, selectedId]);

        return (
            <>
                <div className="sticky bottom-0 flex h-16 w-full flex-row items-center justify-center gap-x-2 rounded-b-lg border-t xs:gap-x-4 sm:h-20 sm:gap-x-6">
                    <div className="relative flex flex-row gap-x-1 sm:gap-x-2">
                        <Tooltip content="Refresh NFT selection">
                            <Button
                                variant="ghost"
                                size="icon2x"
                                onClick={refreshModal.open}
                                disabled={refreshModal.isOpen}
                            >
                                <RefreshCcw className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                                <span className="sr-only">Refresh NFT selection</span>
                            </Button>
                        </Tooltip>

                        <Tooltip content="Get help">
                            <Button
                                variant="ghost"
                                size="icon2x"
                                onClick={helpModal.open}
                                disabled={helpModal.isOpen}
                            >
                                <CircleHelp className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                                <span className="sr-only">Get help</span>
                            </Button>
                        </Tooltip>
                    </div>

                    <Button disabled={!canCreate} size="lg" onClick={onCreate}>
                        CREATE
                    </Button>
                </div>

                <RefreshNFTsModal
                    open={refreshModal.isOpen}
                    onOpenChange={refreshModal.toggle}
                    onRefresh={(incompleteNFTs: { ids: IncompleteNFT[] }) => {
                        refreshModal.close();
                        onRefresh(incompleteNFTs);
                    }}
                />

                <HelpModal open={helpModal.isOpen} onOpenChange={helpModal.toggle} />
            </>
        );
    },
    (previousProps, nextProps) =>
        previousProps.canCreate === nextProps.canCreate &&
        previousProps.selectedId === nextProps.selectedId &&
        previousProps.onRefresh === nextProps.onRefresh
);
