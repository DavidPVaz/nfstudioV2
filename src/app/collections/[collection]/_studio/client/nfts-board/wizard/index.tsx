import React from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/molecules/modal';

const WizardContent = dynamic(
    () =>
        import(
            '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard-content'
        ).then(module => module.WizardContent),
    {
        loading: () => <>Loading..</>
    }
);

export const WizardModal = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: () => void;
}) => (
    <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Studio session"
        description="Studio session"
        className="h-[90%] border-0 2xs:h-[85%] 2xs:max-w-[90%] 2xs:border sm:max-w-[80%]"
    >
        {open && <WizardContent />}
    </Modal>
);
