import { Badge } from '@/components/ui/badge';

const labels: Record<string, string> = {
    assigned: 'Assigned',
    closed: 'Closed',
    escalated: 'Escalated',
    in_progress: 'In Progress',
    new: 'New',
    pending_information: 'Pending Information',
    rejected: 'Rejected',
    resolved: 'Resolved',
};

export default function CaseStatusBadge({ status }: { status: string }) {
    const variant =
        status === 'closed' || status === 'resolved' ? 'secondary' : 'outline';

    return <Badge variant={variant}>{labels[status] ?? status}</Badge>;
}
