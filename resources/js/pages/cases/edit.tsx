import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/cases';
import type { CaseFormOptions, ServiceCase } from '@/types';
import CaseForm from './case-form';

export default function CasesEdit({
    caseRecord,
    options,
}: {
    caseRecord: ServiceCase;
    options: CaseFormOptions;
}) {
    return (
        <>
            <Head title={`Edit ${caseRecord.case_number}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit complaint"
                    description="Update assignment, status, priority, and resolution details."
                />

                <CaseForm caseRecord={caseRecord} options={options} />
            </div>
        </>
    );
}

CasesEdit.layout = ({ props }: { props: { caseRecord: ServiceCase } }) => ({
    breadcrumbs: [
        {
            title: 'Complaints',
            href: index(),
        },
        {
            title: props.caseRecord.case_number,
            href: show(props.caseRecord.id),
        },
        {
            title: 'Edit',
            href: edit(props.caseRecord.id),
        },
    ],
});
