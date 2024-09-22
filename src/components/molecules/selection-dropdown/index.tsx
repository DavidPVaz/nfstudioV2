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
};

export const SelectionDropdown = ({
    onSelect,
    selected,
    options,
    disabled = false,
    placeholder
}: SelectionProps) => (
    <Select onValueChange={onSelect} value={selected ?? placeholder} disabled={disabled}>
        <SelectTrigger>
            <SelectValue>{selected ?? placeholder}</SelectValue>
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
