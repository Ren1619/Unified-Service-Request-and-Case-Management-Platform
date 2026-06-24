import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/complaint-types';
import type { ComplaintType } from '@/types';
import ComplaintTypeForm from './complaint-type-form';

export default function ComplaintTypesEdit({
    complaintType,
}: {
    complaintType: ComplaintType;
}) {
    return (
        <>
            <Head title={`Edit ${complaintType.name}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit complaint type"
                    description="Update category details and availability."
                />

                <ComplaintTypeForm complaintType={complaintType} />
            </div>
        </>
    );
}

ComplaintTypesEdit.layout = (props: { complaintType: ComplaintType }) => ({
    breadcrumbs: [
        {
            title: 'Complaint types',
            href: index(),
        },
        {
            title: props.complaintType.name,
            href: show(props.complaintType.id),
        },
        {
            title: 'Edit',
            href: edit(props.complaintType.id),
        },
    ],
});
