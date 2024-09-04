import type { Metadata } from 'next';
import React from 'react';
import { Document } from '@/components/organisms';
import { queryDocument } from '@/server/service/contentful';
import { DOCUMENTS } from '@/server/service/contentful/types';

const title = 'Privacy Policy | NFStudio';

export const metadata: Metadata = {
    title,
    twitter: {
        title
    }
};

const PrivacyPolicyPage = async () => {
    const { content } = await queryDocument({ title: DOCUMENTS.PRIVACY_POLICY });

    return <Document title={DOCUMENTS.PRIVACY_POLICY} content={content} />;
};

export default PrivacyPolicyPage;
