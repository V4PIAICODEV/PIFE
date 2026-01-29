"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Calendar,
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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationSections?: any[];
  user: string;
}

export function MobileSidebar({
  user,
  isOpen,
  onClose,
  navigationSections = [],
}: MobileSidebarProps) {
  const pathname = usePathname();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[280px] p-0 pt-16">
        {/* Header with Logo */}

        {/* Navigation Items */}
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigationSections.map((section) => {
              // Se for um item simples (ex: Dashboard)
              if (section.type === "item") {
                const Icon = iconMap[section.icon] || Home;
                // Para o Dashboard, verificar apenas se é exatamente a rota
                const isActive = pathname === section.href;

                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    onClick={onClose}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{section.label}</span>
                    </Button>
                  </Link>
                );
              }

              // Se for uma seção com itens
              if (section.type === "section") {
                return (
                  <div key={section.title} className="pt-4">
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item: any) => {
                        const Icon = iconMap[item.icon] || Home;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                          >
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start gap-3 h-11",
                                isActive &&
                                  "bg-primary/10 text-primary hover:bg-primary/20"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return null;
            })}
            <div className="flex items-center gap-2 md:hidden text-left px-3">
              <Link
                href="/v4/configuracoes"
                className="text-sm font-medium flex items-center gap-3"
              >
                <User className="h-4 w-4" />
                Perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
