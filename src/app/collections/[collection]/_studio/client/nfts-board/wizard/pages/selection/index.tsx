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

    const platformAvailableOptions = useMemo(
        () => (platform ? getPlatformAvailableOptions(platform) : []),
        [platform]
    );

    const onPlatform = useCallback(
        (value: string) => updateData({ platform: value as Platform }),
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
        <div className="relative flex w-full flex-col gap-8 pt-6 2xs:w-4/5 2xs:pt-0 md:flex-row">
            <SelectionDropdown
                ariaLabel={SELECT_PLATFORM}
                onSelect={onPlatform}
                options={AVAILABLE_PLATFORMS}
                selected={platform}
                placeholder={SELECT_PLATFORM}
                defaultOpen={!platform}
            />
            <SelectionDropdown
                ariaLabel={SELECT_OPTION}
                onSelect={onOption}
                options={platformAvailableOptions}
                placeholder={SELECT_OPTION}
                disabled={!platform}
            />
        </div>
    );
};
