import React from 'react';
import { Document } from '@/components/organisms';
import { queryDocument } from '@/server/service/contentful';
import { DOCUMENTS } from '@/server/service/contentful/types';

const TermsOfServicePage = async () => {
    const { content } = await queryDocument({ title: DOCUMENTS.TERMS_OF_SERVICE });

    return <Document title={DOCUMENTS.TERMS_OF_SERVICE} content={content} />;
};

export default TermsOfServicePage;
