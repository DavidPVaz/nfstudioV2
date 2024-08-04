'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandShortcut } from '@/components/atoms/command';
import { Button } from '@/components/atoms';
import { CollectionConfiguration } from '@/server/service/mongo/types';
import { Chain } from '@/shared/enums';
import { SearchDialog } from './dialog';

const toValue = (id: string) => `${id.replace('_', ' ')}`;
const toUrl = (id: string) => `${id.replace(' ', '_')}`;

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
        push(`collections/${toUrl(collection)}`);
    }, []);
    const onChain = useCallback((chain: Chain | null) => {
        console.log('CHain: ', chain);
        setSelectedChain(chain);
    }, []);
    console.log('SELECTED CHAIN: ', selectedChain);

    return (
        <>
            <Button onClick={() => setOpen(true)} variant={'outline'}>
                <span className="hidden md:inline-flex">Search collections...</span>
                <span className="inline-flex md:hidden">Search...</span>
                <CommandShortcut>⌘K</CommandShortcut>
            </Button>
            <SearchDialog
                open={open}
                onOpenChange={setOpen}
                onSelect={onSelect}
                onChain={onChain}
                selectedChain={selectedChain}
                data={collections.map(({ _id, presentation, chain }) => ({
                    name: toValue(_id),
                    value: toValue(_id),
                    imgSrc: presentation,
                    chain
                }))}
            />
        </>
    );
};
