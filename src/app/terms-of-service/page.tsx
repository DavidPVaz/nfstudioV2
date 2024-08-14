import React from 'react';
import { PageTitle } from '@/components/molecules';

const TermsOfServicePage = () => {
    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <PageTitle title="TERMS OF SERVICE" />
            </section>
        </div>
    );
};

export default TermsOfServicePage;
