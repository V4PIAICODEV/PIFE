"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Flame,
  Home,
  LogOut,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Mapeamento de ícones simplificado apenas para o PIFE
const iconMap: Record<string, any> = {
  Home,
  Users,
  Flame,
  Trophy,
  BarChart3,
  Settings,
};

export function Sidebar({
  open,
  onOpenChange,
  navigationSections = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigationSections?: any[];
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300 z-40 md:block hidden",
        open ? "w-16" : "w-64"
      )}
    >
      {/* Botão de Recolher Sidebar */}
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(!open)}
          className="h-8 w-8 p-0"
        >
          {open ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Itens de Navegação PIFE */}
      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-10rem)]">
        {navigationSections.map((section) => {
          if (section.type === "item") {
            const Icon = iconMap[section.icon] || Home;
            const isActive = pathname === section.href;

            return (
              <div key={section.href}>
                <Link href={section.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isActive && "bg-primary text-primary-foreground",
                      open && "px-2 justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!open && (
                      <span className="truncate w-full text-start">
                        {section.label}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Botão de Logout */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className="w-full bg-red-600 hover:bg-red-700 mb-2 text-white"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {!open && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
}
