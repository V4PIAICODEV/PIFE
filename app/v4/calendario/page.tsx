"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeltBadge } from "@/components/belt-badge"
import { currentUser, mockSteps } from "@/lib/mock-data"
import { formatDate, canGainDegree, canChangeBelt } from "@/lib/utils"
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Plus, Eye } from "lucide-react"
import type { ExamType } from "@/lib/types"

// Mock exam data
const mockExams = [
  {
    id: "1",
    stepId: "v0",
    type: "degree" as ExamType,
    date: new Date("2024-02-15"),
    status: "scheduled" as const,
    location: "Sala de Reuniões A",
    description: "Prova para avançar para o próximo grau da Faixa Branca",
    maxParticipants: 10,
    currentParticipants: 7,
    examiner: "Maria Oliveira",
  },
  {
    id: "2",
    stepId: "v1",
    type: "belt" as ExamType,
    date: new Date("2024-02-20"),
    status: "scheduled" as const,
    location: "Auditório Principal",
    description: "Prova prática para mudança de Faixa Azul para Faixa Roxa",
    maxParticipants: 5,
    currentParticipants: 3,
    examiner: "João Admin",
  },
  {
    id: "3",
    stepId: "v0",
    type: "degree" as ExamType,
    date: new Date("2024-02-25"),
    status: "scheduled" as const,
    location: "Sala de Reuniões B",
    description: "Prova para avançar para o próximo grau da Faixa Branca",
    maxParticipants: 8,
    currentParticipants: 4,
    examiner: "Maria Oliveira",
  },
  {
    id: "4",
    stepId: "v1",
    type: "degree" as ExamType,
    date: new Date("2024-03-05"),
    status: "scheduled" as const,
    location: "Sala de Reuniões C",
    description: "Prova para avançar para o próximo grau da Faixa Azul",
    maxParticipants: 12,
    currentParticipants: 8,
    examiner: "João Admin",
  },
]

// Mock user registrations
const mockUserRegistrations = [
  {
    examId: "1",
    userId: currentUser.id,
    registeredAt: new Date("2024-01-20"),
    status: "confirmed" as const,
  },
]

function EligibilityChecker({ examType, stepId }: { examType: ExamType; stepId: string }) {
  const step = mockSteps.find((s) => s.id === stepId)
  if (!step) return null

  // Mock data for eligibility check
  const completedItems = 8
  const totalItems = 12
  const recentCheckins = 10
  const requiredCerts = 2
  const completedCerts = 1

  const isEligibleForDegree = canGainDegree(currentUser, completedItems, totalItems, recentCheckins)
  const isEligibleForBelt = canChangeBelt(currentUser, completedItems, totalItems, requiredCerts, completedCerts)

  const isEligible = examType === "degree" ? isEligibleForDegree : isEligibleForBelt

  const requirements =
    examType === "degree"
      ? [
          {
            label: "Completar 25% da trilha",
            completed: completedItems / totalItems >= 0.25,
            value: `${Math.round((completedItems / totalItems) * 100)}%`,
          },
          { label: "7 check-ins PIFE em 14 dias", completed: recentCheckins >= 7, value: `${recentCheckins}/7` },
          { label: "Mini-prova aprovada", completed: true, value: "✓" },
        ]
      : [
          {
            label: "100% da trilha concluída",
            completed: completedItems === totalItems,
            value: `${Math.round((completedItems / totalItems) * 100)}%`,
          },
          {
            label: "Certificações obrigatórias",
            completed: completedCerts >= requiredCerts,
            value: `${completedCerts}/${requiredCerts}`,
          },
          { label: "NPS interno ≥ 8/10", completed: true, value: "8.5/10" },
          { label: "Prova prática aprovada", completed: false, value: "Pendente" },
        ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {isEligible ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
        <span className={`font-medium ${isEligible ? "text-green-700" : "text-red-700"}`}>
          {isEligible ? "Elegível" : "Não elegível"}
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Requisitos:</h4>
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {req.completed ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-red-500" />
              )}
              <span className={req.completed ? "text-green-700" : "text-red-700"}>{req.label}</span>
            </div>
            <span className="font-medium">{req.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExamCard({ exam }: { exam: (typeof mockExams)[0] }) {
  const step = mockSteps.find((s) => s.id === exam.stepId)
  const isRegistered = mockUserRegistrations.some((r) => r.examId === exam.id)
  const spotsAvailable = exam.maxParticipants - exam.currentParticipants
  const isFull = spotsAvailable <= 0

  const handleRegister = () => {
    console.log(`Registering for exam ${exam.id}`)
    // Here would be the API call to register for exam
  }

  const handleUnregister = () => {
    console.log(`Unregistering from exam ${exam.id}`)
    // Here would be the API call to unregister from exam
  }

  if (!step) return null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BeltBadge belt={step.belt} degree={1} showDegree={false} />
            <div>
              <CardTitle className="text-lg">{step.name}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </div>
          </div>
          <Badge variant={exam.type === "degree" ? "secondary" : "default"}>
            {exam.type === "degree" ? "Prova de Grau" : "Prova de Faixa"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(exam.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>14:00 - 16:00</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{exam.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {exam.currentParticipants}/{exam.maxParticipants} inscritos
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm font-medium mb-2">Examinador: {exam.examiner}</p>
          <EligibilityChecker examType={exam.type} stepId={exam.stepId} />
        </div>

        <div className="flex gap-2">
          {isRegistered ? (
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleUnregister}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Inscrito - Cancelar
            </Button>
          ) : (
            <Button className="flex-1" disabled={isFull} onClick={handleRegister}>
              <Plus className="h-4 w-4 mr-2" />
              {isFull ? "Lotado" : "Inscrever-se"}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {spotsAvailable <= 2 && spotsAvailable > 0 && (
          <div className="text-center">
            <Badge variant="destructive" className="text-xs">
              Apenas {spotsAvailable} vaga{spotsAvailable > 1 ? "s" : ""} restante{spotsAvailable > 1 ? "s" : ""}!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Group exams by month
  const examsByMonth = mockExams.reduce(
    (acc, exam) => {
      const monthKey = exam.date.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(exam)
      return acc
    },
    {} as Record<string, typeof mockExams>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(examsByMonth).map(([monthKey, exams]) => {
        const monthDate = new Date(monthKey + "-01")
        const monthName = monthDate.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })

        return (
          <div key={monthKey}>
            <h3 className="text-lg font-semibold mb-4 capitalize">{monthName}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MyExams() {
  const myExams = mockExams.filter((exam) => mockUserRegistrations.some((reg) => reg.examId === exam.id))

  const upcomingExams = myExams.filter((exam) => exam.date > new Date())
  const pastExams = myExams.filter((exam) => exam.date <= new Date())

  return (
    <div className="space-y-6">
      {/* Upcoming Exams */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Próximas Provas</h3>
        {upcomingExams.length > 0 ? (
          <div className="grid gap-4">
            {upcomingExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhuma prova agendada</h3>
              <p className="text-muted-foreground mb-4">Você não tem provas agendadas no momento.</p>
              <Button>Ver Provas Disponíveis</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Histórico</h3>
          <div className="space-y-3">
            {pastExams.map((exam) => {
              const step = mockSteps.find((s) => s.id === exam.stepId)
              return (
                <Card key={exam.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {step && <BeltBadge belt={step.belt} degree={1} showDegree={false} size="sm" />}
                        <div>
                          <p className="font-medium">{step?.name}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(exam.date)}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function EligibilityOverview() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Sua Elegibilidade</h3>

      {mockSteps.map((step) => (
        <Card key={step.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BeltBadge belt={step.belt} degree={1} showDegree={false} />
              <div>
                <CardTitle className="text-lg">{step.name}</CardTitle>
                <CardDescription>Verifique sua elegibilidade para provas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Prova de Grau</h4>
              <EligibilityChecker examType="degree" stepId={step.id} />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Prova de Faixa</h4>
              <EligibilityChecker examType="belt" stepId={step.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CalendarioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calendário de Provas</h1>
        <p className="text-muted-foreground">Agende suas provas de grau e faixa, e acompanhe sua elegibilidade</p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Todas as Provas</TabsTrigger>
          <TabsTrigger value="my-exams">Minhas Provas</TabsTrigger>
          <TabsTrigger value="eligibility">Elegibilidade</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>

        <TabsContent value="my-exams">
          <MyExams />
        </TabsContent>

        <TabsContent value="eligibility">
          <EligibilityOverview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
