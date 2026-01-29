"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { ArrowLeft, Calendar, Plus, Trash2, LinkIcon, Search, X, Info, Edit, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import NextLink from "next/link"

interface Employee {
  id: string
  name: string
  startDate: string
  endDate: string
  acquisitionPeriod: string
  soldDays: number
  restDays: number
  totalBalance: number
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Ananda Souza",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 10,
  },
  {
    id: "2",
    name: "Anderson Farias",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 20,
  },
  {
    id: "3",
    name: "Anderson Matheus Cordeiro do Nas...",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 10,
  },
  {
    id: "4",
    name: "Andreas Slonzo",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 28,
  },
  {
    id: "5",
    name: "Andressa Dias",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 18,
  },
  {
    id: "6",
    name: "António Derick",
    startDate: "06/10/2025",
    endDate: "20/10/2025",
    acquisitionPeriod: "04/2024 - 04/2025",
    soldDays: 0,
    restDays: 15,
    totalBalance: 133,
  },
  {
    id: "7",
    name: "Arthur Guilherme Machado Pinto",
    startDate: "",
    endDate: "",
    acquisitionPeriod: "",
    soldDays: 0,
    restDays: 0,
    totalBalance: 8,
  },
]

export default function GerenciarPeriodoDescanso() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("todos")
  const [employeeData, setEmployeeData] = useState(employees)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCollectiveModalOpen, setIsCollectiveModalOpen] = useState(false)
  const [collectiveStartDate, setCollectiveStartDate] = useState<Date>()
  const [collectiveEndDate, setCollectiveEndDate] = useState<Date>()
  const [exceptionsText, setExceptionsText] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [configSettings, setConfigSettings] = useState({
    firstAcquisitionYear: "2024-01-01",
    respectAvailableBalance: true,
    minimumVacationDays: true,
    minimumBalanceForVacation: true,
    avoidWeekendStart: true,
    minimumConcessionPeriod: true,
    advanceScheduling: true,
    useFullVacationPeriod: true,
    thirteenthSalaryRequest: true,
    pecuniaryAllowance: true,
    emailNotifications: true,
    notifyPeriodStart: {
      administrator: "60",
      leader: "30",
      collaborator: "60",
    },
    notifyVacationExpiry: {
      administrator: "60",
      leader: "60",
      collaborator: "60",
    },
    vacationRequests: true,
    acceptRejectNotifications: true,
    blockList: "",
  })

  const filteredEmployees = employeeData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDateChange = (employeeId: string, field: "startDate" | "endDate", value: string) => {
    setEmployeeData((prev) => prev.map((emp) => (emp.id === employeeId ? { ...emp, [field]: value } : emp)))
  }

  const handlePeriodChange = (employeeId: string, value: string) => {
    setEmployeeData((prev) => prev.map((emp) => (emp.id === employeeId ? { ...emp, acquisitionPeriod: value } : emp)))
  }

  const addRestPeriod = (employeeId: string) => {
    console.log("Adding rest period for employee:", employeeId)
  }

  const deleteRestPeriod = (employeeId: string) => {
    console.log("Deleting rest period for employee:", employeeId)
  }

  const handleAddRestPeriod = () => {
    // Implementation for adding rest period
    setIsAddModalOpen(false)
  }

  const handleAddCollectiveRestPeriod = () => {
    // Implementation for adding collective rest period
    console.log("Adding collective rest period:", {
      startDate: collectiveStartDate,
      endDate: collectiveEndDate,
      exceptions: exceptionsText,
    })
    setIsCollectiveModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <NextLink href="/periodo-descanso" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">PERÍODO DE DESCANSO</span>
          </NextLink>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Período de Descanso</h1>

          <div className="flex items-center gap-3">
            <Dialog open={isCollectiveModalOpen} onOpenChange={setIsCollectiveModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Período de Descanso Coletivo</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Período de Descanso Coletivo</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p>
                          Os Períodos de Descanso Coletivos permitem que vários colaboradores com tipo de contrato CLT
                          sejam incluídos simultaneamente no período de descanso. Para isso, é essencial que o
                          administrador utilize o componente "Adicionar todos, exceto" para registrar as exceções, ou
                          seja, os colaboradores que não participarão dos períodos de descanso coletivos. Períodos de
                          Descanso Coletivos podem ser concedidas a todos os empregados CLT ou apenas a determinados
                          setores ou estabelecimentos da empresa e podem ser divididas em dois períodos anuais, desde
                          que nenhum seja inferior a 10 dias corridos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Adicionar todos, exceto</label>
                      <Textarea
                        value={exceptionsText}
                        onChange={(e) => setExceptionsText(e.target.value)}
                        placeholder="Liste os colaboradores que não participarão do período de descanso coletivo..."
                        className="min-h-[120px] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Data de início</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !collectiveStartDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {collectiveStartDate
                              ? format(collectiveStartDate, "PPP", { locale: ptBR })
                              : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={collectiveStartDate}
                            onSelect={setCollectiveStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Data final</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !collectiveEndDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {collectiveEndDate
                              ? format(collectiveEndDate, "PPP", { locale: ptBR })
                              : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={collectiveEndDate}
                            onSelect={setCollectiveEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddCollectiveRestPeriod}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!collectiveStartDate || !collectiveEndDate}
                    >
                      Adicionar
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Calendar className="h-4 w-4" />
                      Histórico
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Adicionar Período de Descanso</Button>
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
                          empregador tem até 12 meses para concedê-las. Nisso, há direito a 30 dias corridos de Período
                          de Descanso, que podem ser fracionados em até 3x, desde que um dos períodos seja de pelo menos
                          14 dias e os demais não sejam inferiores a 5. O fracionamento deve ser acordado entre
                          empregador e empregado. Ao solicitar abono de Período de Descanso, atente-se ao prazo, pois o
                          abono de Período de Descanso deverá ser requerido até 15 (quinze) dias antes do término do
                          período aquisitivo.
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
                          <SelectItem value="felipe">Felipe Cunha Fernandes</SelectItem>
                          <SelectItem value="antonio">Antônio Derick</SelectItem>
                          <SelectItem value="jussara">Jussara Santos</SelectItem>
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
                          <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
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
                          <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
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
                    disabled={!selectedEmployee || !startDate || !endDate || !selectedYear}
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="border-gray-300 bg-transparent"
              onClick={() => setShowConfigModal(true)}
            >
              Configurações de Períodos de Descanso
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Colaboradores</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todos os times" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os times</SelectItem>
                    <SelectItem value="tech">TECH</SelectItem>
                    <SelectItem value="sox">S.O.X.</SelectItem>
                    <SelectItem value="cyber">Cyber Crew</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Início</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fim</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Período aquisitivo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Dias vendidos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Gozo de descanso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Saldo total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{employee.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <Input
                          type="date"
                          value={employee.startDate}
                          onChange={(e) => handleDateChange(employee.id, "startDate", e.target.value)}
                          className="w-36"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <Input
                          type="date"
                          value={employee.endDate}
                          onChange={(e) => handleDateChange(employee.id, "endDate", e.target.value)}
                          className="w-36"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Select
                        value={employee.acquisitionPeriod}
                        onValueChange={(value) => handlePeriodChange(employee.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="04/2024 - 04/2025">04/2024 - 04/2025</SelectItem>
                          <SelectItem value="05/2024 - 05/2025">05/2024 - 05/2025</SelectItem>
                          <SelectItem value="06/2024 - 06/2025">06/2024 - 06/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{employee.soldDays}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{employee.restDays}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{employee.totalBalance}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addRestPeriod(employee.id)}
                          className="h-8 w-8 p-0 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRestPeriod(employee.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Configurações de Períodos de Descanso</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowConfigModal(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* 1º ano aquisitivo */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">1º ano aquisitivo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Data em que Períodos de Descanso começarão a contar na sua empresa. Essa informação é importante para
                  que não sejam calculados os períodos aquisitivos de colaboradores muito antigos.
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      type="date"
                      value={configSettings.firstAcquisitionYear}
                      onChange={(e) => setConfigSettings((prev) => ({ ...prev, firstAcquisitionYear: e.target.value }))}
                      placeholder="1º ano aquisitivo"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Dias de Períodos de Descanso por contrato */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dias de Períodos de Descanso por contrato</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Aqui é possível definir a quantidade de dias de para modalidades de contratos flexíveis (os que não
                  são CLT nem estágio, pois estes seguem a lei)
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Notificações */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notificações</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure o envio de notificações, escolhendo destinatários (administradores, líderes ou
                    colaboradores) e definindo a antecedência (quantos dias antes do início do período concessivo ou do
                    vencimento será o envio). Administradores serão notificados sobre todos os colaboradores, líderes
                    apenas sobre o seu time e colaboradores sobre si mesmos.
                  </p>
                </div>

                {/* Email notifications toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      Habilitar envio de email de notificação de Períodos de Descanso
                    </span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <Switch
                    checked={configSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setConfigSettings((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                {/* Notificar início do período concessivo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Notificar início do período concessivo</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Administrador</label>
                      <Select
                        value={configSettings.notifyPeriodStart.administrator}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyPeriodStart: { ...prev.notifyPeriodStart, administrator: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Líder</label>
                      <Select
                        value={configSettings.notifyPeriodStart.leader}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyPeriodStart: { ...prev.notifyPeriodStart, leader: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colaborador</label>
                      <Select
                        value={configSettings.notifyPeriodStart.collaborator}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyPeriodStart: { ...prev.notifyPeriodStart, collaborator: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notificar vencimento das férias */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Notificar vencimento das férias</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Administrador</label>
                      <Select
                        value={configSettings.notifyVacationExpiry.administrator}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyVacationExpiry: { ...prev.notifyVacationExpiry, administrator: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Líder</label>
                      <Select
                        value={configSettings.notifyVacationExpiry.leader}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyVacationExpiry: { ...prev.notifyVacationExpiry, leader: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colaborador</label>
                      <Select
                        value={configSettings.notifyVacationExpiry.collaborator}
                        onValueChange={(value) =>
                          setConfigSettings((prev) => ({
                            ...prev,
                            notifyVacationExpiry: { ...prev.notifyVacationExpiry, collaborator: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional notification toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Solicitações de Períodos de Descanso</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <Switch
                      checked={configSettings.vacationRequests}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, vacationRequests: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        Notificar aceite e recusa de Períodos de Descanso
                      </span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <Switch
                      checked={configSettings.acceptRejectNotifications}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, acceptRejectNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                {/* Bloqueio de Notificações */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">Bloqueio de Notificações</span>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lista de Bloqueio</label>
                    <Textarea
                      value={configSettings.blockList}
                      onChange={(e) => setConfigSettings((prev) => ({ ...prev, blockList: e.target.value }))}
                      placeholder="Digite os emails ou nomes para bloquear notificações..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Gestão de Normas CLT */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Gestão de Normas CLT</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    A gestão de normas permite ativar ou desativar as regras estabelecidas na legislação trabalhista.
                    Com as regras ativas, a TeamGuide restringe lançamentos de férias de acordo com as regras; com elas
                    desativadas, oferece mais flexibilidade. Aplicável apenas em colaboradores com tipo de contrato CLT
                    na plataforma e Administradores poderão adicionar férias que não se adequam a alguma regra ativada.
                  </p>
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                    <Info className="h-4 w-4 mr-2" />
                    Consulte a CLT
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      Os dias de férias selecionados respeitarão o saldo disponível.
                    </span>
                    <Switch
                      checked={configSettings.respectAvailableBalance}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, respectAvailableBalance: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Um lançamento de férias deve ter, no mínimo, 5 dias.</span>
                    <Switch
                      checked={configSettings.minimumVacationDays}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, minimumVacationDays: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      Para dar férias a um colaborador, ele deve ter um saldo mínimo de 5 dias.
                    </span>
                    <Switch
                      checked={configSettings.minimumBalanceForVacation}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, minimumBalanceForVacation: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      O início do gozo de férias deve ser programado para não coincidir com os dois dias que antecedem o
                      descanso semanal remunerado ou feriado.
                    </span>
                    <Switch
                      checked={configSettings.avoidWeekendStart}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, avoidWeekendStart: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      No período concessivo, é necessário ter um período de férias com pelo menos 14 dias.
                    </span>
                    <Switch
                      checked={configSettings.minimumConcessionPeriod}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, minimumConcessionPeriod: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      A programação das férias deve ser feita com pelo menos 30 dias de antecedência do seu início.
                    </span>
                    <Switch
                      checked={configSettings.advanceScheduling}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, advanceScheduling: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      O colaborador deve gozar os 30 dias de férias dentro do seu período concessivo.
                    </span>
                    <Switch
                      checked={configSettings.useFullVacationPeriod}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, useFullVacationPeriod: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      A solicitação do adiantamento do 13º deve ser feita até janeiro do ano correspondente.
                    </span>
                    <Switch
                      checked={configSettings.thirteenthSalaryRequest}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, thirteenthSalaryRequest: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      O abono pecuniário é de 1/3 do período total de férias (10 dias)
                    </span>
                    <Switch
                      checked={configSettings.pecuniaryAllowance}
                      onCheckedChange={(checked) =>
                        setConfigSettings((prev) => ({ ...prev, pecuniaryAllowance: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setShowConfigModal(false)}
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
