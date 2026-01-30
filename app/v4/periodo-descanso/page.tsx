"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, Filter, CalendarIcon, Check, X, Info, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Colaborador {
  id: string
  name: string
  email: string
  position: string
  avatar: string
  team: string
  squadId: string | null
}

interface RestPeriod {
  id: string
  employee: {
    name: string
    avatar: string
    team: string
    position: string
  }
  startDate: string
  endDate: string
  restDays: number
  soldDays: number
  acquisitivePeriod: string
  remainingDays: number
  daysUntilStart: number
  contractType: string
  status: "solicitado" | "pendente" | "aprovado" | "em-descanso" | "vencido"
}

const statusConfig: Record<string, { label: string; color: string }> = {
  solicitado: { label: "Solicitado", color: "bg-blue-100 text-blue-800" },
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  aprovado: { label: "Aprovado", color: "bg-green-100 text-green-800" },
  "em-descanso": { label: "Em descanso", color: "bg-purple-100 text-purple-800" },
  vencido: { label: "Vencido", color: "bg-red-100 text-red-800" },
  rejeitado: { label: "Rejeitado", color: "bg-gray-100 text-gray-800" },
}

const getStatusConfig = (status: string) => {
  return statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800" }
}

export default function PeriodoDescansoPage() {
  const router = useRouter()
  
  // Fetch rest periods from API
  const { data: restPeriods = [], mutate, isLoading } = useSWR<RestPeriod[]>("/api/v4/rest-periods", fetcher)
  
  // Fetch colaboradores for select
  const { data: colaboradores = [] } = useSWR<Colaborador[]>("/api/v4/colaboradores", fetcher)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get unique teams for filter
  const teams = Array.from(new Set(colaboradores.map((c) => c.team).filter(Boolean)))

  // Calculate status counts
  const statusCounts = {
    programacao: restPeriods.filter((p) => p.status === "solicitado").length,
    aVencer: restPeriods.filter((p) => p.status === "pendente" && p.daysUntilStart <= 7).length,
    emDescanso: restPeriods.filter((p) => p.status === "em-descanso").length,
    proximos: restPeriods.filter((p) => p.daysUntilStart > 0 && p.daysUntilStart <= 30).length,
    vencidas: restPeriods.filter((p) => p.status === "vencido").length,
  }

  const filteredPeriods = restPeriods.filter((period) => {
    const matchesSearch =
      period.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      period.employee.team.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = selectedTeam === "todos" || period.employee.team === selectedTeam
    return matchesSearch && matchesTeam
  })

  // Group periods by month/year
  const groupedPeriods = filteredPeriods.reduce(
    (acc, period) => {
      try {
        const dateParts = period.startDate?.split("/")
        if (!dateParts || dateParts.length !== 3) return acc
        
        const [day, month, year] = dateParts
        const monthName = new Date(Number.parseInt(year), Number.parseInt(month) - 1).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })
        const key = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`

        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(period)
      } catch (e) {
        console.error("Error grouping period:", e)
      }
      return acc
    },
    {} as Record<string, RestPeriod[]>,
  )

  const handleAddRestPeriod = async () => {
    if (!selectedEmployee || !startDate || !endDate || !selectedYear) return

    setIsSubmitting(true)
    try {
      const restDays = differenceInDays(endDate, startDate) + 1
      const yearNum = parseInt(selectedYear)

      const response = await fetch("/api/v4/rest-periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedEmployee,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          restDays,
          soldDays: 0,
          acquisitivePeriodStart: new Date(yearNum - 1, 0, 1).toISOString(),
          acquisitivePeriodEnd: new Date(yearNum - 1, 11, 31).toISOString(),
          remainingDays: 30 - restDays,
        }),
      })

      if (response.ok) {
        mutate() // Refresh the data
        setIsAddModalOpen(false)
        setSelectedEmployee("")
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectedYear("")
      }
    } catch (error) {
      console.error("Error adding rest period:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/v4/rest-periods/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "aprovado" }),
      })

      if (response.ok) {
        mutate() // Refresh the data
      }
    } catch (error) {
      console.error("Error approving rest period:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/v4/rest-periods/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutate() // Refresh the data
      }
    } catch (error) {
      console.error("Error rejecting rest period:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Período de Descanso</h1>
        <div className="flex gap-3">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">Adicionar Período de Descanso</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Período de Descanso</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p>
                        Por lei, o profissional CLT pode pedir Período de Descanso após trabalhar por um ano, e o
                        empregador tem até 12 meses para concedê-las. Nisso, há direito a 30 dias corridos de Período de
                        Descanso, que podem ser fracionados em até 3x, desde que um dos períodos seja de pelo menos 14
                        dias e os demais não sejam inferiores a 5. O fracionamento deve ser acordado entre empregador e
                        empregado. Ao solicitar abono de Período de Descanso, atente-se ao prazo, pois o abono de
                        Período de Descanso deverá ser requerido até 15 (quinze) dias antes do término do período
                        aquisitivo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Colaborador</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {colaboradores.map((colaborador) => (
                          <SelectItem key={colaborador.id} value={colaborador.id}>
                            {colaborador.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Data de início</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Data final</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ano aquisitivo</label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleAddRestPeriod}
                  className="w-full"
                  disabled={!selectedEmployee || !startDate || !endDate || !selectedYear || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => router.push("/periodo-descanso/gerenciar")}>
            Gerenciar Períodos de Descanso →
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Programação</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {statusCounts.programacao}
            </Badge>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">A vencer</span>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {statusCounts.aVencer}
            </Badge>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Em descanso</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {statusCounts.emDescanso}
            </Badge>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próximos</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {statusCounts.proximos}
            </Badge>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Vencidas</span>
            <Badge variant="secondary" className="bg-gray-600 text-white">
              {statusCounts.vencidas}
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Programação de Períodos de Descanso</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os times</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Colaborador</th>
                <th className="text-left p-4 font-medium">Times</th>
                <th className="text-left p-4 font-medium">Início</th>
                <th className="text-left p-4 font-medium">Fim</th>
                <th className="text-left p-4 font-medium">Dias de descanso</th>
                <th className="text-left p-4 font-medium">Dias vendidos</th>
                <th className="text-left p-4 font-medium">Período aquisitivo</th>
                <th className="text-left p-4 font-medium">Saldo de dias</th>
                <th className="text-left p-4 font-medium">Dias até começar</th>
                <th className="text-left p-4 font-medium">Tipo de contrato</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Carregando períodos de descanso...</span>
                    </div>
                  </td>
                </tr>
              ) : Object.entries(groupedPeriods).length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-muted-foreground">
                    Nenhum período de descanso encontrado. Clique em "Adicionar Período de Descanso" para começar.
                  </td>
                </tr>
              ) : (
                Object.entries(groupedPeriods).map(([monthYear, periods]) => (
                <>
                  <tr key={`header-${monthYear}`} className="bg-muted/30">
                    <td colSpan={12} className="p-4 font-semibold">
                      {monthYear} ({periods.length})
                    </td>
                  </tr>
                  {periods.map((period) => (
                    <tr key={period.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={period.employee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {period.employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{period.employee.name}</div>
                            {period.employee.position && (
                              <div className="text-sm text-muted-foreground">{period.employee.position}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{period.employee.team}</td>
                      <td className="p-4">{period.startDate}</td>
                      <td className="p-4">{period.endDate}</td>
                      <td className="p-4">{period.restDays}</td>
                      <td className="p-4">{period.soldDays}</td>
                      <td className="p-4">{period.acquisitivePeriod}</td>
                      <td className="p-4">{period.remainingDays}</td>
                      <td className="p-4">{period.daysUntilStart}</td>
                      <td className="p-4">{period.contractType}</td>
                      <td className="p-4">
                        <Badge className={getStatusConfig(period.status).color}>{getStatusConfig(period.status).label}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(period.id)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(period.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
