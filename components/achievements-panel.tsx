"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Flame, Target, Users, BookOpen } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  earned: boolean
  earnedDate?: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

const achievements: Achievement[] = [
  {
    id: "first-checkin",
    title: "Primeiro Check-in",
    description: "Complete seu primeiro check-in PIFE",
    icon: Flame,
    earned: true,
    earnedDate: "2024-01-15",
    points: 50,
    rarity: "common",
  },
  {
    id: "streak-7",
    title: "Sequência de 7 dias",
    description: "Mantenha uma sequência de 7 dias consecutivos",
    icon: Target,
    earned: true,
    earnedDate: "2024-01-22",
    points: 200,
    rarity: "rare",
  },
  {
    id: "belt-promotion",
    title: "Primeira Promoção",
    description: "Conquiste sua primeira faixa",
    icon: Trophy,
    earned: true,
    earnedDate: "2024-02-01",
    points: 500,
    rarity: "epic",
  },
  {
    id: "course-master",
    title: "Mestre dos Cursos",
    description: "Complete 10 cursos na trilha",
    icon: BookOpen,
    earned: false,
    points: 300,
    rarity: "rare",
  },
  {
    id: "squad-leader",
    title: "Líder do Squad",
    description: "Seja o #1 do seu squad por uma semana",
    icon: Users,
    earned: false,
    points: 400,
    rarity: "epic",
  },
  {
    id: "perfect-month",
    title: "Mês Perfeito",
    description: "Complete todos os check-ins de um mês",
    icon: Star,
    earned: false,
    points: 1000,
    rarity: "legendary",
  },
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

export function AchievementsPanel() {
  const earnedAchievements = achievements.filter((a) => a.earned)
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Conquistas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {earnedAchievements.length} de {achievements.length} conquistadas • {totalPoints} pontos
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-lg border ${
                  achievement.earned ? "bg-card border-primary/20" : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div
                  className={`p-1.5 rounded-full ${
                    achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <Badge variant="outline" className={`text-xs px-1.5 py-0 ${rarityColors[achievement.rarity]}`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">{achievement.description}</p>
                  {achievement.earnedDate && (
                    <p className="text-xs text-primary mt-0.5">
                      Conquistado em {new Date(achievement.earnedDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">+{achievement.points}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
