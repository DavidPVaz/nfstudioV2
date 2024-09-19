import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommandDialog, CommandDrawer } from '@/components/atoms/command';
import { Chain } from '@/shared/enums';
import { SearchContentSkeleton } from './search-content-skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';

type SearchProps = {
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

export const Search = ({
    open,
    onOpenChange,
    onSelect,
    onChain,
    data,
    selectedChain
}: SearchProps) => {
    const isDesktop = useMediaQuery('(min-width: 475px)');
    const SearchComponent = useMemo(() => (isDesktop ? CommandDialog : CommandDrawer), [isDesktop]);

    return (
        <SearchComponent
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
        </SearchComponent>
    );
};
