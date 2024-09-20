import React from 'react';
import { WIZARD_PAGES, WizardPageKey } from '@/enums';

export type WizardPage = {
    component: () => React.JSX.Element;
    previous: null | WizardPageKey;
    next: null | WizardPageKey;
};

export type WizardPages = Record<WizardPageKey, WizardPage>;

export const Pages: WizardPages = {
    [WIZARD_PAGES.SELECTION]: {
        component: () => <div>selection</div>,
        previous: null,
        next: WIZARD_PAGES.CONFIRM
    },
    [WIZARD_PAGES.CONFIRM]: {
        component: () => <div>confirm</div>,
        previous: WIZARD_PAGES.SELECTION,
        next: null
    }
};
