'use client';

import React, { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

export const ToggleTheme = () => {
    const { setTheme } = useTheme();

    const onToggle = useCallback((theme: Theme) => setTheme(theme), [setTheme]);
    const onLight = useCallback(() => onToggle('light'), [onToggle]);
    const onDark = useCallback(() => onToggle('dark'), [onToggle]);
    const onSystem = useCallback(() => onToggle('system'), [onToggle]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={e => e.preventDefault()}>
                <DropdownMenuItem onClick={onLight}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={onDark}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={onSystem}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
