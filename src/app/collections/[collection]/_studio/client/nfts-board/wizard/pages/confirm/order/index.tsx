import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useModal } from '@/hooks/use-modal';
import { useNotification } from '@/hooks/use-notification';
import { useNetworkState } from '@/hooks/use-network-state';
import { Modal } from '@/components/molecules/modal';
import { Button } from '@/components/atoms/button';
import { NFStudioSkeleton } from '@/components/molecules/nfstudio-skeleton';

const OrderContent = dynamic(
    () =>
        import(
            '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages/confirm/order/order-content'
        ).then(module => module.OrderContent),
    {
        loading: NFStudioSkeleton
    }
);

const content = 'Order';

export const Order = React.memo(() => {
    const { isOpen, open, toggle, close } = useModal();
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
                className="min-h-[476px] min-w-[380px] max-w-[400px] cursor-auto rounded-none border-0 bg-transparent px-0 py-16"
            >
                <OrderContent close={close} />
            </Modal>
        </>
    );
});
