"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currentUser } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"
import { Search, Download, MoreHorizontal, ArrowUpDown, Eye, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  department: string
  engagement: "unknown" | number
  impact: number
  lastOneOnOne: string | null
  avatar?: string
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Ananda Souza",
    role: "Account",
    email: "ananda.souza@empresa.com",
    department: "Joker",
    engagement: "unknown",
    impact: 3,
    lastOneOnOne: "05/08/2025",
    avatar: "/ananda.jpg",
  },
  {
    id: "2",
    name: "Anderson Farias",
    role: "Desenvolvedor Full Stack",
    email: "anderson.farias@empresa.com",
    department: "TECH",
    engagement: 100,
    impact: 5,
    lastOneOnOne: "25/09/2025",
    avatar: "/anderson.jpg",
  },
  {
    id: "3",
    name: "Anderson Matheus Cordeiro do Nascimento",
    role: "Designer",
    email: "anderson.matheus@empresa.com",
    department: "Social Mídia",
    engagement: "unknown",
    impact: 5,
    lastOneOnOne: null,
    avatar: "/anderson-matheus.jpg",
  },
  {
    id: "4",
    name: "Andreas Slonzo",
    role: "Cientista de Dados",
    email: "andreas.slonzo@empresa.com",
    department: "U.S.A",
    engagement: "unknown",
    impact: 4,
    lastOneOnOne: "26/08/2025",
    avatar: "/andreas.jpg",
  },
  {
    id: "5",
    name: "Andressa Dias",
    role: "Analista Financeiro",
    email: "andressa.dias@empresa.com",
    department: "Financeiro",
    engagement: "unknown",
    impact: 4,
    lastOneOnOne: "01/09/2025",
    avatar: "/andressa.jpg",
  },
]

export default function TimePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const canViewTeam = hasPermission(currentUser, "pnp", "canView")

  if (!canViewTeam) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground mb-4">
                Você não tem permissão para visualizar a lista de membros da equipe.
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com um administrador se precisar de acesso a esta funcionalidade.
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aValue: any = a[sortBy as keyof TeamMember]
    let bValue: any = b[sortBy as keyof TeamMember]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = sortedMembers.slice(startIndex, endIndex)

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const renderEngagement = (engagement: "unknown" | number) => {
    if (engagement === "unknown") {
      return <span className="text-gray-400">Desconhecido</span>
    }
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${engagement}%` }} />
        </div>
        <span className="text-sm font-medium">{engagement}%</span>
      </div>
    )
  }

  const renderLastOneOnOne = (date: string | null) => {
    if (!date) {
      return <span className="text-gray-400">Nenhum Feedback Realizado</span>
    }
    return <span>{date}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Lista de Membros ({sortedMembers.length})</h1>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="flex items-center space-x-1 p-0 h-auto font-medium"
                    >
                      <span>Nome</span>
                      <Search className="h-4 w-4" />
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("role")}
                      className="flex items-center space-x-1 p-0 h-auto font-medium"
                    >
                      <span>Cargo</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("engagement")}
                      className="flex items-center space-x-1 p-0 h-auto font-medium"
                    >
                      <span>Engajamento</span>
                      <Eye className="h-4 w-4" />
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("impact")}
                      className="flex items-center space-x-1 p-0 h-auto font-medium"
                    >
                      <span>Impacto</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("lastOneOnOne")}
                      className="flex items-center space-x-1 p-0 h-auto font-medium"
                    >
                      <span>Última 1-1</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={member.avatar || `/placeholder.svg?height=40&width=40&query=${member.name}`}
                          />
                          <AvatarFallback className="bg-red-500 text-white font-bold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/time/${member.id}`}
                            className="font-medium hover:text-blue-600 hover:underline cursor-pointer"
                          >
                            {member.name}
                          </Link>
                          <Badge variant="secondary" className="text-xs">
                            #{member.department}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{member.role}</span>
                    </td>
                    <td className="py-4 px-4">{renderEngagement(member.engagement)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold">
                        {member.impact}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{renderLastOneOnOne(member.lastOneOnOne)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Linhas por página:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, sortedMembers.length)} de {sortedMembers.length}
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
