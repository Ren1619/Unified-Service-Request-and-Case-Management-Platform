import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { create, index } from '@/routes/cases';
import type { CaseFormOptions } from '@/types';
import CaseForm from './case-form';

export default function CasesCreate({ options }: { options: CaseFormOptions }) {
    return (
        <>
            <Head title="File complaint" />

            <div className="space-y-6 p-4">
                <Heading
                    title="File complaint"
                    description="Capture a complaint from an incoming message or call for workflow processing."
                />

                <CaseForm options={options} />
            </div>
        </>
    );
}

CasesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Complaints',
            href: index(),
        },
        {
            title: 'File Complaint',
            href: create(),
        },
    ],
};
