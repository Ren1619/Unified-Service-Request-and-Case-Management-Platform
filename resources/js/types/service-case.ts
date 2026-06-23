import type { AccessUser } from './access';
import type { ComplaintType } from './complaint-type';
import type { Region } from './region';

export type SelectOption = {
    value: string;
    label: string;
};

export type UserOption = {
    id: number;
    name: string;
    email: string;
};

export type RegionOption = {
    id: number;
    code: string;
    name: string;
};

export type CaseTimeline = {
    id: number;
    event: string;
    description: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    creator: AccessUser | null;
    created_at: string | null;
};

export type ServiceCase = {
    id: number;
    case_number: string;
    title: string;
    description: string;
    complaint_type_id: number;
    complaint_type?: Pick<ComplaintType, 'id' | 'name'>;
    channel: string;
    priority: string;
    status: string;
    region_id: number;
    region?: Pick<Region, 'id' | 'code' | 'name'>;
    submitted_by: number | null;
    submitter?: UserOption | null;
    assigned_to: number | null;
    assignee?: UserOption | null;
    created_by_agent: number | null;
    agent?: UserOption | null;
    escalation_level: number;
    due_date: string | null;
    closed_at: string | null;
    resolution_notes: string | null;
    created_at: string | null;
    updated_at: string | null;
    timelines?: CaseTimeline[];
};

export type CaseFormOptions = {
    assignees: UserOption[];
    channels: SelectOption[];
    complaintTypes: Array<Pick<ComplaintType, 'id' | 'name'>>;
    priorities: SelectOption[];
    regions: RegionOption[];
    statuses: SelectOption[];
    submitters: UserOption[];
};
