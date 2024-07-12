'use client';

import React, { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/atoms';

export const ToggleColorTheme = () => {
    const { setTheme, theme } = useTheme();

    const onToggle = useCallback(
        () => setTheme(theme === 'light' ? 'dark' : 'light'),
        [theme, setTheme]
    );

    return (
        <Button variant="ghost" size="icon" onClick={onToggle}>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
            <span className="sr-only">Toggle color theme</span>
        </Button>
    );
};
