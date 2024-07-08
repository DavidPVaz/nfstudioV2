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
        <Button variant="outline" size="icon" onClick={onToggle}>
            {theme === 'light' ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle color theme</span>
        </Button>
    );
};
