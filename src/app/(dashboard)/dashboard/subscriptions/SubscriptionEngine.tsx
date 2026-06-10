"use client";

import { useState } from "react";
import { CalendarDays, Loader2, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSubscriptionAccess, revokeSubscriptionAccess, updateSubscriptionAccess } from "@/app/actions/subscription";
import { formatDate } from "@/lib/utils";

type UserOption = { id: string; name: string; email: string; role: string };
type JournalOption = { id: string; title: string };
type ArticleOption = { id: string; manuscriptId: string; manuscript: { title: string; journal: { title: string } } };
type SubscriptionItem = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  notes: string | null;
  isActive: boolean;
  user: { name: string; email: string };
  journal: { title: string } | null;
  article: { manuscript: { title: string; journal: { title: string } } } | null;
};

export function SubscriptionEngine({
  users,
  journals,
  articles,
  subscriptions,
}: {
  users: UserOption[];
  journals: JournalOption[];
  articles: ArticleOption[];
  subscriptions: SubscriptionItem[];
}) {
  const [accessType, setAccessType] = useState("ARTICLE");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setPending(true);
    setMessage(null);
    formData.set("accessType", accessType);
    const result = await createSubscriptionAccess(formData);
    setPending(false);
    setMessage(result.success ? "Subscription access granted." : result.error || "Failed to grant access.");
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this subscription access?")) return;
    setPending(true);
    const result = await revokeSubscriptionAccess(id);
    setPending(false);
    if (!result.success) alert(result.error || "Failed to revoke access.");
  }

  async function handleQuickExtend(id: string, startsAt: Date, days: number) {
    const formData = new FormData();
    formData.set("startsAt", startsAt.toISOString().slice(0, 10));
    const next = new Date();
    next.setDate(next.getDate() + days);
    formData.set("endsAt", next.toISOString().slice(0, 10));
    formData.set("isActive", "true");
    formData.set("notes", "");
    setPending(true);
    const result = await updateSubscriptionAccess(id, formData);
    setPending(false);
    if (!result.success) alert(result.error || "Failed to update access.");
  }

  return (
    <div className="space-y-8">
      <form action={handleCreate} className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">Grant Subscription Access</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Assign paid access to an article or full journal for a defined period.</p>
          </div>
          <Button type="submit" disabled={pending} className="gap-2">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Grant Access
          </Button>
        </div>

        {message && (
          <div className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-[var(--foreground)]">
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Subscriber</label>
            <select name="userId" required className="w-full h-10 rounded-lg border border-[var(--border)] px-3 text-sm">
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} - {user.email} ({user.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Access Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["ARTICLE", "JOURNAL"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccessType(type)}
                  className={`h-10 rounded-lg border text-sm font-semibold ${accessType === type ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]" : "bg-white text-slate-600 border-[var(--border)]"}`}
                >
                  {type === "ARTICLE" ? "Article" : "Journal"}
                </button>
              ))}
            </div>
          </div>

          {accessType === "ARTICLE" ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Article</label>
              <select name="articleId" className="w-full h-10 rounded-lg border border-[var(--border)] px-3 text-sm">
                <option value="">Select article</option>
                {articles.map((article) => (
                  <option key={article.id} value={article.id}>{article.manuscript.title} - {article.manuscript.journal.title}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Journal</label>
              <select name="journalId" className="w-full h-10 rounded-lg border border-[var(--border)] px-3 text-sm">
                <option value="">Select journal</option>
                {journals.map((journal) => (
                  <option key={journal.id} value={journal.id}>{journal.title}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Starts At</label>
            <Input name="startsAt" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Ends At</label>
            <Input name="endsAt" type="date" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Internal Notes</label>
            <Input name="notes" placeholder="Payment reference, plan name, or admin note" />
          </div>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-slate-50">
          <h2 className="text-base font-bold text-[var(--foreground)]">Active Subscription Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 border-b border-[var(--border)]">
                {["Subscriber", "Access", "Window", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {subscriptions.map((sub) => {
                const title = sub.article?.manuscript.title || sub.journal?.title || "Subscription";
                const scope = sub.article ? `Article - ${sub.article.manuscript.journal.title}` : "Journal";
                const expired = sub.endsAt < new Date();
                return (
                  <tr key={sub.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--foreground)]">{sub.user.name}</p>
                      <p className="text-xs text-[var(--muted)]">{sub.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--foreground)] line-clamp-1 max-w-[320px]">{title}</p>
                      <p className="text-xs text-[var(--muted)]">{scope}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(sub.startsAt)} to {formatDate(sub.endsAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${sub.isActive && !expired ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {sub.isActive && !expired ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" disabled={pending} onClick={() => handleQuickExtend(sub.id, sub.startsAt, 30)}>30d</Button>
                        <Button size="sm" variant="outline" disabled={pending} onClick={() => handleQuickExtend(sub.id, sub.startsAt, 365)}>1y</Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => handleRevoke(sub.id)} className="text-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--muted)]">No subscription access assigned yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
