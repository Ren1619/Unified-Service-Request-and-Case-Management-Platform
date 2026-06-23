import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { create, index } from '@/routes/complaint-types';
import ComplaintTypeForm from './complaint-type-form';

export default function ComplaintTypesCreate() {
    return (
        <>
            <Head title="Create complaint type" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Create complaint type"
                    description="Add a category for complaints and service requests."
                />

                <ComplaintTypeForm />
            </div>
        </>
    );
}

ComplaintTypesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Complaint types',
            href: index(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
