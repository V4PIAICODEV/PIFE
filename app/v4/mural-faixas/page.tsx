"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BeltBadge } from "@/components/belt-badge"
import { mockUsers } from "@/lib/mock-data"
import { TrendingUp, Award } from "lucide-react"
import type { Belt } from "@/lib/types"

function BeltSection({ belt, users }: { belt: Belt; users: typeof mockUsers }) {
  const beltUsers = users.filter((user) => user.belt === belt)

  if (beltUsers.length === 0) return null

  const getBeltInfo = (belt: Belt) => {
    switch (belt) {
      case "white":
        return { name: "Faixa Branca", color: "bg-gray-100 border-gray-300", textColor: "text-gray-800" }
      case "blue":
        return { name: "Faixa Azul", color: "bg-blue-100 border-blue-300", textColor: "text-blue-800" }
      case "purple":
        return { name: "Faixa Roxa", color: "bg-purple-100 border-purple-300", textColor: "text-purple-800" }
      case "brown":
        return { name: "Faixa Marrom", color: "bg-amber-100 border-amber-300", textColor: "text-amber-800" }
      case "black":
        return { name: "Faixa Preta", color: "bg-gray-900 border-gray-700", textColor: "text-white" }
    }
  }

  const beltInfo = getBeltInfo(belt)

  return (
    <Card className={`${beltInfo.color} ${beltInfo.textColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BeltBadge belt={belt} degree={1} size="sm" />
          <span>{beltInfo.name}</span>
          <Badge variant="outline" className="ml-auto">
            {beltUsers.length} {beltUsers.length === 1 ? "player" : "players"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {beltUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <BeltBadge belt={user.belt} degree={user.degree} size="sm" />
                    <span className="text-sm text-muted-foreground">{user.degree}º Grau</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{user.points}</p>
                <p className="text-sm text-muted-foreground">pontos</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MuralFaixasPage() {
  const beltOrder: Belt[] = ["white", "blue", "purple", "brown", "black"]

  // Calculate statistics
  const totalUsers = mockUsers.length
  const beltStats = beltOrder.map((belt) => ({
    belt,
    count: mockUsers.filter((user) => user.belt === belt).length,
    percentage: Math.round((mockUsers.filter((user) => user.belt === belt).length / totalUsers) * 100),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mural das Faixas</h1>
        <p className="text-muted-foreground">Visualize todos os players organizados por faixa e grau de progressão</p>
      </div>

      {/* Statistics Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {beltStats.map(({ belt, count, percentage }) => {
              const beltInfo = {
                white: { name: "Branca", icon: "⚪" },
                blue: { name: "Azul", icon: "🔵" },
                purple: { name: "Roxa", icon: "🟣" },
                brown: { name: "Marrom", icon: "🟤" },
                black: { name: "Preta", icon: "⚫" },
              }[belt]

              return (
                <div key={belt} className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl mb-2">{beltInfo.icon}</div>
                  <p className="font-bold text-2xl">{count}</p>
                  <p className="text-sm text-muted-foreground">{beltInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Belt Sections */}
      <div className="space-y-6">
        {beltOrder.map((belt) => (
          <BeltSection key={belt} belt={belt} users={mockUsers} />
        ))}
      </div>

      {/* Total Summary */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalUsers}</p>
              <p className="text-muted-foreground">Total de Players no Sistema PDI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
