import React, { useMemo, useCallback } from 'react';
import { type Platform, type Option } from '@/enums';
import {
    getAvailablePlatforms,
    getPlatformAvailableOptions
} from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/config';
import { useWizardContext } from '@/app/collections/[collection]/_studio/client/nfts-board/wizard/wizard';
import { SelectionDropdown } from '@/components/molecules/selection-dropdown';

const SELECT_PLATFORM = 'Select platform';
const SELECT_OPTION = 'Select option';
const AVAILABLE_PLATFORMS = getAvailablePlatforms();

export const Selection = () => {
    const {
        updateData,
        next,
        data: { platform }
    } = useWizardContext();

    const selectedPlatformDisplay = useMemo(
        () => AVAILABLE_PLATFORMS.find(({ value }) => value === platform)?.display,
        [platform]
    );

    const availableOptions = useMemo(
        () => (platform === null ? [] : getPlatformAvailableOptions(platform)),
        [platform]
    );

    const onPlatform = useCallback(
        (value: string) => {
            updateData({ platform: value as Platform });
        },
        [updateData]
    );

    const onOption = useCallback(
        (value: string) => {
            updateData({
                option: value as Option
            });
            next();
        },
        [updateData, next]
    );

    return (
        <>
            <div>selection</div>
            <SelectionDropdown
                onSelect={onPlatform}
                options={AVAILABLE_PLATFORMS}
                selected={selectedPlatformDisplay ?? SELECT_PLATFORM}
            />
            <SelectionDropdown
                onSelect={onOption}
                options={availableOptions}
                selected={SELECT_OPTION}
                disabled={availableOptions.length === 0}
            />
        </>
    );
};
