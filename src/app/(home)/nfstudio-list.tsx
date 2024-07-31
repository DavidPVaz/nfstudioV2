'use client';

import React from 'react';
import { type CollectionConfiguration } from '@/server/service/mongo/types';
import { CollectionsList } from '@/components/organisms';

export const NFStudioList = ({ collections }: { collections: CollectionConfiguration[] }) => {
    // check window width with hook
    // make calculations

    // XL 12 - 1280px
    // LG 10 - 1024px
    // MD 8 - 768px
    // XS: 6 - 290px
    // 3

    return <CollectionsList collections={collections} />;
};
