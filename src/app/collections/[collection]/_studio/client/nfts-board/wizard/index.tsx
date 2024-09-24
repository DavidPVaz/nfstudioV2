import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';
import { useModal } from '@/hooks/use-modal';
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

export const Wizard = ({
    disabled,
    canCreate,
    selectedNFT
}: {
    disabled: boolean;
    canCreate: () => boolean;
    selectedNFT?: NFT;
}) => {
    const { isOpen, open, toggle } = useModal();
    const onCreate = useCallback(() => {
        if (!canCreate()) {
            return;
        }
        open();
    }, [canCreate, open]);

    return (
        <>
            <Button disabled={disabled} size="lg" onClick={onCreate}>
                CREATE
            </Button>
            <Modal
                open={isOpen}
                onOpenChange={toggle}
                title="Studio session"
                description="Studio session"
                className="h-[90%] border-0 2xs:h-[85%] 2xs:max-w-[90%] 2xs:border sm:max-w-[80%]"
            >
                {isOpen && selectedNFT && <WizardContent selectedNFT={selectedNFT} />}
            </Modal>
        </>
    );
};
