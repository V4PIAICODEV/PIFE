"use client"

import {
  Edit,
  Clock,
  TrendingUp,
  DollarSign,
  Plus,
  Eye,
  Calendar,
  Upload,
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface EmployeeProfileProps {
  params: {
    id: string
  }
}

export default function EmployeeProfile({ params }: EmployeeProfileProps) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventType, setEventType] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("27/09/2025")

  // Mock data - in real app this would come from API based on params.id
  const employee = {
    id: params.id,
    name: "Ananda Souza",
    position: "Account",
    team: "Joker",
    photo: "/ananda.jpg",
    leader: {
      name: "Maria Luiza de Oliveira Iacono",
      photo: "/maria.jpg",
    },
    engagement: {
      current: 0,
      hasResponded: false,
    },
    salary: {
      current: "Não Disponível",
      history: [
        { date: "Mai/25", amount: "R$ ---,--" },
        { date: "Abr/25", amount: "R$ ---,--" },
        { date: "Mar/25", amount: "R$ ---,--" },
      ],
    },
    history: [
      { date: "06", month: "Mai/25", type: "Carreira", description: "Iniciou na empresa" },
      { date: "01", month: "Mai/25", type: "Carreira", description: "Iniciou no time Joker" },
      { date: "01", month: "Mai/25", type: "Cargo", description: "Account" },
    ],
    meetings: [
      {
        id: 1,
        leader: "Maria Luiza de Oliveira Iacono",
        leaderPhoto: "/maria.jpg",
        role: "Coordenador",
        date: "05 Ago/25 14:07 - 14:37",
        performance: "Satisfatória",
      },
      {
        id: 2,
        leader: "Maria Luiza de Oliveira Iacono",
        leaderPhoto: "/maria.jpg",
        role: "Coordenador",
        date: "01 Jul/25 10:02 - 10:20",
        performance: "Satisfatória",
      },
      {
        id: 3,
        leader: "Maria Luiza de Oliveira Iacono",
        leaderPhoto: "/maria.jpg",
        role: "Coordenador",
        date: "03 Jun/25 09:58 - 10:28",
        performance: "Satisfatória",
      },
    ],
  }

  const handleSaveEvent = () => {
    // Here you would typically save the event to your backend
    console.log("Saving event:", { eventType, eventDescription, eventDate })
    setIsEventModalOpen(false)
    // Reset form
    setEventType("")
    setEventDescription("")
    setEventDate("27/09/2025")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/time" className="hover:text-gray-900">
              Time
            </Link>
            <span>/</span>
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <Image src="/ananda.jpg" alt={employee.name} fill className="rounded-full object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="font-semibold text-lg">{employee.name}</h2>
                    <Link href={`/time/${params.id}/editar`}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-gray-600 text-sm">{employee.position}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Líder</p>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8">
                        <Image src="/maria.jpg" alt={employee.leader.name} fill className="rounded-full object-cover" />
                      </div>
                      <span className="text-sm">{employee.leader.name}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{employee.team}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Engajamento</span>
                    </div>
                    <p className="text-sm text-gray-600">--.--%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Salário</span>
                    </div>
                    <p className="text-sm text-gray-600">R$ ---</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Card */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Histórico</CardTitle>
                  {/* Dialog wrapper for the + button */}
                  <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Adicionar Evento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        {/* Event Type */}
                        <div className="space-y-2">
                          <Label htmlFor="eventType">Tipo</Label>
                          <Input
                            id="eventType"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            placeholder="Digite o tipo do evento"
                          />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="space-y-2">
                          <div className="border rounded-lg">
                            {/* Toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="text-xs font-bold bg-gray-700 text-white px-1 rounded">1</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="text-xs font-bold bg-gray-700 text-white px-1 rounded">a</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Underline className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Code className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <List className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ListOrdered className="h-4 w-4" />
                              </Button>
                            </div>
                            {/* Text Area */}
                            <Textarea
                              value={eventDescription}
                              onChange={(e) => setEventDescription(e.target.value)}
                              placeholder="Descreva este evento aqui..."
                              className="min-h-[200px] border-0 resize-none focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                          <Label htmlFor="eventDate">Data</Label>
                          <div className="relative">
                            <Input
                              id="eventDate"
                              value={eventDate}
                              onChange={(e) => setEventDate(e.target.value)}
                              className="pr-10"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        {/* Attachment */}
                        <div className="space-y-2">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                            <p className="text-orange-500 font-medium">Clique para anexar</p>
                            <p className="text-xs text-gray-500 mt-2">*Máximo de 3 arquivos com até 10MB cada</p>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEvent} className="bg-gray-400 hover:bg-gray-500">
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {employee.history.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="text-center">
                        <div className="text-sm font-medium">{item.date}</div>
                        <div className="text-xs text-gray-500">{item.month}</div>
                      </div>
                      <div className="flex-1 bg-green-100 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800">{item.type}</div>
                        <div className="text-sm text-green-700">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Engagement Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Engajamento</CardTitle>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase">Engajamento Atual</div>
                      <div className="text-2xl font-bold">{employee.engagement.current}%</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aqui exibimos as taxas de Engajamento das 12 últimas pesquisas. A taxa é baseada nas respostas da
                    Pesquisa.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">TAXA(%)</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>100%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>50%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0%</span>
                      </div>
                    </div>
                  </div>

                  {!employee.engagement.hasResponded && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">📊</div>
                      <p className="text-sm text-gray-500">
                        Este membro ainda não respondeu uma pesquisa de engajamento.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Salary History Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Histórico de Salário</CardTitle>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase">Salário Atual</div>
                      <div className="text-lg font-semibold">{employee.salary.current}</div>
                      <Eye className="h-4 w-4 text-gray-400 inline ml-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 uppercase">Salário (R$)</div>
                    {employee.salary.history.map((salary, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-600">{salary.date}</span>
                        <span className="text-sm font-medium">{salary.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Card>
              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="meetings">Reuniões 1-1 e Mentorias</TabsTrigger>
                  <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
                  <TabsTrigger value="tracks">Trilhas</TabsTrigger>
                </TabsList>

                <TabsContent value="meetings" className="mt-0">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Colaborador</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Registro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employee.meetings.map((meeting) => (
                            <tr key={meeting.id} className="border-b">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-500">1-1</span>
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={meeting.leaderPhoto || "/placeholder.svg"}
                                      alt={meeting.leader}
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{meeting.leader}</div>
                                    <div className="text-xs text-gray-500">{meeting.role}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">{meeting.date}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                  <span className="text-sm">{meeting.performance}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Link href="/reunioes-1-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Visualizar
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evaluations">
                  <div className="p-6 text-center text-gray-500">Nenhuma avaliação encontrada.</div>
                </TabsContent>

                <TabsContent value="tracks">
                  <div className="p-6 text-center text-gray-500">Nenhuma trilha encontrada.</div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
