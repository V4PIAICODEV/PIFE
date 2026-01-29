"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Trash2 } from "lucide-react"
import { mockUsers, currentUser } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"
import type { User } from "@/lib/types"

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [profileFilter, setProfileFilter] = useState("todos")
  const [inviteFilter, setInviteFilter] = useState("todos")
  const [permissionFilter, setPermissionFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("usuarios")

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "player" as "admin" | "coordinator" | "player",
  })

  const canManageUsers = hasPermission(currentUser, "admin", "canEdit")

  if (!canManageUsers) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para gerenciar usuários.</p>
        </div>
      </div>
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProfile =
      profileFilter === "todos" ||
      (profileFilter === "admin" && user.role === "admin") ||
      (profileFilter === "editor" && user.role === "coordinator")

    return matchesSearch && matchesProfile
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId])
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "coordinator":
        return "Editor"
      case "player":
        return "Usuário"
      default:
        return role
    }
  }

  const getStatusBadge = (user: User) => {
    // Simulating pending invites for some users
    const isPending = user.email.includes("pending") || Math.random() > 0.7
    return isPending ? (
      <Badge variant="outline" className="text-blue-600 border-blue-600">
        Convite pendente
      </Badge>
    ) : null
  }

  const formatLastAccess = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newUser.name}`,
      lastAccess: new Date(),
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "player" })
    setIsAddUserOpen(false)
  }

  const handleDeleteUsers = () => {
    if (selectedUsers.length === 0) return

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${selectedUsers.length} usuário(s)? Esta ação não pode ser desfeita.`,
    )

    if (confirmed) {
      setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
    }
  }

  const handleDeleteSingleUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
    )

    if (confirmed) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Header Filters */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Perfil</span>
          <Select value={profileFilter} onValueChange={setProfileFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="admin">Equipe (Admin+Editor)</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Convite</span>
          <Select value={inviteFilter} onValueChange={setInviteFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="aceito">Aceito</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Permissão de acesso</span>
          <Select value={permissionFilter} onValueChange={setPermissionFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="personalizada">Personalizada</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-6">
        {/* Add User Button */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full w-12 h-12 p-0 bg-green-600 hover:bg-green-700">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome do usuário"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o e-mail do usuário"
                />
              </div>
              <div>
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "coordinator" | "player") =>
                    setNewUser((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Usuário</SelectItem>
                    <SelectItem value="coordinator">Editor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                  Adicionar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Content Area */}
        <div className="flex-1">
          {/* Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setActiveTab("usuarios")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "usuarios"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                USUÁRIOS
              </button>
              <button
                onClick={() => setActiveTab("permissoes")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "permissoes"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                PERMISSÕES DE ACESSO
              </button>
            </div>

            <div className="flex items-center gap-4">
              {selectedUsers.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteUsers} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Excluir ({selectedUsers.length})
                </Button>
              )}
              <span className="text-sm text-muted-foreground">{filteredUsers.length} registros</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b px-4 py-3">
              <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-muted-foreground">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="col-span-4">Usuário</div>
                <div className="col-span-3">E-mail</div>
                <div className="col-span-2">Permissão de acesso</div>
                <div className="col-span-1">Último acesso</div>
                <div className="col-span-1">Ações</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div key={user.id} className="px-4 py-3 hover:bg-muted/30">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </div>

                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-blue-600">{user.name}</div>
                        {getStatusBadge(user)}
                      </div>
                    </div>

                    <div className="col-span-3 text-sm text-muted-foreground">{user.email}</div>

                    <div className="col-span-2">
                      <Badge variant="outline" className="text-xs">
                        {getRoleLabel(user.role)}
                      </Badge>
                      <span className="ml-2 text-sm text-muted-foreground">Personalizada</span>
                    </div>

                    <div className="col-span-1 text-xs text-muted-foreground">{formatLastAccess(new Date())}</div>

                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSingleUser(user.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
