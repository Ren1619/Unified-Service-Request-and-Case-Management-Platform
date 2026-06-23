import { Form } from '@inertiajs/react';
import CaseController from '@/actions/App/Http/Controllers/CaseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CaseFormOptions, ServiceCase } from '@/types';

type CaseFormProps = {
    caseRecord?: ServiceCase;
    options: CaseFormOptions;
};

export default function CaseForm({ caseRecord, options }: CaseFormProps) {
    const action = caseRecord
        ? CaseController.update.form(caseRecord.id)
        : CaseController.store.form();

    return (
        <Form {...action} className="max-w-5xl space-y-6">
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={caseRecord?.title}
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="complaint_type_id">
                                Complaint type
                            </Label>
                            <select
                                id="complaint_type_id"
                                name="complaint_type_id"
                                defaultValue={caseRecord?.complaint_type_id}
                                required
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select complaint type</option>
                                {options.complaintTypes.map((complaintType) => (
                                    <option
                                        key={complaintType.id}
                                        value={complaintType.id}
                                    >
                                        {complaintType.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.complaint_type_id} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={caseRecord?.description ?? ''}
                            rows={5}
                            required
                            className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="region_id">Region</Label>
                            <select
                                id="region_id"
                                name="region_id"
                                defaultValue={caseRecord?.region_id}
                                required
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select region</option>
                                {options.regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.code} - {region.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.region_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <select
                                id="priority"
                                name="priority"
                                defaultValue={caseRecord?.priority ?? 'medium'}
                                required
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                {options.priorities.map((priority) => (
                                    <option
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.priority} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="channel">Channel</Label>
                            <select
                                id="channel"
                                name="channel"
                                defaultValue={
                                    caseRecord?.channel ?? 'self_service'
                                }
                                required
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                {options.channels.map((channel) => (
                                    <option
                                        key={channel.value}
                                        value={channel.value}
                                    >
                                        {channel.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.channel} />
                        </div>

                        {caseRecord && (
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={caseRecord.status}
                                    required
                                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    {options.statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="submitted_by">Submitted by</Label>
                            <select
                                id="submitted_by"
                                name="submitted_by"
                                defaultValue={caseRecord?.submitted_by ?? ''}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Current user</option>
                                {options.submitters.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.submitted_by} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="assigned_to">Assigned to</Label>
                            <select
                                id="assigned_to"
                                name="assigned_to"
                                defaultValue={caseRecord?.assigned_to ?? ''}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Unassigned</option>
                                {options.assignees.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.assigned_to} />
                        </div>
                    </div>

                    {caseRecord && (
                        <div className="grid gap-2">
                            <Label htmlFor="resolution_notes">
                                Resolution notes
                            </Label>
                            <textarea
                                id="resolution_notes"
                                name="resolution_notes"
                                defaultValue={
                                    caseRecord.resolution_notes ?? ''
                                }
                                rows={4}
                                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.resolution_notes} />
                        </div>
                    )}

                    <Button disabled={processing}>
                        {caseRecord ? 'Save changes' : 'Create case'}
                    </Button>
                </>
            )}
        </Form>
    );
}
