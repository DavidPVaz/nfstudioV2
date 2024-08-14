import React from 'react';
import { PageTitle } from '@/components/molecules';

const PrivacyPolicyPage = () => {
    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <PageTitle title="PRIVACY POLICY" />
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
