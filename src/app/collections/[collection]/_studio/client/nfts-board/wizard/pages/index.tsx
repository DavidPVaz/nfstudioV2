import React from 'react';
import { WIZARD_PAGES, type WizardPageKey } from '@/enums';
import { Selection } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages/selection';
import { Confirm } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages/confirm';

type WizardPage = {
    Page: () => React.JSX.Element;
    previous: null | WizardPageKey;
    next: null | WizardPageKey;
};

type WizardPages = Record<WizardPageKey, WizardPage>;

export const Pages: WizardPages = {
    [WIZARD_PAGES.SELECTION]: {
        Page: Selection,
        previous: null,
        next: WIZARD_PAGES.CONFIRM
    },
    [WIZARD_PAGES.CONFIRM]: {
        Page: Confirm,
        previous: WIZARD_PAGES.SELECTION,
        next: null
    }
};
