"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Folder, Home, User } from "lucide-react";
import { ThreeSidebarBackground } from "./three-sidebar-background";
import { useSession } from "next-auth/react";
import { getAllGroups } from "@/lib/todo-service";
import { taskGroup } from "@/lib/types";

export function AppSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [groups, setGroups] = useState<taskGroup[]>([]);

    useEffect(() => {
        if (status !== "authenticated") {
            return;
        }

        let isMounted = true;

        const fetchGroups = async () => {
            try {
                const data = await getAllGroups(session?.accessToken);
                if (isMounted) {
                    setGroups(data);
                }
            } catch (error) {
                console.error("Failed to load sidebar groups:", error);
                if (isMounted) {
                    setGroups([]);
                }
            }
        };

        fetchGroups();

        return () => {
            isMounted = false;
        };
    }, [session?.accessToken, status]);

    const activeCollection = searchParams.get("collection");
    const isTaskRoute = pathname === "/task";

    const collectionItems = useMemo(() => {
        return [
            {
                id: "general",
                label: "General",
                href: "/task?collection=general",
                isActive: isTaskRoute && activeCollection === "general",
            },
            ...groups.map((group) => ({
                id: group.id,
                label: group.name,
                href: `/task?collection=${encodeURIComponent(group.id)}`,
                isActive: isTaskRoute && activeCollection === group.id,
            })),
        ];
    }, [activeCollection, groups, isTaskRoute]);

    return (
        <Sidebar variant="sidebar" className="text-slate-100">
            <ThreeSidebarBackground />
            <SidebarContent className="relative z-10">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-300/90">Application</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/task"}
                                    className="text-slate-100 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/15 data-[active=true]:text-white"
                                >
                                    <Link href="/task">
                                        <Home />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/profile"}
                                    className="text-slate-100 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/15 data-[active=true]:text-white"
                                >
                                    <Link href="/profile">
                                        <User />
                                        <span>Profile</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-300/90">Collection</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <div className="max-h-[22rem] overflow-y-auto pr-1">
                            <SidebarMenu>
                                {collectionItems.length === 1 && status === "loading" ? (
                                    <SidebarMenuItem>
                                        <div className="px-2 py-1 text-sm text-slate-300/70">
                                            Loading collections...
                                        </div>
                                    </SidebarMenuItem>
                                ) : (
                                    collectionItems.map((item) => (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.isActive}
                                                className="text-slate-100 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/15 data-[active=true]:text-white"
                                            >
                                                <Link href={item.href}>
                                                    <Folder className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                )}
                            </SidebarMenu>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
