import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/complaint-types';
import type { ComplaintType } from '@/types';

type ComplaintTypesViewProps = {
    complaintType: ComplaintType;
    can: {
        update: boolean;
    };
};

export default function ComplaintTypesView({
    complaintType,
    can,
}: ComplaintTypesViewProps) {
    return (
        <>
            <Head title={complaintType.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading
                        title={complaintType.name}
                        description="Complaint category profile and operational status."
                    />

                    {can.update && (
                        <Button asChild>
                            <Link href={edit(complaintType.id)}>
                                <Pencil aria-hidden className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>

                <dl className="grid max-w-4xl gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <StatusBadge active={complaintType.is_active} />
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Description
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap">
                            {complaintType.description ??
                                'No description provided.'}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

ComplaintTypesView.layout = (props: { complaintType: ComplaintType }) => ({
    breadcrumbs: [
        {
            title: 'Complaint types',
            href: index(),
        },
        {
            title: props.complaintType.name,
            href: show(props.complaintType.id),
        },
    ],
});
