"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ResetPasswordContent } from "@/app/auth/reset-password/page";

export default function ResetPasswordAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-800" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
