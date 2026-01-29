"use client";

import { Card } from "@/components/ui/card";
import { Calendar, Flame, Target, Trophy } from "lucide-react";

interface GamificationStatsProps {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  weeklyGoal: number;
  weeklyProgress: number;
  level: number;
  nextLevelPoints: number;
  currentLevelPoints: number;
  monthlyCheckins?: number;
}

export function GamificationStats({
  currentStreak = 12,
  longestStreak = 25,
  totalPoints = 2450,
  weeklyGoal = 350,
  weeklyProgress = 280,
  level = 8,
  nextLevelPoints = 2800,
  currentLevelPoints = 2400,
  monthlyCheckins = 0,
}: GamificationStatsProps) {
  const weeklyProgressPercent = (weeklyProgress / weeklyGoal) * 100;

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* Current Streak */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Sequência Atual
          </h3>
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-orange-500">
            {currentStreak}
          </div>
          <p className="text-xs text-muted-foreground">dias consecutivos</p>
        </div>
      </Card>

      {/* Weekly Goal */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Meta Semanal
          </h3>
          <Target className="h-4 w-4 text-green-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-500">
            {weeklyProgress}
          </div>
          <p className="text-xs text-muted-foreground">
            de {weeklyGoal} pontos
          </p>
        </div>
      </Card>

      {/* Total Points */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pontos Totais
          </h3>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-600">
            {totalPoints.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">pontos acumulados</p>
        </div>
      </Card>

      {/* This Month Check-ins */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Este Mês
          </h3>
          <Calendar className="h-4 w-4 text-blue-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-blue-500">
            {monthlyCheckins}
          </div>
          <p className="text-xs text-muted-foreground">check-ins realizados</p>
        </div>
      </Card>
      {/*
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Certificados</h3>
          <Award className="h-4 w-4 text-purple-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-purple-500">12</div>
          <p className="text-xs text-muted-foreground">certificados obtidos</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Cursos Concluídos</h3>
          <BookOpen className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-500">8</div>
          <p className="text-xs text-muted-foreground">cursos finalizados</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Ranking Mensal</h3>
          <Medal className="h-4 w-4 text-amber-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-amber-500">3°</div>
          <p className="text-xs text-muted-foreground">posição no mês</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Nível Atual</h3>
          <Trophy className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-emerald-500">{level}</div>
          <p className="text-xs text-muted-foreground">nível alcançado</p>
        </div>
      </Card>
      */}
    </div>
  );
}
