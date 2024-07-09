'use client';

import React, { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export const ToggleTheme = () => {
    const { setTheme, theme } = useTheme();

    const onToggle = useCallback(
        () => setTheme(theme === 'light' ? 'dark' : 'light'),
        [theme, setTheme]
    );

    return (
        <Button variant="ghost" size="icon" onClick={onToggle}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <span className="sr-only">Toggle color theme</span>
        </Button>
    );
};
