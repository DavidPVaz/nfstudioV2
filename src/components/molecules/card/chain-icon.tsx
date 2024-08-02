'use client';

import React from 'react';
import { type Chain, CHAIN_ICON_MAP } from '@/shared/enums';

export const ChainIcon = ({ chain, className }: { chain: Chain; className?: string }) => {
    const Icon = CHAIN_ICON_MAP[chain];
    return <Icon className={className} />;
};
