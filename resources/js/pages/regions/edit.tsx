import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/regions';
import type { Region } from '@/types';
import RegionForm from './region-form';

export default function RegionsEdit({ region }: { region: Region }) {
    return (
        <>
            <Head title={`Edit ${region.name}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit region"
                    description="Update region details and availability."
                />

                <RegionForm region={region} />
            </div>
        </>
    );
}

RegionsEdit.layout = (props: { region: Region }) => ({
    breadcrumbs: [
        {
            title: 'Regions',
            href: index(),
        },
        {
            title: props.region.name,
            href: show(props.region.id),
        },
        {
            title: 'Edit',
            href: edit(props.region.id),
        },
    ],
});
