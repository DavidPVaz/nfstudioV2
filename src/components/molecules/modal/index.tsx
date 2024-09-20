import React, { useMemo } from 'react';
import { Hide } from '@/components/atoms/visually-hidden';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/atoms/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

type ModalProps = {
    className: string;
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string;
    children: React.ReactNode;
};

const ManagedDialog = ({
    className,
    open,
    onOpenChange,
    title,
    description,
    children
}: ModalProps) => (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent className={className}>
            <Hide>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </Hide>
            {open && children}
        </DialogContent>
    </Dialog>
);

const ManagedDrawer = ({
    className,
    open,
    onOpenChange,
    title,
    description,
    children
}: ModalProps) => (
    <Drawer open={open} onOpenChange={onOpenChange} modal>
        <DrawerContent className={className}>
            <Hide>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
            </Hide>
            {open && children}
        </DrawerContent>
    </Drawer>
);

export const Modal = ({
    className,
    open,
    onOpenChange,
    title,
    description,
    children
}: ModalProps) => {
    const is2xs = useMediaQuery('(min-width: 475px)');
    const Modal = useMemo(() => (is2xs ? ManagedDialog : ManagedDrawer), [is2xs]);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            className={className}
        >
            {children}
        </Modal>
    );
};
