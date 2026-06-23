import { Form } from '@inertiajs/react';
import ContactGroupController from '@/actions/App/Http/Controllers/ContactGroupController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Contact, ContactGroup } from '@/types';

type GroupFormProps = {
    group?: ContactGroup;
    contacts: Contact[];
};

export default function GroupForm({ group, contacts }: GroupFormProps) {
    const action = group
        ? ContactGroupController.update.form(group.id)
        : ContactGroupController.store.form();
    const selectedContactIds = new Set(
        group?.contacts?.map((contact) => contact.id) ?? [],
    );

    return (
        <Form {...action} className="mx-auto w-full max-w-4xl space-y-6">
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={group?.name}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={group?.description ?? ''}
                            rows={4}
                            className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_active">Status</Label>
                        <select
                            id="is_active"
                            name="is_active"
                            defaultValue={group?.is_active === false ? '0' : '1'}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-64"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <InputError message={errors.is_active} />
                    </div>

                    <fieldset className="space-y-3 rounded-lg border p-4">
                        <legend className="px-1 text-sm font-medium">
                            Contacts
                        </legend>
                        <div className="grid gap-3 md:grid-cols-2">
                            {contacts.map((contact) => (
                                <label
                                    key={contact.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="contact_ids[]"
                                        value={contact.id}
                                        defaultChecked={selectedContactIds.has(
                                            contact.id,
                                        )}
                                        className="size-4 rounded border-input"
                                    />
                                    <span>{contact.name}</span>
                                </label>
                            ))}
                            {contacts.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No active contacts are available.
                                </p>
                            )}
                        </div>
                        <InputError message={errors.contact_ids} />
                    </fieldset>

                    <Button disabled={processing}>
                        {group ? 'Save changes' : 'Create group'}
                    </Button>
                </>
            )}
        </Form>
    );
}
