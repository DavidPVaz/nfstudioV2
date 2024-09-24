import React from 'react';
import dynamic from 'next/dynamic';
import { CircleHelp } from 'lucide-react';
import { Modal } from '@/components/molecules/modal';
import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/atoms/tooltip';
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

export const Help = () => {
    const { isOpen, open, toggle } = useModal();

    return (
        <>
            <Tooltip content="Get help">
                <Button variant="ghost" size="icon2x" onClick={open} disabled={isOpen}>
                    <CircleHelp className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                    <span className="sr-only">Get help</span>
                </Button>
            </Tooltip>
            <Modal
                open={isOpen}
                onOpenChange={toggle}
                title="Get help"
                description="Get help"
                className="border-0 pl-0 2xs:max-h-[65vh] 2xs:min-h-[65vh] 2xs:max-w-lg 2xs:overflow-y-auto 2xs:border sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
            >
                {isOpen && <HelpContent />}
            </Modal>
        </>
    );
};
