import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { edit, index, show } from '@/routes/contacts';
import type {
    Contact,
    ContactGroupSummary,
    ContactRegionSummary,
} from '@/types';
import ContactForm from './contact-form';

export default function ContactsEdit({
    contact,
    groups,
    regions,
}: {
    contact: Contact;
    groups: ContactGroupSummary[];
    regions: ContactRegionSummary[];
}) {
    return (
        <>
            <Head title={`Edit ${contact.name}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit contact"
                    description="Update contact information and group membership."
                />

                <ContactForm
                    contact={contact}
                    groups={groups}
                    regions={regions}
                />
            </div>
        </>
    );
}

ContactsEdit.layout = (props: { contact: Contact }) => ({
    breadcrumbs: [
        { title: 'Contacts', href: index() },
        { title: props.contact.name, href: show(props.contact.id) },
        { title: 'Edit', href: edit(props.contact.id) },
    ],
});
