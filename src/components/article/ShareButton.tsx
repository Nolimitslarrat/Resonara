"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try native share sheet first (mobile / supported browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: prompt
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-[var(--border)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full px-6 py-6 font-semibold shadow-sm transition-all"
      onClick={handleShare}
      aria-label="Share article"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 mr-2 text-green-600" />
          <span className="text-green-600">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 mr-2" /> Share
        </>
      )}
    </Button>
  );
}
