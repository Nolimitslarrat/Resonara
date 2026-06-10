"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { softDeleteUser } from "@/app/actions/user";

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Deactivate ${userName}? They will no longer be able to access the platform.`)) return;
    setPending(true);
    const result = await softDeleteUser(userId);
    setPending(false);

    if (!result.success) {
      alert(result.error || "Failed to deactivate user.");
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
      title="Deactivate user"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
