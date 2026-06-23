import { Form } from '@inertiajs/react';
import ComplaintTypeController from '@/actions/App/Http/Controllers/ComplaintTypeController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ComplaintType } from '@/types';

type ComplaintTypeFormProps = {
    complaintType?: ComplaintType;
};

export default function ComplaintTypeForm({
    complaintType,
}: ComplaintTypeFormProps) {
    const action = complaintType
        ? ComplaintTypeController.update.form(complaintType.id)
        : ComplaintTypeController.store.form();

    return (
        <Form {...action} className="max-w-3xl space-y-6">
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={complaintType?.name}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={complaintType?.description ?? ''}
                            rows={5}
                            className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_active">Status</Label>
                        <select
                            id="is_active"
                            name="is_active"
                            defaultValue={
                                complaintType?.is_active === false ? '0' : '1'
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-64"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <InputError message={errors.is_active} />
                    </div>

                    <Button disabled={processing}>
                        {complaintType
                            ? 'Save changes'
                            : 'Create complaint type'}
                    </Button>
                </>
            )}
        </Form>
    );
}
