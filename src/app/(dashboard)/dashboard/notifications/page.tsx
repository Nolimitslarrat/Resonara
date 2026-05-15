import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bell, CheckCheck, BookOpen, Star, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Notifications | NexScholar" };

const ICON_MAP: Record<string, React.ElementType> = {
  SUBMISSION_RECEIVED: FileText,
  REVIEW_INVITED: Star,
  REVIEW_ACCEPTED: Star,
  REVIEW_DECLINED: Star,
  REVIEW_COMPLETED: CheckCheck,
  DECISION_MADE: ChevronRight,
  REVISION_REQUESTED: FileText,
  REVISION_SUBMITTED: FileText,
  ARTICLE_PUBLISHED: BookOpen,
  GENERAL: Bell,
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <form>
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No notifications yet</p>
            <p className="text-sm text-slate-500 mt-1">
              You&apos;ll be notified here when something needs your attention.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {notifications.map((notification) => {
              const Icon = ICON_MAP[notification.type] ?? Bell;
              return (
                <li
                  key={notification.id}
                  className={`flex items-start gap-4 px-6 py-5 hover:bg-[var(--surface)] transition-colors ${
                    !notification.read ? "bg-[var(--brand-50)]/40" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !notification.read ? "bg-[var(--brand-600)]" : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${!notification.read ? "text-white" : "text-slate-500"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        !notification.read ? "text-[var(--foreground)]" : "text-slate-700"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-2">{timeAgo(notification.createdAt)}</p>
                  </div>
                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="flex-shrink-0 text-xs text-[var(--brand-600)] font-semibold hover:underline mt-1"
                    >
                      View →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
