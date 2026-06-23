import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import RoleBadges from '@/components/role-badges';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/users';
import type { AccessUser } from '@/types';

type UsersViewProps = {
    user: AccessUser;
    can: {
        update: boolean;
    };
};

export default function UsersView({ user, can }: UsersViewProps) {
    return (
        <>
            <Head title={user.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading
                        title={user.name}
                        description="Account access profile."
                    />

                    {can.update && (
                        <Button asChild>
                            <Link href={edit(user.id)}>
                                <Pencil aria-hidden className="size-4" />
                                Edit roles
                            </Link>
                        </Button>
                    )}
                </div>

                <dl className="grid max-w-4xl gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">Email</dt>
                        <dd className="mt-1 font-medium">{user.email}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Verification
                        </dt>
                        <dd className="mt-1 font-medium">
                            {user.email_verified_at ? 'Verified' : 'Pending'}
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">Roles</dt>
                        <dd className="mt-2">
                            <RoleBadges roles={user.roles} />
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

UsersView.layout = ({ props }: { props: { user: AccessUser } }) => ({
    breadcrumbs: [
        {
            title: 'User access',
            href: index(),
        },
        {
            title: props.user.name,
            href: show(props.user.id),
        },
    ],
});
