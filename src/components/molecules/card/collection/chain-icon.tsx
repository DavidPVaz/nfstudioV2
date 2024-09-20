'use client';

import React from 'react';
import { default as SolanaIcon } from '@/resources/SolanaIcon.svg';
import { default as EthereumIcon } from '@/resources/EthereumIcon.svg';
import { default as PolygonIcon } from '@/resources/PolygonIcon.svg';
import { default as OptimismIcon } from '@/resources/OptimismIcon.svg';
import { type Chain, CHAINS } from '@/enums';

const CHAIN_ICON_MAP = {
    [CHAINS.SOLANA]: SolanaIcon,
    [CHAINS.ETHEREUM]: EthereumIcon,
    [CHAINS.POLYGON]: PolygonIcon,
    [CHAINS.OPTIMISM]: OptimismIcon
};

export const ChainIcon = ({ chain, className }: { chain: Chain; className?: string }) => {
    const Icon = CHAIN_ICON_MAP[chain];
    return <Icon className={className} />;
};
