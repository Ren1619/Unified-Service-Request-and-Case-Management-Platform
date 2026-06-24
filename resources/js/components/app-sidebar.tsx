import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    Contact,
    FolderGit2,
    Inbox,
    LayoutGrid,
    Mail,
    MapPinned,
    Phone,
    Send,
    ShieldCheck,
    UserPlus,
    Users,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as callLogsIndex } from '@/routes/call-logs';
import { index as casesIndex } from '@/routes/cases';
import { index as contactsIndex, create as contactsCreate } from '@/routes/contacts';
import { index as groupsIndex } from '@/routes/groups';
import { cluster as groupsCluster } from '@/routes/groups';
import {
    inbox as messagesInbox,
    outbox as messagesOutbox,
    send as messagesSend,
    sent as messagesSent,
} from '@/routes/messages';
import { index as regionsIndex } from '@/routes/regions';
import { index as summaryIndex } from '@/routes/summary';
import { index as usersIndex } from '@/routes/users';
import type { NavItem, NavSection } from '@/types';

const mainNavSections: NavSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Summary',
                href: summaryIndex(),
                icon: ShieldCheck,
            },
        ],
    },
    {
        label: 'Complaints',
        items: [
            {
                title: 'Complaints',
                href: casesIndex(),
                icon: ClipboardList,
            },
        ],
    },
    {
        label: 'SMS',
        items: [
            {
                title: 'Messages',
                href: messagesInbox(),
                icon: Mail,
                children: [
                    {
                        title: 'Send Message',
                        href: messagesSend(),
                        icon: Send,
                    },
                    {
                        title: 'Inbox',
                        href: messagesInbox(),
                        icon: Inbox,
                    },
                    {
                        title: 'Sent Messages',
                        href: messagesSent(),
                        icon: Send,
                    },
                    {
                        title: 'Outbox',
                        href: messagesOutbox(),
                        icon: Mail,
                    },
                ],
            },
        ],
    },
    {
        label: 'Call Logs',
        items: [
            {
                title: 'Call Logs',
                href: callLogsIndex(),
                icon: Phone,
                children: [
                    {
                        title: 'Call Logs',
                        href: callLogsIndex(),
                        icon: Phone,
                    },
                ],
            },
        ],
    },
    {
        label: 'Contacts',
        items: [
            {
                title: 'Contacts',
                href: contactsIndex(),
                icon: Contact,
                children: [
                    {
                        title: 'Add New Contact',
                        href: contactsCreate(),
                        icon: UserPlus,
                    },
                    {
                        title: 'Contact List',
                        href: contactsIndex(),
                        icon: UsersRound,
                    },
                ],
            },
        ],
    },
    {
        label: 'Groups',
        items: [
            {
                title: 'Groups',
                href: groupsIndex(),
                icon: Users,
                children: [
                    {
                        title: 'Groups List',
                        href: groupsIndex(),
                        icon: UsersRound,
                    },
                    {
                        title: 'Cluster',
                        href: groupsCluster(),
                        icon: Users,
                    },
                ],
            },
        ],
    },
    {
        label: 'Administration',
        items: [
            {
                title: 'User Management',
                href: usersIndex(),
                icon: UsersRound,
            },
            {
                title: 'Regions',
                href: regionsIndex(),
                icon: MapPinned,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { isMobile, setOpenMobile } = useSidebar();

    function closeMobileNavigation() {
        if (isMobile) {
            setOpenMobile(false);
        }
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard()}
                                onClick={closeMobileNavigation}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain sections={mainNavSections} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
