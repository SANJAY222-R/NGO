"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallbackUrl = "/" }: { fallbackUrl?: string }) {
  const router = useRouter();

  return (
    <Button 
      variant="ghost" 
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      }} 
      className="flex items-center gap-2 pl-0 hover:bg-transparent hover:text-emerald-600 transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
}
