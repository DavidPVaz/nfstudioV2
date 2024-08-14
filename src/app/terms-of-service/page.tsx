import React from 'react';
import { PageTitle } from '@/components/molecules';

const TermsOfServicePage = () => {
    return (
        <div className="relative flex w-full flex-col items-center justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-fit flex-col 2xs:w-full">
                <PageTitle title="TERMS OF SERVICE" />
            </section>
        </div>
    );
};

export default TermsOfServicePage;
