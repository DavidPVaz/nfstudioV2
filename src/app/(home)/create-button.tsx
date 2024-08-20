'use client';

import React from 'react';
import { Button } from '@/components/atoms';

export const CreateButton = ({ className }: { className: string }) => (
    <Button
        className={className}
        onClick={() =>
            document
                .getElementById('value')!
                .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        }
    >
        CREATE
    </Button>
);
