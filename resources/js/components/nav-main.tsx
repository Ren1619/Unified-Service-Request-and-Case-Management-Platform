import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem, NavSection } from '@/types';

type NavMainProps = {
    items?: NavItem[];
    sections?: NavSection[];
};

export function NavMain({ items = [], sections }: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const navigationSections = sections ?? [{ label: 'Platform', items }];

    function isItemActive(item: NavItem): boolean {
        return (
            isCurrentUrl(item.href) ||
            (item.children?.some((child) => isCurrentUrl(child.href)) ?? false)
        );
    }

    return (
        <>
            {navigationSections.map((section, index) => (
                <SidebarGroup key={section.label ?? index} className="px-2 py-0">
                    {section.label && (
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                    )}
                    <SidebarMenu>
                        {section.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.children?.length ? (
                                    <Collapsible
                                        defaultOpen={isItemActive(item)}
                                        className="group/collapsible"
                                    >
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                isActive={isItemActive(item)}
                                                tooltip={{ children: item.title }}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight
                                                    aria-hidden
                                                    className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.children.map((child) => (
                                                    <SidebarMenuSubItem
                                                        key={child.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isCurrentUrl(
                                                                child.href,
                                                            )}
                                                        >
                                                            <Link
                                                                href={child.href}
                                                                prefetch
                                                            >
                                                                {child.icon && (
                                                                    <child.icon />
                                                                )}
                                                                <span>
                                                                    {child.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
