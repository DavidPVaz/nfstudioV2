import React from 'react';
import { Image } from '@/components/atoms/image';
import { Toggle } from '@/components/atoms/toggle';

export const SelectableLogo = React.memo(
    ({
        logo,
        selected,
        onSelect,
        ariaLabel
    }: {
        logo: string;
        selected: boolean;
        onSelect: (logo?: string) => void;
        ariaLabel: string;
    }) => (
        <Toggle
            pressed={selected}
            onPressedChange={pressed => onSelect(pressed ? logo : undefined)}
            aria-label={ariaLabel}
            variant="outline"
            className="h-20 py-3"
        >
            <Image
                width={179.27}
                height={80}
                className="h-full w-auto"
                variant={'fill_contain'}
                src={logo}
                alt={ariaLabel}
                optimizedWidth={200}
                quality={80}
            />
        </Toggle>
    ),
    (previousProps, nextProps) =>
        previousProps.selected === nextProps.selected &&
        previousProps.onSelect === nextProps.onSelect
);
