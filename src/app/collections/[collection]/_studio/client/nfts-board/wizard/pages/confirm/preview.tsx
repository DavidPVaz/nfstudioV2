import React from 'react';
import { useModal } from '@/hooks/use-modal';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';

const content = 'Preview';

export const Preview = React.memo(() => {
    const { isOpen, open, toggle } = useModal();

    return (
        <>
            <Button onClick={open} className="h-10 px-5 2xs:h-11 2xs:px-8">
                PREVIEW
            </Button>

            <Modal
                extraContainer
                dialog
                open={isOpen}
                onOpenChange={toggle}
                title={content}
                description={content}
                className="cursor-auto rounded-none border-0 bg-transparent"
            >
                PREVIEW
            </Modal>
        </>
    );
});
