"use client"

import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  Play,
  MoreHorizontal,
  Plus,
  Filter,
  Users,
  BookOpen,
  CheckCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const staticLeaders = [
  {
    id: "1",
    name: "Marcus Vinícius Galissi Massaki",
    role: "Head",
    photo: "/placeholder.svg?height=40&width=40",
    date: "2 Set",
    status: "scheduled",
  },
  {
    id: "2",
    name: "Nathalia Fernandes",
    role: "CS",
    photo: "/placeholder.svg?height=40&width=40",
    date: "2 Set",
    status: "scheduled",
  },
  {
    id: "3",
    name: "Antônio Derick",
    role: "",
    photo: "/placeholder.svg?height=40&width=40",
    date: "3 Set",
    status: "scheduled",
  },
  {
    id: "4",
    name: "Rodolfo Lavinas",
    role: "Head",
    photo: "/placeholder.svg?height=40&width=40",
    date: "16 Set",
    status: "scheduled",
  },
]

export default function OneOnOneMeetings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">1-1 Liderados</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-gray-700 bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar 1-1
            </Button>
            <Button variant="outline" size="sm" className="text-gray-700 bg-transparent">
              <Play className="h-4 w-4 mr-2" />
              Iniciar agora
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Setembro | 2025</h2>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">N/A</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Card className="mb-6 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Reuniões 1-1</h3>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 px-2 py-1 h-auto">
                      obrigatórias
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <span className="text-xs bg-gray-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        ?
                      </span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/6 h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">1/6</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 text-left font-medium text-gray-600 text-sm">Liderados</th>
                        <th className="py-3 text-left font-medium text-gray-600 text-sm">Data</th>
                        <th className="py-3 text-left font-medium text-gray-600 text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staticLeaders.map((leader) => (
                        <tr key={leader.id} className="border-b border-gray-100">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={leader.photo || "/placeholder.svg"}
                                  alt={leader.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-medium">@</span>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900">{leader.name}</div>
                                {leader.role && <div className="text-xs text-gray-500">{leader.role}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">
                              {leader.date}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <Calendar className="h-4 w-4 text-orange-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <Play className="h-4 w-4 text-orange-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Todas as ações</h3>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Ação
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    As tarefas criadas durante as reuniões estarão aqui para acompanhamento de status e prazos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Achievements Card */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-gray-900">Minhas Conquistas</h3>
                <div className="text-center mb-4">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Nicholas Ferreira"
                      fill
                      className="rounded-full object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">1</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Nicholas Ferreira</p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-600">0/5</span>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-600">1/6</span>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-600">0/0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Score Card */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-orange-500" />
                  <h4 className="font-medium text-orange-500">Pontuação Mensal</h4>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-gray-900">VAMOS LÁ! 🚀</p>
                  <p className="text-xs text-gray-600 mt-1">Complete as reuniões 1-1 para ver sua pontuação! ✅</p>
                </div>
              </CardContent>
            </Card>

            {/* Completed 1-1s Card */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium text-blue-500">1-1 Realizadas</h4>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">VAMOS LÁ! 🚀</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Restam 5 reuniões para atingir o objetivo desse mês! Vamos nessa! 💪
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
