import React, { useMemo } from 'react';
import { Hide } from '@/components/atoms/visually-hidden';
import {
    Dialog,
    DialogContent,
    DialogContentExtra,
    DialogTitle,
    DialogDescription
} from '@/components/atoms/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/atoms/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

type ModalProps = {
    className: string;
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string;
    extraContainer?: boolean;
    dialog?: boolean;
    drawer?: boolean;
    children: React.ReactNode;
};

const ManagedDialog = ({
    className,
    open,
    onOpenChange,
    title,
    description,
    extraContainer,
    children
}: ModalProps) => (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
        {extraContainer ? (
            <DialogContentExtra className={className}>
                <Hide>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </Hide>
                {open && children}
            </DialogContentExtra>
        ) : (
            <DialogContent className={className}>
                <Hide>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </Hide>
                {open && children}
            </DialogContent>
        )}
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
    extraContainer,
    dialog,
    drawer,
    children
}: ModalProps) => {
    const is2xs = useMediaQuery('(min-width: 475px)');
    const Modal = useMemo(
        () =>
            dialog ? ManagedDialog : drawer ? ManagedDrawer : is2xs ? ManagedDialog : ManagedDrawer,
        [is2xs, dialog, drawer]
    );

    return (
        <Modal
            extraContainer={extraContainer}
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
