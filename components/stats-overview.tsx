import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { User } from "@/lib/types"
import { getStreakBonus } from "@/lib/utils"
import { Flame, Target, TrendingUp, Calendar, BookOpen, Award } from "lucide-react"

interface StatsOverviewProps {
  user: User
  className?: string
}

export function StatsOverview({ user, className }: StatsOverviewProps) {
  const streakBonus = getStreakBonus(user.streak)

  // Mock additional stats
  const stats = {
    completedCourses: 12,
    totalCourses: 18,
    completedCerts: 3,
    totalCerts: 5,
    weeklyGoal: 50,
    weeklyProgress: 35,
    monthlyRank: 8,
    totalUsers: 45,
  }

  const courseProgress = (stats.completedCourses / stats.totalCourses) * 100
  const certProgress = (stats.completedCerts / stats.totalCerts) * 100
  const weeklyGoalProgress = (stats.weeklyProgress / stats.weeklyGoal) * 100

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {/* Streak Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Streak PIFE</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
          <p className="text-xs text-muted-foreground">dias consecutivos</p>
          {streakBonus > 0 && (
            <Badge variant="secondary" className="mt-2 text-xs">
              +{streakBonus} pts bônus
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Points Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pontos Totais</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{user.points}</div>
          <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 50) + 10} esta semana</p>
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta Semanal</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyProgress}</div>
          <p className="text-xs text-muted-foreground">de {stats.weeklyGoal} pontos</p>
          <Progress value={weeklyGoalProgress} className="mt-2 h-1" />
        </CardContent>
      </Card>

      {/* Course Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cursos</CardTitle>
          <BookOpen className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedCourses}</div>
          <p className="text-xs text-muted-foreground">de {stats.totalCourses} concluídos</p>
          <Progress value={courseProgress} className="mt-2 h-1" />
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificações</CardTitle>
          <Award className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedCerts}</div>
          <p className="text-xs text-muted-foreground">de {stats.totalCerts} obtidas</p>
          <Progress value={certProgress} className="mt-2 h-1" />
        </CardContent>
      </Card>

      {/* Monthly Rank */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ranking Mensal</CardTitle>
          <Calendar className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{stats.monthlyRank}</div>
          <p className="text-xs text-muted-foreground">de {stats.totalUsers} usuários</p>
        </CardContent>
      </Card>
    </div>
  )
}
