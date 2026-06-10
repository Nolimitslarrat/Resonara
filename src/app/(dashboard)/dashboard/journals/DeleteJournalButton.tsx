"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteJournal } from "@/app/actions/journal";

export function DeleteJournalButton({ journalId, journalTitle }: { journalId: string; journalTitle: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${journalTitle}"? This is only allowed when no manuscripts or issues are linked.`)) return;
    setPending(true);
    const result = await deleteJournal(journalId);
    setPending(false);

    if (!result.success) {
      alert(result.error || "Failed to delete journal.");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      title="Delete journal"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
