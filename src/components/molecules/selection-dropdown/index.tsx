'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/atoms/select';

type SelectionProps = {
    onSelect: (value: string) => void;
    selected?: string;
    options: { value: string; display: string }[];
    disabled?: boolean;
    placeholder: string;
    defaultOpen?: boolean;
    ariaLabel: string;
};

export const SelectionDropdown = ({
    onSelect,
    selected,
    options,
    disabled = false,
    placeholder,
    defaultOpen = false,
    ariaLabel
}: SelectionProps) => (
    <Select onValueChange={onSelect} value={selected} disabled={disabled} defaultOpen={defaultOpen}>
        <SelectTrigger aria-label={ariaLabel}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {options.map(({ value, display }) => (
                    <SelectItem key={value} value={value}>
                        {display}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
);
