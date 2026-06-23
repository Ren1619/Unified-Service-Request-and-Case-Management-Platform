import { Head, Link } from '@inertiajs/react';
import {
    ClipboardList,
    Contact,
    LayoutDashboard,
    Mail,
    Phone,
    ShieldCheck,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { PageHeader, PageShell } from '@/components/page-shell';
import { dashboard } from '@/routes';
import { index as callLogsIndex } from '@/routes/call-logs';
import { index as casesIndex } from '@/routes/cases';
import { index as contactsIndex } from '@/routes/contacts';
import { index as groupsIndex } from '@/routes/groups';
import { inbox as messagesInbox } from '@/routes/messages';
import { index as summaryIndex } from '@/routes/summary';
import { index as usersIndex } from '@/routes/users';

const modules = [
    {
        title: 'Complaints',
        description: 'File, assign, and monitor citizen complaints.',
        href: casesIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Messages',
        description: 'Review SMS inbox, outbox, and sent message queues.',
        href: messagesInbox(),
        icon: Mail,
    },
    {
        title: 'Call Logs',
        description: 'Track operator pickup and call completion events.',
        href: callLogsIndex(),
        icon: Phone,
    },
    {
        title: 'Contacts',
        description: 'Manage people and offices used for coordination.',
        href: contactsIndex(),
        icon: Contact,
    },
    {
        title: 'Groups',
        description: 'Organize contacts into messaging and response clusters.',
        href: groupsIndex(),
        icon: Users,
    },
    {
        title: 'Summary',
        description: 'Review audit counts and recent complaint activity.',
        href: summaryIndex(),
        icon: ShieldCheck,
    },
    {
        title: 'User Management',
        description: 'Review accounts and role assignments.',
        href: usersIndex(),
        icon: LayoutDashboard,
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <PageShell>
                <PageHeader>
                    <Heading
                        title="Dashboard"
                        description="Start common operator workflows and monitor the modules that support citizen service handling."
                    />
                </PageHeader>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {modules.map((module) => (
                        <Link
                            key={module.title}
                            href={module.href}
                            prefetch
                            className="group rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-muted/35"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <module.icon
                                        aria-hidden
                                        className="size-5"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-semibold">
                                        {module.title}
                                    </h2>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {module.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </PageShell>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
