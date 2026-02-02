"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BeltBadge } from "@/components/belt-badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { currentUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
// Ícones ajustados para o foco no PIFE
import { Home, Trophy, Flame, Users, Menu, X, Settings } from "lucide-react"

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/mural-faixas", label: "Mural das Faixas", icon: Users },
  { href: "/checkin", label: "Check-in PIFE", icon: Flame },
  { href: "/ranking", label: "Ranking PIFE", icon: Trophy },
]

// Mantivemos o Admin apenas para quem tem permissão
const adminNavigationItems = [{ href: "/admin", label: "Admin", icon: Settings }]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // A lógica de cargo continua vindo do seu mock ou banco
  const showAdminNav = currentUser.role === "admin" || currentUser.role === "mentor"
  const allNavigationItems = showAdminNav ? [...navigationItems, ...adminNavigationItems] : navigationItems

  return (
    <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Marca */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V4</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">Sistema PIFE</span>
            </Link>
          </div>

          {/* Desktop Navigation - Apenas PIFE e Dash */}
          <div className="hidden md:flex items-center gap-1">
            {allNavigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn("gap-2", isActive && "bg-primary text-primary-foreground")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Informações do Usuário (Dinamismo mantido) */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.points} pontos</p>
            </div>
            <BeltBadge belt={currentUser.belt} degree={currentUser.degree} size="sm" />

            {/* Menu Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="grid gap-2">
              {allNavigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn("w-full justify-start gap-2", isActive && "bg-primary text-primary-foreground")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
