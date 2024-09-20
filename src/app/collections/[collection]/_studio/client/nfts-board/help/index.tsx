'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/molecules/modal';
import { HelpContentSkeleton } from '@/app/collections/[collection]/_studio/client/nfts-board/help/help-content-skeleton';

const HelpContent = dynamic(
    () =>
        import('@/app/collections/[collection]/_studio/client/nfts-board/help/help-content').then(
            module => module.HelpContent
        ),
    {
        loading: HelpContentSkeleton
    }
);

export const HelpModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: () => void }) => (
    <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Get help"
        description="Get help"
        className="border-0 pl-0 2xs:max-h-[65vh] 2xs:min-h-[65vh] 2xs:max-w-lg 2xs:overflow-y-auto 2xs:border sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
    >
        {open && <HelpContent />}
    </Modal>
);
