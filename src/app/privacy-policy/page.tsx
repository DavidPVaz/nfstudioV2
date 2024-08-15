import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { PageTitle } from '@/components/molecules';
import { queryDocument } from '@/server/service/contentful';
import { DOCUMENTS } from '@/server/service/contentful/types';

const PrivacyPolicyPage = async () => {
    const { content } = await queryDocument({ title: DOCUMENTS.PRIVACY_POLICY });

    return (
        <div className="relative flex w-full flex-col items-center justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col">
                <PageTitle title="PRIVACY POLICY" />
            </section>
            <section className="relative flex w-full flex-col">
                <div className="hyphens-auto text-pretty break-words text-left text-base 2xs:text-justify 2xs:text-lg [&_a]:underline">
                    {documentToReactComponents(content)}
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
