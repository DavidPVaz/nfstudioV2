import React from 'react';
import { WIZARD_PAGES, type WizardPageKey } from '@/enums';

export type WizardPage = {
    Page: () => React.JSX.Element;
    previous: null | WizardPageKey;
    next: null | WizardPageKey;
};

export type WizardPages = Record<WizardPageKey, WizardPage>;

export const Pages: WizardPages = {
    [WIZARD_PAGES.SELECTION]: {
        Page: () => <div>selection</div>,
        previous: null,
        next: WIZARD_PAGES.CONFIRM
    },
    [WIZARD_PAGES.CONFIRM]: {
        Page: () => <div>confirm</div>,
        previous: WIZARD_PAGES.SELECTION,
        next: null
    }
};
