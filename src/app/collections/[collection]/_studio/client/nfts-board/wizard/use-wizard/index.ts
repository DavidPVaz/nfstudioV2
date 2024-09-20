import { useState, useCallback } from 'react';
import { type WizardPageKey } from '@/enums';
import type {
    WizardPages,
    WizardPage
} from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages/';

export const useWizard = ({ pages, pageKey }: { pages: WizardPages; pageKey: WizardPageKey }) => {
    const [currentPage, setCurrentPage] = useState<WizardPage>(pages[pageKey]);

    const next = useCallback(
        () => currentPage.next && setCurrentPage(pages[currentPage.next]),
        [setCurrentPage, pages, currentPage]
    );
    const previous = useCallback(
        () => currentPage.previous && setCurrentPage(pages[currentPage.previous]),
        [setCurrentPage, pages, currentPage]
    );

    return {
        Page: currentPage?.component,
        pageKey,
        next,
        previous
    };
};
