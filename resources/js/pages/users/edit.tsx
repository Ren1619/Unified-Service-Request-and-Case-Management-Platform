import { Form, Head } from '@inertiajs/react';
import UserAccessController from '@/actions/App/Http/Controllers/UserAccessController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/users';
import type { AccessUser, Role } from '@/types';

type UsersEditProps = {
    user: AccessUser;
    roles: Role[];
    can: {
        assign_super_admin: boolean;
    };
};

export default function UsersEdit({ user, roles, can }: UsersEditProps) {
    const assignedRoleIds = new Set(user.roles.map((role) => role.id));
    const assignableRoles = can.assign_super_admin
        ? roles
        : roles.filter((role) => role.code !== 'super_admin');

    return (
        <>
            <Head title={`Edit ${user.name} roles`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit user roles"
                    description={`${user.name} - ${user.email}`}
                />

                <Form
                    {...UserAccessController.update.form(user.id)}
                    className="max-w-3xl space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <fieldset className="space-y-3">
                                <legend className="text-sm font-medium">
                                    Assigned roles
                                </legend>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {assignableRoles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex items-start gap-3 rounded-lg border p-3"
                                        >
                                            <input
                                                type="checkbox"
                                                name="roles[]"
                                                value={role.id}
                                                defaultChecked={assignedRoleIds.has(
                                                    role.id,
                                                )}
                                                className="mt-1 size-4 rounded border-input"
                                            />
                                            <span>
                                                <span className="block text-sm font-medium">
                                                    {role.name}
                                                </span>
                                                {role.description && (
                                                    <span className="block text-xs text-muted-foreground">
                                                        {role.description}
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.roles} />
                            </fieldset>

                            <Button disabled={processing}>Save roles</Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

UsersEdit.layout = ({ props }: { props: { user: AccessUser } }) => ({
    breadcrumbs: [
        {
            title: 'User access',
            href: index(),
        },
        {
            title: props.user.name,
            href: show(props.user.id),
        },
        {
            title: 'Edit',
            href: edit(props.user.id),
        },
    ],
});
