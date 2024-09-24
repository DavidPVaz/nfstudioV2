import React from 'react';
import { Label } from '@/components/atoms/label';
import { Switch } from '@/components/atoms/switch';

export const NFTPositionSwitch = React.memo(
    ({
        checked,
        onCheckChange,
        leftLabel,
        rightLabel
    }: {
        checked: boolean;
        onCheckChange: (checked: boolean) => void;
        leftLabel: string;
        rightLabel: string;
    }) => (
        <div className="flex w-full items-center justify-center gap-x-3">
            <Label
                className={`${!checked ? 'text-xl font-bold' : 'text-lg'} w-full text-right transition-all`}
                htmlFor="nft-position"
            >
                {leftLabel}
            </Label>
            <Switch
                className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
                id="nft-position"
                checked={checked}
                onCheckedChange={onCheckChange}
            />
            <Label
                className={`${checked ? 'text-xl font-bold' : 'text-lg'} w-full text-left transition-all`}
                htmlFor="nft-position"
            >
                {rightLabel}
            </Label>
        </div>
    ),
    (previousProps, nextProps) =>
        previousProps.checked === nextProps.checked &&
        previousProps.onCheckChange === nextProps.onCheckChange
);
