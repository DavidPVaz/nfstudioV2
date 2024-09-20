'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandShortcut } from '@/components/atoms/command';
import { Button } from '@/components/atoms/button';
import { CollectionConfiguration } from '@/server/service/mongo/types';
import { Chain } from '@/enums';
import { SearchModal } from '@/components/molecules/search-collections/search';
import { useModal } from '@/hooks/use-modal';
import { isMacOS } from '@/lib/utils';

export const SearchCollections = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const { isOpen, open, close, toggle } = useModal();
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [isMac, setIsMac] = useState<boolean | null>(null);
    const { push } = useRouter();

    useEffect(() => {
        setIsMac(isMacOS());
    }, []);

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

    return (
        <>
            <Button aria-label="Search collections" onClick={open} variant="outline">
                <span className="inline">Search collections...</span>
                <CommandShortcut className="hidden 2xs:inline">
                    {isMac === null ? null : `${isMac ? '⌘' : 'Ctrl '}K`}
                </CommandShortcut>
            </Button>
            <SearchModal
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
