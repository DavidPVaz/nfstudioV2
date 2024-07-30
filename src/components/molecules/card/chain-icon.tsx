'use client';

import React from 'react';
import { type Chain, CHAINS } from '@/shared/enums';
import { SolanaIcon, EthereumIcon, PolygonIcon, OptimismIcon } from '@/resources';

const CHAIN_ICON_MAP = {
    [CHAINS.SOLANA]: SolanaIcon,
    [CHAINS.ETHEREUM]: EthereumIcon,
    [CHAINS.POLYGON]: PolygonIcon,
    [CHAINS.OPTIMISM]: OptimismIcon
} as const;

export const ChainIcon = ({ chain, className }: { chain: Chain; className?: string }) => {
    const Icon = CHAIN_ICON_MAP[chain];
    return <Icon className={className} />;
};
