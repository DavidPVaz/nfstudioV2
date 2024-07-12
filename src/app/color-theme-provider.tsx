'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const ColorThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
