import React from 'react';
import { Document } from '@/components/organisms';
import { queryDocument } from '@/server/service/contentful';
import { DOCUMENTS } from '@/server/service/contentful/types';

const PrivacyPolicyPage = async () => {
    const { content } = await queryDocument({ title: DOCUMENTS.PRIVACY_POLICY });

    return <Document title={DOCUMENTS.PRIVACY_POLICY} content={content} />;
};

export default PrivacyPolicyPage;
