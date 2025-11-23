"use client";

import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-provider";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  );
}