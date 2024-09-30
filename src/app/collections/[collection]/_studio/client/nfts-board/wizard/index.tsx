import React, { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';
import { useModal } from '@/hooks/use-modal';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client';
import { useNotification } from '@/hooks/use-notification';
import { NFStudioSkeleton } from '@/components/molecules/nfstudio-skeleton';
import type { NFT } from '@/app/collections/[collection]/_studio/client/';

const WizardContent = dynamic(
    () =>
        import('@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard').then(
            module => module.WizardContent
        ),
    {
        loading: NFStudioSkeleton
    }
);

export const Wizard = React.memo(
    ({ disabled }: { disabled: boolean }) => {
        const { nfts } = useStudioContext();
        const { notify } = useNotification();
        const { isOpen, open, toggle } = useModal();

        const selectedNFT = useMemo(() => (nfts as NFT[]).find(({ selected }) => selected), [nfts]);

        const onStart = useCallback(() => {
            if (!selectedNFT) {
                notify({
                    title: 'No NFT selected!',
                    description: 'Select the NFT before starting the creation.',
                    duration: 3000
                });
                return;
            }

            open();
        }, [open, selectedNFT, notify]);

        return (
            <>
                <Button disabled={disabled} size="lg" onClick={onStart}>
                    START
                </Button>
                <Modal
                    open={isOpen}
                    onOpenChange={toggle}
                    title="Studio session"
                    description="Studio session"
                    className="h-[90%] border-0 2xs:h-[85%] 2xs:max-w-[90%] 2xs:border sm:max-w-[80%]"
                >
                    <WizardContent selectedNFT={selectedNFT!} />
                </Modal>
            </>
        );
    },
    (previousProps, nextProps) => previousProps.disabled === nextProps.disabled
);
