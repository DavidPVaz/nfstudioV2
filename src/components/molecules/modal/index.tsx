import React from 'react';
import { Hide } from '@/components/atoms/visually-hidden';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/atoms/drawer';

type ModalProps = {
    className: string;
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string;
    children: React.ReactNode;
};

export const ManagedDialog = ({
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

export const ManagedDrawer = ({
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
