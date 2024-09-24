import React, { createContext, useCallback, useEffect, useContext, useMemo } from 'react';
import { WIZARD_PAGES, type WizardPageKey, type Platform, type Option } from '@/enums';
import type { NFT } from '@/app/collections/[collection]/_studio/client/';
import { Pages } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/pages';
import { useStudioContext } from '@/app/collections/[collection]/_studio/client/context';
import { useLocalStorage } from '@/hooks/use-local-storage';

const Context = createContext({});

type WizardData = {
    platform?: Platform;
    option?: Option;
    atRight: boolean;
    coverStyle: boolean;
    logo?: string;
    downloadRef?: string;
    downloadName?: string;
    downloadId?: string;
    hasDownloaded: boolean;
    pageKey: WizardPageKey;
    selectedNFT: NFT;
};

type WizardContext = {
    data: WizardData;
    updateData: (data: Partial<WizardData>) => void;
    previous: (resetFields?: Partial<WizardData>) => void;
    next: () => void;
};

const DEFAULT_DATA = {
    atRight: false,
    coverStyle: false,
    hasDownloaded: false,
    pageKey: WIZARD_PAGES.SELECTION
};

export const Wizard = ({ selectedNFT }: { selectedNFT: NFT }) => {
    const { selectedCollection } = useStudioContext();
    const [data, setData] = useLocalStorage<WizardData>(`studio-${selectedCollection}`, {
        selectedNFT,
        ...DEFAULT_DATA
    });

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
        (resetFields: Partial<WizardData> = {}) =>
            Pages[data.pageKey].previous &&
            updateData({ pageKey: Pages[data.pageKey].previous!, ...resetFields }),
        [updateData, data.pageKey]
    );
    const next = useCallback(
        () => Pages[data.pageKey].next && updateData({ pageKey: Pages[data.pageKey].next! }),
        [updateData, data.pageKey]
    );

    const Page = useMemo(() => Pages[data.pageKey].Page, [data.pageKey]);

    const context = {
        data,
        updateData,
        previous,
        next
    };

    return (
        <Context.Provider value={context}>
            <div className="flex h-full max-h-full justify-center overflow-hidden p-6 2xs:p-0">
                <Page />
            </div>
        </Context.Provider>
    );
};

export const useWizardContext = () => useContext(Context) as WizardContext;
