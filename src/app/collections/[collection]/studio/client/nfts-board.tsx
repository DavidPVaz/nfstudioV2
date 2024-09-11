import React from 'react';
import { type Collection } from '@/app/collections/[collection]/studio/client';

export const NftsBoard = ({ collection }: { collection: Collection }) => (
    <div className="relative flex">
        <div className="container relative overflow-y-auto">{JSON.stringify(collection)}</div>
        <div className="absolute bottom-0">Toolbar</div>
    </div>
);
