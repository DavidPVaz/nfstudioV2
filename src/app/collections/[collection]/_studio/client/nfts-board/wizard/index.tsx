import React from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/molecules/modal';
import type { NFT } from '@/app/collections/[collection]/_studio/client/';

const Wizard = dynamic(
    () =>
        import('@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard').then(
            module => module.Wizard
        ),
    {
        loading: () => <>Loading..</>
    }
);

export const WizardModal = ({
    open,
    onOpenChange,
    selectedNFT
}: {
    open: boolean;
    onOpenChange: () => void;
    selectedNFT: NFT;
}) => (
    <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Studio session"
        description="Studio session"
        className="h-[75%] border-0 2xs:h-[85%] 2xs:max-w-[90%] 2xs:border sm:max-w-[80%]"
    >
        {open && <Wizard selectedNFT={selectedNFT} />}
    </Modal>
);
