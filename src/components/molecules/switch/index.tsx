import React from 'react';
import { Label } from '@/components/atoms/label';
import { Switch as SwitchRaw } from '@/components/atoms/switch';

export const Switch = React.memo(
    ({
        checked,
        onCheckChange,
        leftLabel,
        rightLabel,
        ariaLabel
    }: {
        checked: boolean;
        onCheckChange: (checked: boolean) => void;
        leftLabel: string;
        rightLabel: string;
        ariaLabel: string;
    }) => (
        <div className="flex w-full items-center justify-center gap-x-3">
            <Label
                onClick={e => e.preventDefault()}
                className={`${!checked ? 'text-xl font-bold' : 'text-lg'} w-full text-right transition-all`}
            >
                {leftLabel}
            </Label>
            <SwitchRaw
                className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
                checked={checked}
                onCheckedChange={onCheckChange}
                aria-label={ariaLabel}
            />
            <Label
                onClick={e => e.preventDefault()}
                className={`${checked ? 'text-xl font-bold' : 'text-lg'} w-full text-left transition-all`}
            >
                {rightLabel}
            </Label>
        </div>
    ),
    (previousProps, nextProps) =>
        previousProps.checked === nextProps.checked &&
        previousProps.onCheckChange === nextProps.onCheckChange
);
