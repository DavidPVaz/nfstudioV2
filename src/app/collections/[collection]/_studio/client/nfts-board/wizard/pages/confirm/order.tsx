import React, { useCallback } from 'react';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';
import { useNetworkState } from '@/hooks/use-network-state';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';

const content = 'Order';

export const Order = React.memo(() => {
    const { isOpen, open, toggle } = useModal();
    const { notify } = useNotification();
    const { isOnline } = useNetworkState();

    const onOrder = useCallback(() => {
        if (!isOnline) {
            notify({
                title: 'You are offline.',
                description: 'Please retry ordering when you come back online.',
                variant: 'offline'
            });
            return;
        }

        open();
    }, [open, isOnline, notify]);

    return (
        <>
            <Button onClick={onOrder} className="h-10 px-5 2xs:h-11 2xs:px-8">
                ORDER
            </Button>

            <Modal
                extraContainer
                dialog
                open={isOpen}
                onOpenChange={toggle}
                title={content}
                description={content}
                className="max-w-[95vw]'cursor-auto py-16` min-w-[95vw] rounded-none border-0 bg-transparent px-6"
            >
                CONTENT
            </Modal>
        </>
    );
});
