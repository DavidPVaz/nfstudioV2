'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

type SelectionProps = {
    onSelect: (value: string) => void;
    selected: string;
    options: { value: string; display: string }[];
    disabled?: boolean;
};

export const SelectionDropdown = ({
    onSelect,
    selected,
    options,
    disabled = false
}: SelectionProps) => (
    <Select onValueChange={onSelect} value={selected} disabled={disabled}>
        <SelectTrigger>
            <SelectValue>{selected}</SelectValue>
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
