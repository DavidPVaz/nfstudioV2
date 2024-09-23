import React from 'react';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { Button } from '@/components/atoms/button';
import { ArrowBigLeft } from 'lucide-react';

const BackArrow = ({ onBack }: { onBack: () => void }) => (
    <Button
        onClick={onBack}
        variant="ghost"
        size="icon"
        className="absolute -left-4 -top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-muted hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 2xs:-left-4 2xs:-top-4"
    >
        <ArrowBigLeft className="h-10 w-10 2xs:h-6 2xs:w-6" />
        <span className="sr-only">Go to previous page</span>
    </Button>
);

export const Confirm = () => {
    const { previous, next } = useWizardContext();

    return (
        <div className="relative flex min-h-full min-w-full">
            <BackArrow onBack={previous} />
        </div>
    );
};
