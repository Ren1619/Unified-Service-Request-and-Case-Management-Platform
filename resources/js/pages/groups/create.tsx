import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { create, index } from '@/routes/groups';
import type { Contact } from '@/types';
import GroupForm from './group-form';

export default function GroupsCreate({ contacts }: { contacts: Contact[] }) {
    return (
        <>
            <Head title="Add New Group" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Add New Group"
                    description="Create a contact group for messaging and operator workflows."
                />

                <GroupForm contacts={contacts} />
            </div>
        </>
    );
}

GroupsCreate.layout = {
    breadcrumbs: [
        { title: 'Groups', href: index() },
        { title: 'Add New Group', href: create() },
    ],
};
