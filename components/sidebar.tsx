"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Coffee,
  Flame,
  Home,
  LogOut,
  MessageSquare,
  Network,
  Play,
  Settings,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  Home,
  BookOpen,
  Calendar,
  Users,
  Play,
  Flame,
  Trophy,
  Clock,
  Network,
  Coffee,
  UserPlus,
  MessageSquare,
  BarChart3,
  User,
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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((title) => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300 z-40 md:block hidden",
        open ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
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

      {/* Navigation Items */}
      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-10rem)]">
        {navigationSections.map((section, index) => {
          // Se for um item simples (ex: Dashboard)
          if (section.type === "item") {
            const Icon = iconMap[section.icon] || Home;
            // Para o Dashboard, verificar apenas se é exatamente a rota
            const isActive = pathname === section.href;

            return (
              <div key={section.href}>
                <Link href={section.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-center gap-3 h-10",
                      isActive && "bg-primary text-primary-foreground",
                      open && "px-2"
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

          // Se for uma seção com itens
          if (section.type === "section") {
            const isExpanded = expandedSections.includes(section.title);
            const hasActiveItem = section.items?.some(
              (item: any) => pathname === item.href
            );

            return (
              <div
                key={section.title}
                className={index > 0 ? "border-t pt-2" : ""}
              >
                {/* Section Header - Clickable to expand/collapse */}
                <Button
                  variant="ghost"
                  onClick={() => !open && toggleSection(section.title)}
                  className={cn(
                    "w-full justify-between h-10 font-semibold text-sm",
                    hasActiveItem && "bg-muted",
                    open && "px-2"
                  )}
                >
                  {!open && (
                    <>
                      <span>{section.title}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </>
                  )}
                  {open && (
                    <span className="text-sm font-bold w-full text-center">
                      {section.title.charAt(0)}
                    </span>
                  )}
                </Button>

                {/* Section Items - Show when expanded or collapsed sidebar */}
                {(isExpanded || open) && (
                  <div className={cn("space-y-1", !open && "ml-2 mt-1")}>
                    {section.items?.map((item: any) => {
                      const Icon = iconMap[item.icon] || Home;
                      const isActive = pathname === item.href;

                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 h-9 text-sm",
                              isActive && "bg-primary text-primary-foreground",
                              open && "px-2"
                            )}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {!open && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full bg-red-600 hover:bg-red-700 mb-2 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span className={cn("text-white", open && "hidden")}>Sair</span>
        </Button>
      </div>
    </div>
  );
}
