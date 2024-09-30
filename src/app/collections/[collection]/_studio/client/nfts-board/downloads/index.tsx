import React from 'react';
import dynamic from 'next/dynamic';
import { FolderDown } from 'lucide-react';
import { Modal } from '@/components/molecules/modal';
import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/atoms/tooltip';
import { NFStudioSkeleton } from '@/components/molecules/nfstudio-skeleton';

const DownloadsContent = dynamic(
    () =>
        import(
            '@/app/collections/[collection]/_studio/client/nfts-board/downloads/downloads-content'
        ).then(module => module.DownloadsContent),
    {
        loading: NFStudioSkeleton
    }
);

const tooltipContent = 'My downloads';

export const Downloads = React.memo(() => {
    const { isOpen, open, toggle } = useModal();

    return (
        <>
            <Tooltip content={tooltipContent}>
                <Button variant="ghost" size="icon2x" onClick={open} disabled={isOpen}>
                    <FolderDown className="h-[1.7rem] w-[1.7rem] sm:h-[2rem] sm:w-[2rem]" />
                    <span className="sr-only">{tooltipContent}</span>
                </Button>
            </Tooltip>
            <Modal
                open={isOpen}
                onOpenChange={toggle}
                title={tooltipContent}
                description={tooltipContent}
                className="border-0 2xs:max-h-[65vh] 2xs:min-h-[65vh] 2xs:max-w-lg 2xs:overflow-y-auto 2xs:border sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
            >
                <DownloadsContent />
            </Modal>
        </>
    );
});
