import { useState, useCallback } from 'react';
import { type WizardPageKey } from '@/enums';
import type {
    WizardPages,
    WizardPage
} from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages/';

export const useWizard = ({ pages, pageKey }: { pages: WizardPages; pageKey: WizardPageKey }) => {
    const [current, setCurrent] = useState<WizardPage>(pages[pageKey]);

    const next = useCallback(
        () => current.next && setCurrent(pages[current.next]),
        [setCurrent, pages, current]
    );
    const previous = useCallback(
        () => current.previous && setCurrent(pages[current.previous]),
        [setCurrent, pages, current]
    );

    return {
        Page: current?.Page,
        pageKey,
        next,
        previous
    };
};
