'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Hide } from '@/components/atoms/visually-hidden';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/atoms/dialog';
import { HelpContentSkeleton } from './help-content-skeleton';

const HelpContent = dynamic(() => import('./help-content').then(module => module.HelpContent), {
    loading: HelpContentSkeleton
});

// TODO: Make drawer below 2xs?
export const HelpInDialog = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: () => void;
}) => (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent className="max-h-[65vh] min-h-[65vh] max-w-lg overflow-y-auto border-0 pb-6 pl-0 pr-6 pt-6 2xs:border sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
            <Hide>
                <DialogTitle>{'Get help'}</DialogTitle>
                <DialogDescription>{'Get help'}</DialogDescription>
            </Hide>
            {open && <HelpContent />}
        </DialogContent>
    </Dialog>
);
