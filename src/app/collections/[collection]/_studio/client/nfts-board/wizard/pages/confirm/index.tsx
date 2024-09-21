import React from 'react';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { Button } from '@/components/atoms/button';

export const Confirm = () => {
    const { previous, next } = useWizardContext();

    return (
        <>
            <div>confirm</div>
            <Button onClick={previous}>previous</Button>
            <Button onClick={next}>next</Button>
        </>
    );
};
