"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeltBadge } from "@/components/belt-badge"
import { mockSteps, mockItems } from "@/lib/mock-data"
import { BookOpen, ExternalLink, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Item, ProgressStatus } from "@/lib/types"

// Mock progress data
const mockProgress = {
  "1": { status: "done" as ProgressStatus, completedAt: new Date("2024-01-15") },
  "2": { status: "pending" as ProgressStatus },
  "3": { status: "rejected" as ProgressStatus, reviewNote: "Evidência insuficiente" },
}

function ItemCard({
  item,
  progress,
}: { item: Item; progress?: { status: ProgressStatus; completedAt?: Date; reviewNote?: string } }) {
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)

  const getStatusIcon = () => {
    switch (progress?.status) {
      case "done":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = () => {
    switch (progress?.status) {
      case "done":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejeitado</Badge>
      default:
        return <Badge variant="outline">Não iniciado</Badge>
    }
  }

  const getTypeIcon = () => {
    switch (item.type) {
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "cert":
        return <Badge className="w-4 h-4 rounded-full bg-yellow-500" />
      case "book":
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeLabel = () => {
    switch (item.type) {
      case "course":
        return "Curso"
      case "cert":
        return "Certificação"
      case "book":
        return "Livro"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel()}
            </Badge>
            {item.required && (
              <Badge variant="destructive" className="text-xs">
                Obrigatório
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
        {item.description && <CardDescription className="text-sm">{item.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pontos:</span>
          <span className="font-semibold text-primary">+{item.points}</span>
        </div>

        {progress?.status === "rejected" && progress.reviewNote && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Motivo da rejeição:</strong> {progress.reviewNote}
            </p>
          </div>
        )}

        {progress?.status === "done" && progress.completedAt && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">Concluído em {progress.completedAt.toLocaleDateString("pt-BR")}</p>
          </div>
        )}

        <div className="flex gap-2">
          {item.url && (
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar
              </a>
            </Button>
          )}

          {progress?.status !== "done" && (
            <Button size="sm" className="flex-1" onClick={() => setShowEvidenceForm(!showEvidenceForm)}>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Evidência
            </Button>
          )}
        </div>

        {showEvidenceForm && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <h4 className="font-semibold text-sm">Enviar Evidência</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de evidência:</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  Foto
                </Button>
                <Button variant="outline" size="sm">
                  Link
                </Button>
                <Button variant="outline" size="sm">
                  Nota
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição:</label>
              <textarea
                className="w-full p-2 text-sm border rounded-md resize-none"
                rows={3}
                placeholder="Descreva sua evidência de conclusão..."
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Enviar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEvidenceForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StepOverview({ stepId }: { stepId: string }) {
  const step = mockSteps.find((s) => s.id === stepId)
  const stepItems = mockItems.filter((item) => item.stepId === stepId)
  const completedItems = stepItems.filter((item) => mockProgress[item.id]?.status === "done").length
  const totalItems = stepItems.length
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const requiredItems = stepItems.filter((item) => item.required)
  const completedRequired = requiredItems.filter((item) => mockProgress[item.id]?.status === "done").length

  if (!step) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BeltBadge belt={step.belt} degree={1} showDegree={false} />
            <div>
              <CardTitle>{step.name}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {completedItems}/{totalItems}
            </p>
            <p className="text-sm text-muted-foreground">concluídos</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso geral</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Itens obrigatórios</p>
            <p className="font-semibold">
              {completedRequired}/{requiredItems.length}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Pontos disponíveis</p>
            <p className="font-semibold">{stepItems.reduce((sum, item) => sum + item.points, 0)}</p>
          </div>
        </div>

        {completionRate === 100 && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800 font-medium">🎉 Parabéns! Você completou todos os itens deste step!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TrilhaPage() {
  const [activeStep, setActiveStep] = useState(mockSteps[0]?.id || "v0")

  const currentStep = mockSteps.find((s) => s.id === activeStep)
  const stepItems = mockItems.filter((item) => item.stepId === activeStep)

  const courseItems = stepItems.filter((item) => item.type === "course")
  const certItems = stepItems.filter((item) => item.type === "cert")
  const bookItems = stepItems.filter((item) => item.type === "book")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trilha de Desenvolvimento</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso através dos diferentes steps e complete os itens para avançar
        </p>
      </div>

      {/* Step Navigation */}
      <Tabs value={activeStep} onValueChange={setActiveStep} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {mockSteps.map((step) => (
            <TabsTrigger key={step.id} value={step.id} className="flex items-center gap-2">
              <BeltBadge belt={step.belt} degree={1} size="sm" showDegree={false} />
              <span className="hidden sm:inline">{step.name}</span>
              <span className="sm:hidden">{step.id.toUpperCase()}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {mockSteps.map((step) => (
          <TabsContent key={step.id} value={step.id} className="space-y-6">
            <StepOverview stepId={step.id} />

            {stepItems.length > 0 ? (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">Todos ({stepItems.length})</TabsTrigger>
                  <TabsTrigger value="courses">Cursos ({courseItems.length})</TabsTrigger>
                  <TabsTrigger value="certs">Certificações ({certItems.length})</TabsTrigger>
                  <TabsTrigger value="books">Livros ({bookItems.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stepItems.map((item) => (
                      <ItemCard key={item.id} item={item} progress={mockProgress[item.id]} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courseItems.map((item) => (
                      <ItemCard key={item.id} item={item} progress={mockProgress[item.id]} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="certs" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {certItems.map((item) => (
                      <ItemCard key={item.id} item={item} progress={mockProgress[item.id]} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="books" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookItems.map((item) => (
                      <ItemCard key={item.id} item={item} progress={mockProgress[item.id]} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhum item encontrado</h3>
                  <p className="text-muted-foreground">Este step ainda não possui itens cadastrados.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
