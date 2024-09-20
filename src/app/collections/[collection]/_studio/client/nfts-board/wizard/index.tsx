import React, { createContext, useCallback } from 'react';
import { WIZARD_PAGES, WizardPageKey, Platform, Option } from '@/enums';
import { useWizard } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/use-wizard';
import { Pages } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { useLocalStorage } from '@/hooks/use-local-storage';

const Context = createContext({});

type WizardData = {
    platform: null | Platform;
    option: null | Option;
    atRight: boolean;
    coverStyle: boolean;
    logo?: string;
    downloadRef: null | string;
    downloadName: null | string;
    downloadId: null | string;
    hasDownloaded: boolean;
    pageKey: WizardPageKey;
};

const DEFAULT_DATA = {
    platform: null,
    option: null,
    atRight: false,
    coverStyle: false,
    logo: undefined,
    downloadRef: null,
    downloadName: null,
    downloadId: null,
    hasDownloaded: false,
    pageKey: WIZARD_PAGES.SELECTION
};

type WizardProps = {
    onClose: () => void;
};

export const Wizard = React.memo(({ onClose }: WizardProps) => {
    const { selectedCollection } = useStudioContext();
    const [data, setData] = useLocalStorage<WizardData>(
        `studio-${selectedCollection}`,
        DEFAULT_DATA
    );
    const { Page, pageKey, next, previous } = useWizard({
        pages: Pages,
        pageKey: data.pageKey
    });

    const updateData = useCallback(
        (data: WizardData) => {
            setData(previousData => ({
                ...previousData,
                ...data,
                pageKey
            }));
        },
        [setData, pageKey]
    );

    const closeWizard = useCallback(() => {
        setData(null);
        onClose();
    }, [setData, onClose]);

    const context = {
        previous,
        next,
        updateData,
        data,
        closeWizard
    };

    return (
        <Context.Provider value={context}>
            <Page />
        </Context.Provider>
    );
});

export default Context;
