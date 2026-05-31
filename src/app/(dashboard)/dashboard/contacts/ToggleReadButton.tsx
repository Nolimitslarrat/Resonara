"use client";

import { useTransition } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toggleContactReadStatus } from "@/app/actions/contact";

export function ToggleReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleContactReadStatus(id, isRead))}
      title={isRead ? "Click to mark as Unread" : "Click to mark as Read"}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: isRead ? "#f0fdf4" : "#fffbeb",
        color: isRead ? "#15803d" : "#b45309",
        border: isRead ? "1px solid #bbf7d0" : "1px solid #fde68a",
      }}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isRead ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      {isPending ? "Updating…" : isRead ? "Read" : "Unread"}
    </button>
  );
}
