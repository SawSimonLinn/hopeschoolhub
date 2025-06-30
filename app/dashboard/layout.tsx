
"use client";

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarSeparator } from "@/components/ui/sidebar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GraduationCap, LayoutDashboard, Users, UserPlus, Briefcase, LogOut, Menu, Settings as SettingsIcon, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser, getCurrentUser, getProfilePicUrl, isGuest as checkIsGuest, isAdmin as checkIsAdmin } from "@/lib/authService"; 
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import React, { useEffect, useState } from "react"; 

const allNavItemsConfig = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, main: true, adminOnly: false },
  { href: "/dashboard/applications", label: "Applications", icon: FileCheck2, main: true, adminOnly: true },
  { href: "/dashboard/students", label: "Students", icon: Users, main: true, adminOnly: false },
  { href: "/dashboard/students/add", label: "Add Student", icon: UserPlus, main: true, adminOnly: true },
  { href: "/dashboard/teachers", label: "Teachers", icon: Briefcase, main: true, adminOnly: false },
  { href: "/dashboard/teachers/add", label: "Add Teacher", icon: UserPlus, main: true, adminOnly: true },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, main: false, adminOnly: true },
];

const ADMIN_DEFAULT_AVATAR = "https://avatars.githubusercontent.com/u/150866883?v=4";
const GUEST_DEFAULT_AVATAR = "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCheckingAuth } = useAuthRedirect();
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setProfilePic(getProfilePicUrl());
    setIsGuest(checkIsGuest());
    setIsAdmin(checkIsAdmin());
  }, [pathname]); 
  
  const handleLogout = () => {
    logoutUser();
    router.push("/login");
    router.refresh();
  };
  
  if (isCheckingAuth) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  const mainNavItems = allNavItemsConfig.filter(item => item.main && (!item.adminOnly || isAdmin));
  const settingsNavItem = allNavItemsConfig.find(item => !item.main && item.href === "/dashboard/settings" && (!item.adminOnly || isAdmin));

  const getAvatarSrc = () => {
    if (profilePic) return profilePic;
    if (isGuest) return GUEST_DEFAULT_AVATAR;
    if (isAdmin) return ADMIN_DEFAULT_AVATAR;
    return "https://placehold.co/100x100.png"; // Fallback placeholder
  };

  const getAvatarHint = () => {
    if (isGuest) return "guest avatar";
    if (isAdmin) return "admin avatar";
    return "user avatar";
  }


  const SidebarNavigation = () => (
    <>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-headline font-semibold text-foreground group-data-[collapsible=icon]:hidden">HopeSchoolHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2 flex flex-col">
        <SidebarMenu className="flex-grow">
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{children: item.label, side:'right', className: 'font-body'}}
                  className="font-body"
                >
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {settingsNavItem && (
          <div className="mt-auto">
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem key={settingsNavItem.href}>
                <Link href={settingsNavItem.href}>
                  <SidebarMenuButton
                    isActive={pathname === settingsNavItem.href}
                    tooltip={{children: settingsNavItem.label, side:'right', className: 'font-body'}}
                    className="font-body"
                  >
                    <settingsNavItem.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{settingsNavItem.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>
    </>
  );
  
  const currentNavLink = allNavItemsConfig.find(item => 
    (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) &&
    (!item.adminOnly || isAdmin)
  );


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" collapsible="icon" variant="sidebar" className="border-r">
         <SidebarNavigation />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 md:px-8">
          <div className="md:hidden">
             <SidebarTrigger className="h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SidebarTrigger>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold font-headline">
              {currentNavLink?.label || "Dashboard"}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage 
                      src={getAvatarSrc()} 
                      alt={currentUser || (isGuest ? "Guest" : "Admin")} 
                      data-ai-hint={getAvatarHint()}
                    />
                    <AvatarFallback>{currentUser ? currentUser.substring(0,2).toUpperCase() : (isGuest ? 'GU' : 'AD')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{isGuest ? "Guest User" : (currentUser || "Admin User")}</p>
                    {!isGuest && <p className="text-xs leading-none text-muted-foreground">{currentUser ? `${currentUser.toLowerCase()}@example.com` : 'admin@example.com'}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isGuest && settingsNavItem && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center cursor-pointer w-full">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isGuest ? "Exit Guest Mode" : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
