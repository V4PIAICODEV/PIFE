"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flame,
  Home,
  LogOut,
  MessageSquare,
  Trophy,
  Users,
  Clock,
  Settings
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconMap: Record<string, any> = {
  Home,
  Users,
  Flame,
  Trophy,
  Clock,
  MessageSquare,
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
  const [expandedSections, setExpandedSections] = useState<string[]>(["SISTEMA PIFE"]);

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
      <div className="flex justify-end p-2 border-b">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(!open)} className="h-8 w-8 p-0">
          {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-10rem)]">
        {navigationSections.map((section, index) => {
          // RENDERIZA ITEM SIMPLES (Ex: Dashboard)
          if (section.type === "item") {
            const Icon = iconMap[section.icon] || Home;
            const isActive = pathname === section.href;

            return (
              <Link key={section.href} href={section.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start gap-3 h-10 mb-1", isActive && "bg-primary text-primary-foreground", open && "justify-center px-0")}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!open && <span className="truncate">{section.label}</span>}
                </Button>
              </Link>
            );
          }

          // RENDERIZA SEÇÃO (Ex: SISTEMA PIFE)
          if (section.type === "section") {
            const isExpanded = expandedSections.includes(section.title);
            return (
              <div key={section.title} className="pt-2">
                {!open && (
                  <div 
                    className="flex items-center justify-between px-2 mb-1 cursor-pointer hover:bg-muted rounded-md h-8"
                    onClick={() => toggleSection(section.title)}
                  >
                    <span className="text-xs font-bold text-muted-foreground uppercase">{section.title}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </div>
                )}
                {(isExpanded || open) && (
                  <div className={cn("space-y-1", !open && "ml-2")}>
                    {section.items?.map((item: any) => {
                      const Icon = iconMap[item.icon] || Home;
                      const isActive = pathname === item.href;
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn("w-full justify-start gap-3 h-9 text-sm", isActive && "bg-primary text-primary-foreground", open && "justify-center px-0")}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {!open && <span className="truncate">{item.label}</span>}
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

      <div className="p-2 border-t mt-auto">
        <Button variant="ghost" className="w-full bg-red-600 hover:bg-red-700 text-white gap-2" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          {!open && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
