"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { completeMeeting } from "@/lib/meeting-tracking"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  Play,
  MoreHorizontal,
  Plus,
  Filter,
  CheckSquare,
  X,
  Clock,
  Upload,
  Users,
  Check,
  Menu,
} from "lucide-react"

export default function Registro1x1Page() {
  const [currentMonth, setCurrentMonth] = useState("Setembro")
  const [currentYear, setCurrentYear] = useState("2025")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [showFocusModal, setShowFocusModal] = useState(false)
  const [showMeetingInterface, setShowMeetingInterface] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(30)
  const [meetingTimer, setMeetingTimer] = useState("00:00:13")
  const [selectedDate, setSelectedDate] = useState(28)
  const [selectedTime, setSelectedTime] = useState("21:46")
  const [duration, setDuration] = useState("30")
  const [searchQuery, setSearchQuery] = useState("")
  const [repeatMeeting, setRepeatMeeting] = useState(false)
  const [sendMessage, setSendMessage] = useState(true)

  const employees = [
    {
      id: 1,
      name: "Marcus Vinícius Galissi Massaki",
      role: "Head",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MV",
      date: "2 Set",
      status: "scheduled",
    },
    {
      id: 2,
      name: "Nathalia Fernandes",
      role: "CS",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NF",
      date: "2 Set",
      status: "scheduled",
    },
    {
      id: 3,
      name: "Antônio Derick",
      role: "",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AD",
      date: "3 Set",
      status: "scheduled",
    },
    {
      id: 4,
      name: "Rodolfo Lavinas",
      role: "Head",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RL",
      date: "16 Set",
      status: "scheduled",
    },
  ]

  const startMeetingFlow = () => {
    setShowDurationModal(true)
  }

  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes)
    setShowDurationModal(false)
    setShowFocusModal(true)
  }

  const startMeeting = () => {
    setShowFocusModal(false)
    setShowMeetingInterface(true)
  }

  const finalizeMeeting = () => {
    const meetingId = `meeting-${Date.now()}`
    const score = 4.5 // Could be calculated based on meeting content
    completeMeeting(meetingId, score, "Meeting completed successfully")

    setShowMeetingInterface(false)
    console.log("[v0] Meeting finalized and rankings updated")
  }

  const generateCalendarDays = () => {
    const days = []
    for (let i = 1; i <= 30; i++) {
      days.push(i)
    }
    return days
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const isMobile = useIsMobile()

  if (showMeetingInterface) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" onClick={() => setShowMeetingInterface(false)} className="h-8 px-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Reuniões 1-1</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-lg md:text-xl font-semibold">Reunião 1-1</h1>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-base md:text-lg font-mono">{meetingTimer}</span>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base h-9 md:h-10"
                onClick={finalizeMeeting}
              >
                <span className="hidden sm:inline">Finalizar 1-1</span>
                <span className="sm:hidden">Finalizar</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Meeting Date */}
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-medium">Sáb, 27 Setembro 2025</h2>
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>

              <div className="flex gap-1 mb-4 md:mb-6 border-b overflow-x-auto">
                <Button
                  variant="ghost"
                  className="text-orange-500 border-b-2 border-orange-500 rounded-none whitespace-nowrap text-sm md:text-base"
                >
                  Sugestão
                </Button>
                <Button variant="ghost" className="text-gray-500 rounded-none whitespace-nowrap text-sm md:text-base">
                  Aberto
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-500 rounded-none whitespace-nowrap text-sm md:text-base hidden sm:inline-flex"
                >
                  OKR / Metas
                </Button>
                <Button variant="ghost" className="text-gray-500 rounded-none whitespace-nowrap text-sm md:text-base">
                  PDI
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-500 rounded-none whitespace-nowrap text-sm md:text-base hidden sm:inline-flex"
                >
                  Avaliação
                </Button>
              </div>

              <div className="space-y-4 md:space-y-6">
                {/* Personal Section */}
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-base md:text-lg font-medium">Pessoal</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-gray-500">COMPARTILHAR COM MARCUS</span>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Como você está?</p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Quais são suas principais preocupações?</p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                  </div>
                </Card>

                {/* Relationships Section */}
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-base md:text-lg font-medium">Relacionamentos</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-gray-500">COMPARTILHAR COM MARCUS</span>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Com seu time</p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Outros times</p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                  </div>
                </Card>

                {/* Technical Section */}
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-base md:text-lg font-medium">Técnico</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-gray-500">COMPARTILHAR COM MARCUS</span>
                      <Switch />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Você está enfrentando desafios técnicos?</p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        Você está satisfeito com as tecnologias/ferramentas de trabalho? O que você mudaria?
                      </p>
                      <Textarea
                        placeholder="Digite algum tópico que vocês conversaram"
                        className="min-h-[60px] text-sm md:text-base"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg bg-orange-500 hover:bg-orange-600 z-50"
                  size="icon"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Informações da Reunião</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Employee Info - Mobile */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Colaborador</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-red-100 text-red-600">MV</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">Marcus Vinícius Galissi Massaki</div>
                        <div className="text-xs text-gray-500">Head</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-orange-500 mb-1">
                          <span className="text-xs">Engajamento</span>
                        </div>
                        <div className="text-gray-600 text-sm">---%</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-orange-500 mb-1">
                          <span className="text-xs">Salário</span>
                        </div>
                        <div className="text-gray-600 text-sm">R$ ---</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Mobile */}
                  <div>
                    <h3 className="font-medium mb-4">Ações</h3>
                    <div className="space-y-3">
                      <Input placeholder="Título" className="text-sm" />
                      <div className="grid grid-cols-2 gap-2">
                        <Select>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Para" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marcus">Marcus</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="date" defaultValue="2025-10-04" className="text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Attachments - Mobile */}
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Anexos</h3>
                    <Button
                      variant="outline"
                      className="w-full text-orange-500 border-orange-200 bg-transparent text-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Clique para anexar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="w-80 bg-white border-l p-6">
              {/* Employee Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Colaborador</h3>
                  <Button variant="ghost" size="sm">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-red-100 text-red-600">MV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Marcus Vinícius Galissi Massaki</div>
                    <div className="text-sm text-gray-500">Head</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <div className="w-3 h-3 bg-orange-100 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded"></div>
                      </div>
                      <span>Engajamento</span>
                    </div>
                    <div className="text-gray-600">---%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <div className="w-3 h-3 bg-orange-100 rounded flex items-center justify-center">
                        <span className="text-xs">$</span>
                      </div>
                      <span>Salário</span>
                    </div>
                    <div className="text-gray-600">R$ ---</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <div className="w-3 h-3 bg-orange-100 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded"></div>
                      </div>
                      <span>Impacto</span>
                    </div>
                    <div className="text-gray-600">-/-</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Admissão</span>
                    </div>
                    <div className="text-gray-600">01/04/2024</div>
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Histórico</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">21</div>
                      <div className="text-xs text-gray-500">Jul/25</div>
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-green-100 text-green-700 text-xs">Cargo</Badge>
                      <div className="text-sm text-gray-600 mt-1">Head</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">08</div>
                      <div className="text-xs text-gray-500">Abr/25</div>
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Carreira</Badge>
                      <div className="text-sm text-gray-600 mt-1">Iniciou no time U.S.A</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Ações</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-gray-500">PARA</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marcus">Marcus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-500">Prazo</label>
                      <Input type="date" defaultValue="2025-10-04" className="mt-1" />
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-center">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="font-medium mb-2">Anexos</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Clique no botão de adicionar ou arraste e solte os arquivos na página para anexar eles a reunião
                </p>
                <Button variant="outline" className="w-full text-orange-500 border-orange-200 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Clique para anexar
                </Button>
                <p className="text-xs text-gray-500 mt-2">*Máximo de 10 arquivos com até 10MB cada</p>
              </div>

              {/* Pause Section */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Pauta</h3>
                <p className="text-sm text-gray-500">Pontos a discutir na reunião</p>
                <p className="text-sm text-gray-400 mt-2">A pauta está vazia</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">1-1 Liderados</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
            <Button variant="outline" className="text-gray-600 bg-transparent text-sm flex-1 sm:flex-none">
              <span className="hidden sm:inline">Templates</span>
              <span className="sm:hidden">📋</span>
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm flex-1 sm:flex-none"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Agendar 1-1</span>
            </Button>
            <Button variant="outline" className="text-gray-600 bg-transparent text-sm">
              <Play className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Iniciar agora</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <Button variant="ghost" size="sm" className="text-orange-500 text-sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-medium">
                    {currentMonth} | {currentYear}
                  </span>
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-xs md:text-sm text-gray-500">N/A</span>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-500 text-sm">
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Meetings Section */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <h2 className="text-base md:text-lg font-medium">Reuniões 1-1</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 bg-transparent text-xs md:text-sm"
                    >
                      obrigatórias
                      <ChevronLeft className="h-3 w-3 ml-1 rotate-90" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 md:w-20 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-600">1/6</span>
                  </div>
                </div>

                {isMobile ? (
                  <div className="space-y-3">
                    {employees.map((employee) => (
                      <Card key={employee.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-red-100 text-red-600 text-sm">
                                {employee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{employee.name}</div>
                              {employee.role && <div className="text-xs text-gray-500">{employee.role}</div>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
                            {employee.date}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Calendar className="h-4 w-4 text-orange-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={startMeetingFlow}>
                              <Play className="h-4 w-4 text-orange-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
                      <div className="col-span-6">Liderados</div>
                      <div className="col-span-3">Data</div>
                      <div className="col-span-3">Ações</div>
                    </div>

                    {employees.map((employee) => (
                      <div key={employee.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg">
                        <div className="col-span-6 flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-red-100 text-red-600 text-sm font-medium">
                              {employee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium text-gray-900">{employee.name}</div>
                              {employee.role && <div className="text-sm text-gray-500">{employee.role}</div>}
                            </div>
                            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 flex items-center">
                          <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-100">
                            {employee.date}
                          </Badge>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Calendar className="h-4 w-4 text-orange-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={startMeetingFlow}>
                            <Play className="h-4 w-4 text-orange-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 md:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-medium">Todas as ações</h3>
                    <ChevronLeft className="h-4 w-4 text-gray-400 rotate-90" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Adicionar Ação</span>
                      <span className="sm:hidden">Adicionar</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-8 md:py-12">
                  <CheckSquare className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-xs md:text-sm px-4">
                    As tarefas criadas durante as reuniões estarão aqui para acompanhamento de status e prazos.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="hidden lg:block space-y-6">
            {/* Achievements */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Minhas Conquistas</h3>
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-red-100 text-red-600">NF</AvatarFallback>
                </Avatar>
                <div className="font-medium">Nicholas Ferreira</div>
              </div>

              <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <Star className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">0/5</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600">1/6</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">0/0</div>
                </div>
              </div>
            </Card>

            {/* Monthly Score */}
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-700">Pontuação Mensal</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">VAMOS LÁ! 🚀</div>
              <div className="text-sm text-gray-600">Complete as reuniões 1-1 para ver sua pontuação! ✅</div>
            </Card>

            {/* Completed 1-1s */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-700">1-1 Realizadas</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">VAMOS LÁ! 🚀</div>
              <div className="text-sm text-gray-600">
                Restam 5 reuniões para atingir o objetivo desse mês! Vamos nessa! 💪
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Agendar 1-1</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <p className="text-gray-600">Escolha um membro e agende uma Reunião 1-1</p>

            {/* Search Input */}
            <Input
              placeholder="Digite o nome para buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Calendar Section */}
            <div>
              <h3 className="font-medium mb-4">Selecione uma data e horário no seu calendário</h3>

              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">Setembro 2025</span>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      h-8 w-8 text-sm rounded-full flex items-center justify-center
                      ${
                        day === selectedDate
                          ? "bg-orange-500 text-white"
                          : day === 27
                            ? "text-orange-500"
                            : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Time */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Duração</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="30 ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Horário</label>
                <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="repeat" checked={repeatMeeting} onCheckedChange={setRepeatMeeting} />
                <label htmlFor="repeat" className="text-sm">
                  Repetir essa reunião
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="message" checked={sendMessage} onCheckedChange={setSendMessage} />
                <label htmlFor="message" className="text-sm">
                  Enviar uma mensagem para ...
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowScheduleModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
                onClick={() => setShowScheduleModal(false)}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDurationModal} onOpenChange={setShowDurationModal}>
        <DialogContent className="max-w-md mx-auto">
          <div className="bg-orange-100 p-6 rounded-t-lg -m-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setShowDurationModal(false)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDurationModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Planejamento</h2>
                <h2 className="text-2xl font-bold text-gray-900">e duração.</h2>
              </div>
              <div className="text-orange-500">
                <Clock className="h-16 w-16" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-6">Quanto tempo irá durar sua reunião?</h3>

            <button
              onClick={() => handleDurationSelect(30)}
              className="w-full p-4 border-2 border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-lg font-medium">MIN</div>
                </div>
                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-700">
                    Indicado para reuniões mais frequentes e curtas, como acompanhamentos rotineiros semanais.
                  </p>
                </div>
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDurationSelect(45)}
              className="w-full p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-lg font-medium">MIN</div>
                </div>
                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-700">
                    Indicado para reuniões com discussões aprofundadas, como upgrades na carreira, mercado de trabalho,
                    mudanças na estrutura da empresa.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDurationSelect(60)}
              className="w-full p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold">60</div>
                  <div className="text-lg font-medium">MIN</div>
                </div>
                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-700">
                    Indicado para reuniões que requerem discussões mais aprofundadas, como mudanças maiores na empresa,
                    ou situações de estresse como assédio e racismo.
                  </p>
                </div>
              </div>
            </button>

            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6">Iniciar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFocusModal} onOpenChange={setShowFocusModal}>
        <DialogContent className="max-w-md mx-auto">
          <div className="bg-orange-100 p-6 rounded-t-lg -m-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Button variant="ghost" size="sm" onClick={() => setShowFocusModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Momento</h2>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">de foco.</h2>
                <p className="text-sm text-gray-700">A reunião vai já começar!</p>
              </div>
              <div className="text-orange-500">
                <Users className="h-16 w-16" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-gray-700">
              A reunião one-on-one é um momento para o colaborador. Deve ser um espaço para ele compartilhar os seus
              avanços, as suas dificuldades, dúvidas, angústias.
            </p>

            <div>
              <h3 className="font-medium mb-3">Procure ...</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Conquistar e preservar a confiança do colaborador para que ele sempre se sinta à vontade para se
                    abrir;
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Valorizar as pautas de cada reunião e sempre dar um retorno sobre as ideias e opiniões
                    compartilhadas;
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Reconhecer os esforços e bons resultados conquistados. Exponha também os pontos que necessitam de
                    melhorias.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Evite ...</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Julgar atitudes e comportamentos. Mostre-se sempre disposto a buscar um entendimento mútuo;
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Demonstrar pressa ou desatenção. Evite também atender ligações, responder e-mails ou atender outras
                    demandas;
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Cancelar ou remarcar a reunião. Isso passa a impressão de que você não se importa;
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowFocusModal(false)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Agora não
              </Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={startMeeting}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
