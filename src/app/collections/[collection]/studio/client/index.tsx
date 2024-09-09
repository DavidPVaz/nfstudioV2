'use client';

import React, { useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useStudioContext } from '@/app/collections/[collection]/studio/client/context';

export const StudioClientContent = () => {
    const { id } = useStudioContext();
    const [collection, setCollection] = useLocalStorage<string[]>(id, null);

    useEffect(() => {
        setCollection(['some', 'some1']);
    }, [setCollection]);

    const Component = useMemo(
        () => () =>
            collection === null ? null : Array.isArray(collection) && collection.length === 0 ? (
                <>empty collection</>
            ) : (
                <>{JSON.stringify(collection)}</>
            ),
        [collection]
    );

    return <Component />;
};
