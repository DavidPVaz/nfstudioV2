import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { PageTitle } from '@/components/molecules/page-title';
import { NFStudioDocument } from '@/server/service/contentful/types';

// TODO: investigate download as pdf option of this content.
export const Document = ({ title, content }: NFStudioDocument) => (
    <div className="relative flex w-full flex-col items-center justify-start gap-y-4 duration-300 animate-in fade-in-0">
        <section className="relative flex w-full flex-col">
            <PageTitle title={title} />
        </section>
        <section className="relative flex w-full flex-col">
            <div className="relative inline-block hyphens-auto text-pretty break-words text-left text-base 2xs:text-justify 2xs:text-lg [&_a]:underline [&_p]:my-4">
                {documentToReactComponents(content, { preserveWhitespace: true })}
            </div>
        </section>
    </div>
);
