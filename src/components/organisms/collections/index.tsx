import React from 'react';

export const Collections = async ({ children }: { children: React.ReactElement }) => (
    <ul className="grid w-full grid-cols-1 gap-3 xs:grid-cols-2 2xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {children}
    </ul>
);
