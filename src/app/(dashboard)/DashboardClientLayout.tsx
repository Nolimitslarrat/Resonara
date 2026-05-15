"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import React, { useState } from "react";

export function DashboardClientLayout({ 
  children,
  unreadCount = 0 
}: { 
  children: React.ReactNode,
  unreadCount?: number
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar - Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar mobileOpen={isMobileMenuOpen} setMobileOpen={setIsMobileMenuOpen} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar unreadCount={unreadCount} onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
