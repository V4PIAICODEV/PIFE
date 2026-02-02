"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import type React from "react";
import { Suspense, useState } from "react";

export function LayoutClient({
  children,
  user,
  navigationSections,
}: {
  children: React.ReactNode;
  user: any;
  navigationSections: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Suspense fallback={<div>Carregando...</div>}>
        <Header user={user} navigationSections={navigationSections} />
        <Sidebar
          open={open}
          onOpenChange={setOpen}
          navigationSections={navigationSections}
        />
      </Suspense>

      <main
        className={cn(
          "pt-16 min-h-screen bg-background transition-all duration-300",
          !open ? "md:ml-64" : "md:ml-16"
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </>
  );
}
