import React from 'react';
import { PageTitle } from '@/components/molecules';

const FaqPage = () => {
    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-y-12 md:gap-y-20">
            <section className="relative flex w-full flex-col 2xs:w-fit">
                <PageTitle title="FREQUENTLY ASKED QUESTIONS" />
            </section>
        </div>
    );
};

export default FaqPage;
