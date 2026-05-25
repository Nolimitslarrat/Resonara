"use client";

import { Search } from "lucide-react";
import { Input } from "./input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchInput({
  placeholder = "Search...",
  extraParams,
}: {
  placeholder?: string;
  extraParams?: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      // Merge any extra params (e.g. tab=published) into the new URL
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => params.set(k, v));
      }
      if (val) {
        params.set("q", val);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input 
        value={value}
        onChange={handleSearch}
        placeholder={placeholder} 
        className="pl-9 bg-white" 
      />
      {isPending && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-300 border-t-[var(--brand-600)] animate-spin" />}
    </div>
  );
}
