'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandShortcut } from '@/components/atoms/command';
import { Button } from '@/components/atoms';
import { CollectionConfiguration } from '@/server/service/mongo/types';
import { Chain } from '@/shared/enums';
import { SearchDialog } from './dialog';

export const SearchCollections = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const { push } = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(open => !open);
            }
        };
        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, []);

    const onSelect = useCallback((collection: string) => {
        setOpen(false);
        push(`collections/${collection.replace(' ', '_')}`);
    }, []);

    const onChain = useCallback((chain: Chain | null) => {
        setSelectedChain(chain);
    }, []);

    const data = useMemo(
        () =>
            collections
                .filter(({ chain }) => selectedChain === null || selectedChain === chain)
                .map(({ _id, presentation }) => ({
                    value: `${_id.replace('_', ' ')}`,
                    imgSrc: presentation
                })),
        [selectedChain]
    );

    return (
        <>
            <Button
                aria-label="Search collections"
                onClick={() => setOpen(true)}
                variant={'outline'}
            >
                <span className="hidden md:inline-flex">Search collections...</span>
                <span className="inline-flex md:hidden">Search...</span>
                <CommandShortcut>⌘K</CommandShortcut>
            </Button>
            <SearchDialog
                open={open}
                onOpenChange={setOpen}
                onSelect={onSelect}
                onChain={onChain}
                data={data}
                selectedChain={selectedChain}
            />
        </>
    );
};
