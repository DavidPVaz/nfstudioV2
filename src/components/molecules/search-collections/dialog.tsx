import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommandDialog, CommandDrawer } from '@/components/atoms/command';
import { Chain } from '@/shared/enums';
import { DialogContentSkeleton } from './dialog-content-skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';

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
}: SearchDialogProps) => {
    const isDesktop = useMediaQuery('(min-width: 476px)');
    const SearchComponent = useMemo(() => (isDesktop ? CommandDialog : CommandDrawer), [isDesktop]);

    return (
        <SearchComponent
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
                    isDesktop={isDesktop}
                />
            )}
        </SearchComponent>
    );
};
