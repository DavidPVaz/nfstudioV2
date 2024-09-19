import React from 'react';
import dynamic from 'next/dynamic';
import { CommandDialog } from '@/components/atoms';
import { Chain } from '@/shared/enums';
import { DialogContentSkeleton } from './dialog-content-skeleton';

type SearchDialogProps = {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onSelect: (value: string) => void;
    onChain: (chain: Chain | null) => void;
    data: { value: string; imgSrc: string }[];
    selectedChain: Chain | null;
};

const DialogContent = dynamic(
    () => import('./dialog-content').then(module => module.DialogContent),
    {
        loading: DialogContentSkeleton
    }
);

export const SearchDialog = ({
    open,
    onOpenChange,
    onSelect,
    onChain,
    data,
    selectedChain
}: SearchDialogProps) => (
    <CommandDialog
        className="min-h-[393px]"
        open={open}
        onOpenChange={onOpenChange}
        title={'Search available NFT collections'}
        modal
    >
        {open && (
            <DialogContent
                onSelect={onSelect}
                onChain={onChain}
                data={data}
                selectedChain={selectedChain}
            />
        )}
    </CommandDialog>
);
