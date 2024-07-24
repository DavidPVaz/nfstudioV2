'use client';

import React from 'react';
import { type CHAIN, CHAINS } from '@/shared/enums';
import { SolanaIcon, EthereumIcon, PolygonIcon, OptimismIcon } from '@/resources';

const CHAIN_ICON_MAP = {
    [CHAINS.SOLANA]: <SolanaIcon />,
    [CHAINS.ETHEREUM]: <EthereumIcon />,
    [CHAINS.POLYGON]: <PolygonIcon />,
    [CHAINS.OPTIMISM]: <OptimismIcon />
};

export const ChainIcon = ({ chain }: { chain: CHAIN }) => CHAIN_ICON_MAP[chain];
