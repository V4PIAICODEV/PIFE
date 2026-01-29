"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeltBadge } from "@/components/belt-badge"
import { mockUsers, mockSteps, mockSquads, BELT_NAMES, currentUser } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"
import { formatDate } from "@/lib/utils"
import { Users, TrendingUp, Clock, CheckCircle, AlertTriangle, BarChart3, Eye, UserCheck, Shield } from "lucide-react"

// Mock admin data
const mockPendingEvidences = [
  {
    id: "1",
    userId: "2",
    userName: "Carlos Santos",
    userBelt: "white" as const,
    userDegree: 4,
    itemId: "1",
    itemTitle: "Cientista do Marketing - Completo",
    itemType: "course" as const,
    evidenceNote: "Completei todos os módulos do curso e apliquei os conceitos no projeto atual da empresa.",
    evidenceUrl: "https://example.com/certificate",
    submittedAt: new Date("2024-01-22"),
    points: 30,
  },
  {
    id: "2",
    userId: "1",
    userName: "Ana Silva",
    userBelt: "blue" as const,
    userDegree: 2,
    itemId: "3",
    itemTitle: "Google Analytics 4 Skillshop",
    itemType: "cert" as const,
    evidenceNote: "Obtive a certificação oficial do Google Analytics 4 com nota 95%.",
    evidenceUrl: "https://skillshop.withgoogle.com/certificate/123",
    submittedAt: new Date("2024-01-21"),
    points: 60,
  },
]

const mockPendingCheckins = [
  {
    id: "1",
    userId: "3",
    userName: "Maria Oliveira",
    userBelt: "purple" as const,
    userDegree: 1,
    pife: "I" as const,
    note: "Implementei nova estratégia de automação de email marketing que aumentou a taxa de abertura em 25%",
    submittedAt: new Date("2024-01-22"),
    points: 10,
  },
  {
    id: "2",
    userId: "2",
    userName: "Carlos Santos",
    userBelt: "white" as const,
    userDegree: 4,
    pife: "F" as const,
    note: "Recebi feedback muito positivo do cliente sobre a campanha de Black Friday que criei",
    submittedAt: new Date("2024-01-21"),
    points: 10,
  },
]

function AdminStats() {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter((u) => u.streak > 0).length
  const pendingReviews = mockPendingEvidences.length + mockPendingCheckins.length
  const completionRate = 78 // Mock completion rate

  const beltDistribution = mockUsers.reduce(
    (acc, user) => {
      acc[user.belt] = (acc[user.belt] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">{activeUsers} ativos esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReviews}</div>
          <p className="text-xs text-muted-foreground">evidências para revisar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">média geral dos steps</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribuição</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(beltDistribution).map(([belt, count]) => (
              <div key={belt} className="flex items-center justify-between text-sm">
                <span>{BELT_NAMES[belt as keyof typeof BELT_NAMES]}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EvidenceReview() {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null)

  const handleReview = (evidenceId: string, approved: boolean) => {
    console.log(`Evidence ${evidenceId} ${approved ? "approved" : "rejected"}`)
    // Here would be the API call to update evidence status
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Evidências Pendentes</h3>
        <Badge variant="outline">{mockPendingEvidences.length} pendentes</Badge>
      </div>

      <div className="grid gap-4">
        {mockPendingEvidences.map((evidence) => (
          <Card key={evidence.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {evidence.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{evidence.userName}</p>
                    <BeltBadge belt={evidence.userBelt} degree={evidence.userDegree} size="sm" />
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {evidence.itemType === "course" ? "Curso" : evidence.itemType === "cert" ? "Certificação" : "Livro"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{formatDate(evidence.submittedAt)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">{evidence.itemTitle}</h4>
                <p className="text-sm text-muted-foreground">+{evidence.points} pontos</p>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-1">Evidência:</h5>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{evidence.evidenceNote}</p>
                {evidence.evidenceUrl && (
                  <a
                    href={evidence.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Ver evidência externa
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleReview(evidence.id, true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReview(evidence.id, false)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CheckinReview() {
  const handleReview = (checkinId: string, approved: boolean) => {
    console.log(`Check-in ${checkinId} ${approved ? "approved" : "rejected"}`)
    // Here would be the API call to update checkin status
  }

  const getPIFELabel = (pife: string) => {
    const labels = {
      P: "Prática",
      I: "Implementação",
      F: "Feedback",
      E: "Estudo",
    }
    return labels[pife as keyof typeof labels] || pife
  }

  const getPIFEColor = (pife: string) => {
    const colors = {
      P: "bg-blue-500",
      I: "bg-green-500",
      F: "bg-yellow-500",
      E: "bg-purple-500",
    }
    return colors[pife as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Check-ins PIFE Pendentes</h3>
        <Badge variant="outline">{mockPendingCheckins.length} pendentes</Badge>
      </div>

      <div className="grid gap-4">
        {mockPendingCheckins.map((checkin) => (
          <Card key={checkin.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {checkin.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{checkin.userName}</p>
                    <BeltBadge belt={checkin.userBelt} degree={checkin.userDegree} size="sm" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-6 h-6 rounded-full ${getPIFEColor(checkin.pife)} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {checkin.pife}
                    </div>
                    <span className="text-sm font-medium">{getPIFELabel(checkin.pife)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(checkin.submittedAt)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-1">Atividade:</h5>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{checkin.note}</p>
                <p className="text-sm text-muted-foreground mt-1">+{checkin.points} pontos</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleReview(checkin.id, true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReview(checkin.id, false)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function UserManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
        <Button size="sm">
          <UserCheck className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="grid gap-4">
        {mockUsers.map((user) => {
          const squad = mockSquads.find((s) => s.id === user.squadId)
          return (
            <Card key={user.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <BeltBadge belt={user.belt} degree={user.degree} size="sm" />
                        {squad && (
                          <Badge variant="outline" className="text-xs">
                            {squad.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{user.points}</p>
                        <p className="text-xs text-muted-foreground">pontos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-500">{user.streak}</p>
                        <p className="text-xs text-muted-foreground">streak</p>
                      </div>
                    </div>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "mentor" ? "secondary" : "outline"}
                    >
                      {user.role === "admin" ? "Admin" : user.role === "mentor" ? "Mentor" : "Player"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Analytics() {
  // Mock analytics data
  const stepProgress = mockSteps.map((step) => ({
    ...step,
    totalUsers: mockUsers.filter((u) => u.belt === step.belt).length,
    avgCompletion: Math.floor(Math.random() * 40) + 60, // 60-100%
    avgTimeToComplete: Math.floor(Math.random() * 30) + 15, // 15-45 days
  }))

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analytics e Relatórios</h3>

      {/* Step Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Step</CardTitle>
          <CardDescription>Análise de conclusão e tempo médio por faixa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stepProgress.map((step) => (
              <div key={step.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <BeltBadge belt={step.belt} degree={1} showDegree={false} />
                  <div>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-sm text-muted-foreground">{step.totalUsers} usuários</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{step.avgCompletion}%</p>
                  <p className="text-sm text-muted-foreground">{step.avgTimeToComplete} dias médios</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Squad Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Squad</CardTitle>
          <CardDescription>Comparativo de desempenho entre squads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSquads.map((squad) => {
              const squadUsers = mockUsers.filter((u) => u.squadId === squad.id)
              const avgPoints = squadUsers.reduce((sum, u) => sum + u.points, 0) / squadUsers.length
              const avgStreak = squadUsers.reduce((sum, u) => sum + u.streak, 0) / squadUsers.length

              return (
                <div key={squad.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: squad.color }}
                    >
                      {squad.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{squad.name}</p>
                      <p className="text-sm text-muted-foreground">{squad.memberCount} membros</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Math.round(avgPoints)} pts médios</p>
                    <p className="text-sm text-muted-foreground">{Math.round(avgStreak)} streak médio</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  const canAccessAdmin = hasPermission(currentUser, "admin", "canView")

  if (!canAccessAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground mb-4">Você não tem permissão para acessar o painel administrativo.</p>
              <p className="text-sm text-muted-foreground">
                Apenas administradores podem acessar esta área. Entre em contato com um administrador se precisar de
                acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie usuários, revise evidências e acompanhe o progresso geral</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
          <span className="text-sm text-muted-foreground">Logado como: {currentUser.name}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <AdminStats />

      {/* Main Content */}
      <div className="mt-8">
        <Tabs defaultValue="evidences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="evidences">Evidências ({mockPendingEvidences.length})</TabsTrigger>
            <TabsTrigger value="checkins">Check-ins ({mockPendingCheckins.length})</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="evidences">
            <EvidenceReview />
          </TabsContent>

          <TabsContent value="checkins">
            <CheckinReview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
