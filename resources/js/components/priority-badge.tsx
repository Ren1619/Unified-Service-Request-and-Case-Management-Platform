import { Badge } from '@/components/ui/badge';

const labels: Record<string, string> = {
    critical: 'Critical',
    high: 'High',
    low: 'Low',
    medium: 'Medium',
};

export default function PriorityBadge({ priority }: { priority: string }) {
    return <Badge variant="outline">{labels[priority] ?? priority}</Badge>;
}
