import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/regions';
import type { Region } from '@/types';

type RegionsViewProps = {
    region: Region;
    can: {
        update: boolean;
    };
};

export default function RegionsView({ region, can }: RegionsViewProps) {
    return (
        <>
            <Head title={region.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading
                        title={region.name}
                        description="Region profile and operational status."
                    />

                    {can.update && (
                        <Button asChild>
                            <Link href={edit(region.id)}>
                                <Pencil aria-hidden className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>

                <dl className="grid max-w-4xl gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">Code</dt>
                        <dd className="mt-1 font-medium">{region.code}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <StatusBadge active={region.is_active} />
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Description
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap">
                            {region.description ?? 'No description provided.'}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

RegionsView.layout = (props: { region: Region }) => ({
    breadcrumbs: [
        {
            title: 'Regions',
            href: index(),
        },
        {
            title: props.region.name,
            href: show(props.region.id),
        },
    ],
});
