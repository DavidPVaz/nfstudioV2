'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CommandShortcut } from '@/components/atoms/command';
import { Button } from '@/components/atoms';
import { CollectionConfiguration } from '@/server/service/mongo/types';

const SearchDialog = dynamic(() => import('./dialog').then(module => module.SearchDialog));

const toValue = (id: string) => `${id.replace('_', ' ')}`;
const toUrl = (id: string) => `${id.replace(' ', '_')}`;

export const SearchCollections = ({ collections }: { collections: CollectionConfiguration[] }) => {
    const [open, setOpen] = useState(false);
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

    return (
        <>
            <Button onClick={() => setOpen(true)} variant={'outline'}>
                <span className="hidden md:inline-flex">Search collections...</span>
                <span className="inline-flex md:hidden">Search...</span>
                <CommandShortcut>⌘K</CommandShortcut>
            </Button>
            {open && (
                <SearchDialog
                    open={open}
                    onOpenChange={setOpen}
                    onSelect={onSelect}
                    data={collections.map(({ _id, presentation }) => ({
                        name: toValue(_id),
                        value: toValue(_id),
                        imgSrc: presentation
                    }))}
                />
            )}
        </>
    );
};
