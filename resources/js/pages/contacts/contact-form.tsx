import { Form } from '@inertiajs/react';
import ContactController from '@/actions/App/Http/Controllers/ContactController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Contact,
    ContactGroupSummary,
    ContactRegionSummary,
} from '@/types';

type ContactFormProps = {
    contact?: Contact;
    groups: ContactGroupSummary[];
    regions: ContactRegionSummary[];
};

export default function ContactForm({
    contact,
    groups,
    regions,
}: ContactFormProps) {
    const action = contact
        ? ContactController.update.form(contact.id)
        : ContactController.store.form();
    const selectedGroupIds = new Set(
        contact?.groups?.map((group) => group.id) ?? [],
    );

    return (
        <Form
            {...action}
            className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-6"
        >
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={contact?.name}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={contact?.email ?? ''}
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="mobile_number">Mobile number</Label>
                            <Input
                                id="mobile_number"
                                name="mobile_number"
                                defaultValue={contact?.mobile_number ?? ''}
                            />
                            <InputError message={errors.mobile_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone number</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                defaultValue={contact?.phone_number ?? ''}
                            />
                            <InputError message={errors.phone_number} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="organization">Organization</Label>
                            <Input
                                id="organization"
                                name="organization"
                                defaultValue={contact?.organization ?? ''}
                            />
                            <InputError message={errors.organization} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                name="position"
                                defaultValue={contact?.position ?? ''}
                            />
                            <InputError message={errors.position} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="region_id">Region</Label>
                        <select
                            id="region_id"
                            name="region_id"
                            defaultValue={contact?.region_id ?? ''}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-80"
                        >
                            <option value="">No region assigned</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.code} - {region.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.region_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            name="notes"
                            defaultValue={contact?.notes ?? ''}
                            rows={4}
                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:min-h-28"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_active">Status</Label>
                        <select
                            id="is_active"
                            name="is_active"
                            defaultValue={
                                contact?.is_active === false ? '0' : '1'
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-64"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <InputError message={errors.is_active} />
                    </div>

                    <fieldset className="space-y-3 rounded-lg border p-3 sm:p-4">
                        <legend className="px-1 text-sm font-medium">
                            Groups
                        </legend>
                        <div className="grid gap-3 md:grid-cols-2">
                            {groups.map((group) => (
                                <label
                                    key={group.id}
                                    className="flex min-w-0 items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="group_ids[]"
                                        value={group.id}
                                        defaultChecked={selectedGroupIds.has(
                                            group.id,
                                        )}
                                        className="size-4 rounded border-input"
                                    />
                                    <span className="min-w-0 break-words">
                                        {group.name}
                                    </span>
                                </label>
                            ))}
                            {groups.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No active groups are available.
                                </p>
                            )}
                        </div>
                        <InputError message={errors.group_ids} />
                    </fieldset>

                    <Button disabled={processing} className="w-full sm:w-auto">
                        {contact ? 'Save changes' : 'Create contact'}
                    </Button>
                </>
            )}
        </Form>
    );
}
