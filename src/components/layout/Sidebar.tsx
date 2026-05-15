"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard, FileText, BookOpen, Users, BarChart3,
  Settings, Bell, Star, ClipboardList, Layers, Printer,
  Hash, ChevronLeft, ChevronRight, LogOut, UserCircle,
  PenLine, Shield, Activity
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",      href: "/dashboard",              icon: LayoutDashboard, roles: ["SUPER_ADMIN", "MANAGING_EDITOR", "REVIEWER", "AUTHOR", "PRODUCTION"] },
  { label: "Manuscripts",    href: "/dashboard/manuscripts",  icon: FileText,         roles: ["SUPER_ADMIN", "MANAGING_EDITOR", "AUTHOR"] },
  { label: "Submit",         href: "/dashboard/manuscripts/submit", icon: PenLine,   roles: ["AUTHOR"] },
  { label: "My Reviews",     href: "/dashboard/reviews",      icon: Star,             roles: ["REVIEWER"] },
  { label: "Editorial",      href: "/dashboard/editorial",    icon: ClipboardList,    roles: ["SUPER_ADMIN", "MANAGING_EDITOR"] },
  { label: "Reviewers",      href: "/dashboard/reviewers",    icon: Users,            roles: ["SUPER_ADMIN", "MANAGING_EDITOR"] },
  { label: "Production",     href: "/dashboard/production",   icon: Printer,          roles: ["SUPER_ADMIN", "PRODUCTION"] },
  { label: "Issues",         href: "/dashboard/issues",       icon: Layers,           roles: ["SUPER_ADMIN", "PRODUCTION"] },
  { label: "DOI Manager",    href: "/dashboard/doi",          icon: Hash,             roles: ["SUPER_ADMIN", "PRODUCTION"] },
  { label: "Journals",       href: "/dashboard/journals",     icon: BookOpen,         roles: ["SUPER_ADMIN", "MANAGING_EDITOR"] },
  { label: "Users",          href: "/dashboard/users",        icon: Shield,           roles: ["SUPER_ADMIN"] },
  { label: "Analytics",      href: "/dashboard/analytics",    icon: BarChart3,        roles: ["SUPER_ADMIN", "MANAGING_EDITOR"] },
  { label: "Activity Logs",  href: "/dashboard/logs",         icon: Activity,         roles: ["SUPER_ADMIN"] },
  { label: "Notifications",  href: "/dashboard/notifications",icon: Bell,             roles: ["SUPER_ADMIN", "MANAGING_EDITOR", "REVIEWER", "AUTHOR", "PRODUCTION"] },
  { label: "Settings",       href: "/dashboard/settings",     icon: Settings,         roles: ["SUPER_ADMIN"] },
];

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  MANAGING_EDITOR: "Managing Editor",
  REVIEWER: "Reviewer",
  AUTHOR: "Author",
  PRODUCTION: "Production",
};

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-[var(--brand-600)]",
  MANAGING_EDITOR: "bg-purple-600",
  REVIEWER: "bg-amber-500",
  AUTHOR: "bg-emerald-600",
  PRODUCTION: "bg-cyan-600",
};

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const role = session?.user?.role as Role | undefined;

  const visibleItems = NAV_ITEMS.filter((item) => role && item.roles.includes(role));

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-[var(--surface-elevated)] border-r border-[var(--border)] sidebar-transition flex-shrink-0",
        collapsed ? "w-[68px]" : "w-[256px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]", collapsed && "justify-center px-0")}>
        <div className={cn("relative flex items-center justify-center flex-shrink-0 transition-all", collapsed ? "w-8 h-8" : "w-full h-12")}>
          <img src="/logo.png" alt="Resonara Logo" className={cn("object-contain", collapsed ? "w-8 h-8" : "w-full h-full")} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[var(--brand-600)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]",
                collapsed && "justify-center px-0 w-10 h-10 mx-auto"
              )}
            >
              <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto text-xs bg-[var(--brand-500)] text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn("border-t border-[var(--border)] p-3", collapsed && "flex flex-col items-center gap-2")}>
        {!collapsed && session?.user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--surface)] transition-colors mb-1">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0", ROLE_COLORS[role!] ?? "bg-zinc-600")}>
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{session.user.name}</p>
              <p className="text-[10px] text-[var(--muted)] truncate">{ROLE_LABELS[role!]}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
          className={cn(
            "flex items-center gap-2 text-xs text-[var(--muted)] hover:text-red-500 transition-colors px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full",
            collapsed && "justify-center w-10 h-10 px-0"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
