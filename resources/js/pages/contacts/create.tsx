import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { create, index } from '@/routes/contacts';
import type { ContactGroupSummary, ContactRegionSummary } from '@/types';
import ContactForm from './contact-form';

export default function ContactsCreate({
    groups,
    regions,
}: {
    groups: ContactGroupSummary[];
    regions: ContactRegionSummary[];
}) {
    return (
        <>
            <Head title="Add New Contact" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Add New Contact"
                    description="Create a contact that can be used for messaging, call lookup, and group membership."
                />

                <ContactForm groups={groups} regions={regions} />
            </div>
        </>
    );
}

ContactsCreate.layout = {
    breadcrumbs: [
        { title: 'Contacts', href: index() },
        { title: 'Add New Contact', href: create() },
    ],
};
