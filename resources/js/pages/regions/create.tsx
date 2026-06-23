import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { create, index } from '@/routes/regions';
import RegionForm from './region-form';

export default function RegionsCreate() {
    return (
        <>
            <Head title="Create region" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Create region"
                    description="Add a service office region."
                />

                <RegionForm />
            </div>
        </>
    );
}

RegionsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Regions',
            href: index(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
