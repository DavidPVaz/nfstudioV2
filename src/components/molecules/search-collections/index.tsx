'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandShortcut } from '@/components/atoms/command';
import { Button } from '@/components/atoms';
import { CollectionConfiguration } from '@/server/service/mongo/types';
import { Chain } from '@/shared/enums';
import { SearchDialog } from './dialog';
import { useDialog } from '@/hooks/use-dialog';

export const SearchCollections = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const { isOpen, open, close, toggle } = useDialog();
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const { push } = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                open();
            }
        };
        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, [open]);

    const onSelect = useCallback(
        (collection: string) => {
            close();
            push(`collections/${collection.replace(' ', '_')}`);
        },
        [push, close]
    );

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
        [collections, selectedChain]
    );

    // TODO: mac ? ⌘ : Ctrl ; Make drawer below 2xs
    return (
        <>
            <Button aria-label="Search collections" onClick={open} variant="outline">
                <span className="hidden md:inline-flex">Search collections...</span>
                <span className="inline-flex md:hidden">Search...</span>
                <CommandShortcut>⌘K</CommandShortcut>
            </Button>
            <SearchDialog
                open={isOpen}
                onOpenChange={toggle}
                onSelect={onSelect}
                onChain={onChain}
                data={data}
                selectedChain={selectedChain}
            />
        </>
    );
};
