import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/groups';
import type { Contact, ContactGroup } from '@/types';
import GroupForm from './group-form';

export default function GroupsEdit({
    group,
    contacts,
}: {
    group: ContactGroup;
    contacts: Contact[];
}) {
    return (
        <>
            <Head title={`Edit ${group.name}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit group"
                    description="Update group details and assigned contacts."
                />

                <GroupForm group={group} contacts={contacts} />
            </div>
        </>
    );
}

GroupsEdit.layout = ({ props }: { props: { group: ContactGroup } }) => ({
    breadcrumbs: [
        { title: 'Groups', href: index() },
        { title: props.group.name, href: show(props.group.id) },
        { title: 'Edit', href: edit(props.group.id) },
    ],
});
