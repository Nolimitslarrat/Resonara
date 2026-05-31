import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { ToggleReadButton } from "./ToggleReadButton";

export const metadata = { title: "Contact Messages | Resonara Publishers Pvt. Ltd." };

export default async function ContactsPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Contact Messages</h1>
          <p className="text-sm text-[var(--muted)]">View and manage enquiries from the contact form.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
            {messages.filter((m) => !m.isRead).length} Unread
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            {messages.filter((m) => m.isRead).length} Read
          </span>
        </div>
      </div>

      <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--surface)] text-[var(--muted)] font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 whitespace-nowrap">Phone</th>
                <th className="px-6 py-4 whitespace-nowrap">Subject</th>
                <th className="px-6 py-4 min-w-[300px]">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <Mail className="w-10 h-10 mb-3 opacity-20" />
                      <p>No messages received yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-[var(--surface)] transition-colors ${!msg.isRead ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-4">
                      <ToggleReadButton id={msg.id} isRead={msg.isRead} />
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] whitespace-nowrap">
                      {format(new Date(msg.createdAt), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--foreground)] whitespace-nowrap">
                      {msg.firstName} {msg.lastName}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] whitespace-nowrap">
                      <a href={`mailto:${msg.email}`} className="hover:text-[var(--brand-600)] hover:underline">
                        {msg.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] whitespace-nowrap">
                      {msg.phone ? (
                        <a href={`tel:${msg.phone}`} className="hover:text-[var(--brand-600)] hover:underline">
                          {msg.phone}
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--foreground)] whitespace-nowrap">
                      {msg.subject}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      <p className="line-clamp-2" title={msg.message}>{msg.message}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
