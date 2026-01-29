"use client";

import { Button } from "@/components/ui/button";
import type { UserSession } from "@/types/users";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { ToggleTheme } from "./ui/toggle-theme";

interface HeaderProps {
  onMenuClick?: () => void;
  user: UserSession;
  navigationSections: any[];
}
export function Header({ onMenuClick, user, navigationSections }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
    onMenuClick?.();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 px-2">
      <div className="flex items-center justify-between h-full px-4 relative">
        <div className="flex items-center gap-2">
          {/* Logo V4 GROW */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src={"/images/logo-v4.png"}
                alt="Logo"
                width={32}
                height={32}
              />
            </div>
            {/* AQUI ESTÁ A MUDANÇA: DE LIFE PARA GROW */}
            <span className="font-bold lg:text-2xl text-lg">GROW</span>
          </Link>
        </div>

        {/* NOME DA UNIDADE CENTRALIZADO */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <span className="font-bold text-lg text-foreground/90 tracking-tight">
            V4 Ferraz Piai & Co
          </span>
        </div>

        <div className="flex flex-row-reverse items-center gap-6">
          {/* Animated Hamburger/X Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative"
            onClick={toggleMenu}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <div className="w-6 h-5 flex flex-col justify-center items-center gap-1.5">
              <span
                className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  open ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </Button>
          {/* CHECK-IN Button - always visible */}
          <Link href="/v4/checkin">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-medium gap-2"
            >
              <Flame className="h-4 w-4" />
              <span className="hidden md:inline">FAZER CHECK-IN PIFE</span>
              <span className="md:hidden sm:block hidden">CHECK-IN</span>
            </Button>
          </Link>

          {/* Desktop only - Theme toggle, user info */}
          <div className="hidden md:block text-right">
            <Link href="/v4/configuracoes" className="text-sm font-medium">
              {user.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {/* {currentUser.points} pontos */}
            </p>
          </div>
          <ToggleTheme />

          <MobileSidebar
            user={user.name}
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
            navigationSections={navigationSections}
          />
        </div>
      </div>
    </header>
  );
}