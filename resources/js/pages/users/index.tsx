import { Head, Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Search, Users } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import {
    EmptyState,
    MobileCardList,
    MobileRecordCard,
    MobileRecordDetail,
    ResponsiveFilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import RoleBadges from '@/components/role-badges';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { edit, index, show } from '@/routes/users';
import type { AccessUser, Paginated, Role } from '@/types';

type UsersIndexProps = {
    users: Paginated<AccessUser>;
    roles: Role[];
    filters: {
        search?: string | null;
        role?: string | null;
    };
};

export default function UsersIndex({ users, roles, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [openUserId, setOpenUserId] = useState<number | null>(null);
    const filterFormId = 'users-filters';

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            index().url,
            { search, role },
            { preserveState: true, replace: true },
        );
    }

    function resetFilters() {
        setSearch('');
        setRole('');
        router.get(index().url, {}, { preserveState: true, replace: true });
    }

    function UserActions({ user }: { user: AccessUser }) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${user.name}`}
                    >
                        <MoreHorizontal aria-hidden className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                        <Link href={show(user.id)}>
                            <Eye aria-hidden className="size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={edit(user.id)}>
                            <Pencil aria-hidden className="size-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <>
            <Head title="User access" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="User Management"
                    description="Review accounts and manage role assignments."
                />
                </PageHeader>

                <ResponsiveFilterBar
                    formId={filterFormId}
                    onReset={resetFilters}
                    title="Filter users"
                >
                    <form
                        id={filterFormId}
                        onSubmit={submit}
                        className="flex flex-col gap-3 md:flex-row md:items-center"
                    >
                        <div className="relative md:w-80">
                            <Search
                                aria-hidden
                                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search users"
                                className="pl-9"
                            />
                        </div>

                        <NativeSelect
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            className="md:w-64"
                        >
                            <option value="">All roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.code}>
                                    {role.name}
                                </option>
                            ))}
                        </NativeSelect>

                        <Button
                            type="submit"
                            variant="outline"
                            className="hidden md:inline-flex"
                        >
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </ResponsiveFilterBar>

                <TableSurface className="hidden md:block">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                    Email
                                </th>
                                <th className="px-4 py-3 font-medium">Roles</th>
                                <th className="w-28 px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground lg:hidden">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <RoleBadges roles={user.roles} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={show(user.id)}
                                                    aria-label={`View ${user.name}`}
                                                >
                                                    <Eye
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={edit(user.id)}
                                                    aria-label={`Edit ${user.name}`}
                                                >
                                                    <Pencil
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={Users}
                                            title="No users found"
                                            description="Try another search term or role filter to review system accounts."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <MobileCardList>
                    {users.data.map((user) => (
                        <MobileRecordCard
                            key={user.id}
                            actions={<UserActions user={user} />}
                            badges={<RoleBadges roles={user.roles} />}
                            description={user.email}
                            isOpen={openUserId === user.id}
                            onOpenChange={(open) =>
                                setOpenUserId(open ? user.id : null)
                            }
                            title={user.name}
                        >
                            <MobileRecordDetail label="Email">
                                {user.email}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Roles">
                                <RoleBadges roles={user.roles} />
                            </MobileRecordDetail>
                        </MobileRecordCard>
                    ))}
                    {users.data.length === 0 && (
                        <EmptyState
                            icon={Users}
                            title="No users found"
                            description="Try another search term or role filter to review system accounts."
                        />
                    )}
                </MobileCardList>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {users.from ?? 0} to {users.to ?? 0} of{' '}
                        {users.total}
                    </p>
                    <Pagination links={users.links} />
                </div>
            </PageShell>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'User Management',
            href: index(),
        },
    ],
};
