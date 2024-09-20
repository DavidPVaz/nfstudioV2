'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ManagedDialog, ManagedDrawer } from '@/components/molecules/modal';
import { HelpContentSkeleton } from './help-content-skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';

const HelpContent = dynamic(() => import('./help-content').then(module => module.HelpContent), {
    loading: HelpContentSkeleton
});

export const HelpModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: () => void }) => {
    const isDesktop = useMediaQuery('(min-width: 475px)');
    const Modal = useMemo(() => (isDesktop ? ManagedDialog : ManagedDrawer), [isDesktop]);
    const className = useMemo(
        () =>
            isDesktop
                ? 'max-h-[65vh] min-h-[65vh] max-w-lg overflow-y-auto pl-0 2xs:border sm:max-w-xl md:max-w-2xl lg:max-w-4xl'
                : 'border-0',
        [isDesktop]
    );

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Get help"
            description="Get help"
            className={className}
        >
            {open && <HelpContent />}
        </Modal>
    );
};
