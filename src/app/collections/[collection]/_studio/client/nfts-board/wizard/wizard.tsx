import React, { createContext, useCallback, useEffect, useContext, useMemo } from 'react';
import { WIZARD_PAGES, WizardPageKey, Platform, Option } from '@/enums';
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

type WizardContext = {
    data: WizardData;
    updateData: (data: Partial<WizardData>) => void;
    previous: () => void;
    next: () => void;
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

export const Wizard = () => {
    const { selectedCollection } = useStudioContext();
    const [data, setData] = useLocalStorage<WizardData>(
        `studio-${selectedCollection}`,
        DEFAULT_DATA
    );

    useEffect(() => () => setData(null), [setData]);

    const updateData = useCallback(
        (newWizardData: Partial<WizardData>) => {
            setData(currentWizardData => ({
                ...currentWizardData,
                ...newWizardData
            }));
        },
        [setData]
    );

    const previous = useCallback(
        () =>
            Pages[data.pageKey]?.previous && updateData({ pageKey: Pages[data.pageKey].previous! }),
        [updateData, data.pageKey]
    );
    const next = useCallback(
        () => Pages[data.pageKey]?.next && updateData({ pageKey: Pages[data.pageKey].next! }),
        [updateData, data.pageKey]
    );

    const Page = useMemo(() => Pages[data.pageKey]?.Page, [data.pageKey]);

    const context = {
        data,
        updateData,
        previous,
        next
    };

    return <Context.Provider value={context}>{Page ? <Page /> : null}</Context.Provider>;
};

export const useWizardContext = () => useContext(Context) as WizardContext;
