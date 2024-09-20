import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommandDialog, CommandDrawer } from '@/components/atoms/command';
import { Chain } from '@/shared/enums';
import { SearchContentSkeleton } from './search-content-skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';

type SearchModalProps = {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onSelect: (value: string) => void;
    onChain: (chain: Chain | null) => void;
    data: { value: string; imgSrc: string }[];
    selectedChain: Chain | null;
};

const SearchContent = dynamic(
    () => import('./search-content').then(module => module.SearchContent),
    {
        loading: SearchContentSkeleton
    }
);

export const SearchModal = ({
    open,
    onOpenChange,
    onSelect,
    onChain,
    data,
    selectedChain
}: SearchModalProps) => {
    const isDesktop = useMediaQuery('(min-width: 475px)');
    const Modal = useMemo(() => (isDesktop ? CommandDialog : CommandDrawer), [isDesktop]);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={'Search available NFT collections'}
            modal
        >
            {open && (
                <SearchContent
                    onSelect={onSelect}
                    onChain={onChain}
                    data={data}
                    selectedChain={selectedChain}
                />
            )}
        </Modal>
    );
};
