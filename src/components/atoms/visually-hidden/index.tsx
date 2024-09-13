import React from 'react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Hide = ({ children }: { children: React.ReactNode }) => (
    <VisuallyHidden.Root>{children}</VisuallyHidden.Root>
);
