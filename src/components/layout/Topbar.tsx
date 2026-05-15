"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Bell, Sun, Moon, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
    href: "/" + parts.slice(0, i + 1).join("/"),
  }));
  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--muted-foreground)]" />}
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-[var(--foreground)]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors capitalize">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Topbar({ unreadCount = 0 }: { unreadCount?: number }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex-shrink-0">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search hint */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm text-[var(--muted)] hover:border-[var(--brand-500)] hover:text-[var(--foreground)] transition-all">
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="text-[10px] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <Link href="/dashboard/notifications" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-600)]" />
          )}
        </Link>

        {/* Theme */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Avatar */}
        <Link href="/dashboard/settings">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </Link>
      </div>
    </header>
  );
}
