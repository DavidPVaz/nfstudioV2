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
            className="h-[58px] snap-center py-3 2xs:h-20"
        >
            <Image
                width={179.27}
                height={80}
                variant={'contain'}
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
