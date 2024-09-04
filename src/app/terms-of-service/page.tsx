import type { Metadata } from 'next';
import React from 'react';
import { Document } from '@/components/organisms';
import { queryDocument } from '@/server/service/contentful';
import { DOCUMENTS } from '@/server/service/contentful/types';

const title = 'Terms of Service | NFStudio';

export const metadata: Metadata = {
    title,
    twitter: {
        title
    }
};

const TermsOfServicePage = async () => {
    const { content } = await queryDocument({ title: DOCUMENTS.TERMS_OF_SERVICE });

    return <Document title={DOCUMENTS.TERMS_OF_SERVICE} content={content} />;
};

export default TermsOfServicePage;
