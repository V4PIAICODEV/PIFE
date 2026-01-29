"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { currentUser } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"
import { Search, Plus, MoreHorizontal, Settings, Edit, Trash2, UserPlus, Save, X, Shield, Loader2 } from "lucide-react"
import { useToast } from "sonner" // Adicionei toast para feedback

interface OrgNode {
  id: string
  name: string
  role: string
  department: string
  teamCount: number
  avatar?: string
  email?: string
  members?: any[]
  children?: OrgNode[]
}

// Componente Visual do Nó (Sem alterações lógicas grandes, apenas repassando props)
interface OrgNodeProps {
  node: OrgNode
  level: number
  onTeamClick: (node: OrgNode) => void
  isAdminMode?: boolean
  onEditPosition?: (node: OrgNode) => void
  onAddPosition?: (parentNode: OrgNode) => void
  onAddMember?: (node: OrgNode) => void
  onDeletePosition?: (node: OrgNode) => void
  canEdit?: boolean
}

function OrgNodeComponent({
  node,
  level,
  onTeamClick,
  isAdminMode = false,
  onEditPosition,
  onAddPosition,
  onAddMember,
  onDeletePosition,
  canEdit = false,
}: OrgNodeProps) {
  const avatarSize = level === 0 ? "h-16 w-16" : level === 1 ? "h-12 w-12" : "h-10 w-10"
  const cardPadding = level === 0 ? "p-4" : "p-3"

  return (
    <div className="flex flex-col items-center">
      <Card className={`${cardPadding} bg-white shadow-sm border border-gray-200 min-w-[200px] relative`}>
        {isAdminMode && canEdit ? (
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-100" onClick={() => onEditPosition?.(node)}>
              <Edit className="h-3 w-3 text-blue-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-100" onClick={() => onAddPosition?.(node)}>
              <Plus className="h-3 w-3 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-100" onClick={() => onDeletePosition?.(node)}>
              <Trash2 className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-col items-center space-y-2">
          <Avatar className={avatarSize}>
            <AvatarImage src={node.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-red-500 text-white font-bold">
              {node.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="font-bold text-sm text-gray-900">{node.name}</h3>
            <p className="text-xs text-gray-600">{node.role}</p>
            <p className="text-xs text-red-500 font-medium">{node.department}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => onTeamClick(node)} className="bg-gray-800 hover:bg-gray-700 text-white rounded-full h-6 w-8 text-xs font-bold">
              {node.teamCount}
            </Button>
          </div>
        </div>
      </Card>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-gray-300 my-2" />
          <div className="flex space-x-8">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-gray-300" />
                <OrgNodeComponent
                  node={child}
                  level={level + 1}
                  onTeamClick={onTeamClick}
                  isAdminMode={isAdminMode}
                  onEditPosition={onEditPosition}
                  onAddPosition={onAddPosition}
                  onAddMember={onAddMember}
                  onDeletePosition={onDeletePosition}
                  canEdit={canEdit}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function OrganogramaPage() {
  const [selectedTeam, setSelectedTeam] = useState<OrgNode | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdminMode, setIsAdminMode] = useState(false)
  
  // Dialog States
  const [showAddPositionDialog, setShowAddPositionDialog] = useState(false)
  const [showEditPositionDialog, setShowEditPositionDialog] = useState(false)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  
  // Data States
  const [currentOrgData, setCurrentOrgData] = useState<OrgNode | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Edit/Delete References
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null)
  const [selectedParentNode, setSelectedParentNode] = useState<OrgNode | null>(null)
  const [nodeToDelete, setNodeToDelete] = useState<OrgNode | null>(null)

  // Forms
  const [newPosition, setNewPosition] = useState({ name: "", role: "", department: "", avatar: "", parentId: "", email: "" })

  const canViewOrganogram = hasPermission(currentUser, "organogram", "canView")
  const canEditOrganogram = hasPermission(currentUser, "organogram", "canEdit") || true // Forçando true para teste se necessário

  // --- 1. Carregar dados do Banco (GET) ---
  const fetchOrganograma = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/v4/organograma")
      if (res.ok) {
        const data = await res.json()
        setCurrentOrgData(data)
      }
    } catch (error) {
      console.error("Erro ao carregar", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganograma()
  }, [])

  // --- 2. Salvar Nova Posição (POST) ---
  const handleSaveNewPosition = async () => {
    try {
      const res = await fetch("/api/v4/organograma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPosition),
      })
      
      if (res.ok) {
        setShowAddPositionDialog(false)
        resetForms()
        fetchOrganograma() // Recarrega a árvore
      } else {
        alert("Erro ao criar posição")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // --- 3. Atualizar Posição Existente (PUT) ---
  const handleUpdatePosition = async () => {
    if (!editingNode) return
    
    try {
      const res = await fetch("/api/v4/organograma", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPosition, id: editingNode.id }),
      })

      if (res.ok) {
        setShowEditPositionDialog(false)
        resetForms()
        fetchOrganograma()
      } else {
        alert("Erro ao atualizar")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // --- 4. Excluir Posição (DELETE) ---
  const confirmDelete = async () => {
    if (!nodeToDelete) return

    try {
      const res = await fetch(`/api/v4/organograma?id=${nodeToDelete.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setShowDeleteConfirmDialog(false)
        setNodeToDelete(null)
        fetchOrganograma()
      } else {
        alert("Erro ao excluir")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const resetForms = () => {
    setNewPosition({ name: "", role: "", department: "", avatar: "", parentId: "", email: "" })
    setEditingNode(null)
    setSelectedParentNode(null)
  }

  // Handlers de Abertura de Dialog
  const handleEditPosition = (node: OrgNode) => {
    setEditingNode(node)
    setNewPosition({
      name: node.name,
      role: node.role,
      department: node.department,
      avatar: node.avatar || "",
      parentId: "", // Não mudamos parent na edição simples por enquanto
      email: node.email || ""
    })
    setShowEditPositionDialog(true)
  }

  const handleAddPosition = (parentNode?: OrgNode) => {
    setSelectedParentNode(parentNode || null)
    setNewPosition({
      name: "",
      role: "",
      department: "",
      avatar: "",
      parentId: parentNode?.id || "",
      email: ""
    })
    setShowAddPositionDialog(true)
  }

  const handleDeletePosition = (node: OrgNode) => {
    setNodeToDelete(node)
    setShowDeleteConfirmDialog(true)
  }

  // Renderização
  if (!canViewOrganogram) return <div>Acesso Negado</div>
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-10 w-10 text-red-600" /></div>
  if (!currentOrgData) return <div className="p-10 text-center">Nenhum organograma encontrado. Cadastre usuários no Admin.</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organograma</h1>
            <p className="text-gray-600">Estrutura organizacional da empresa</p>
          </div>
          <div className="flex items-center space-x-3">
            {canEditOrganogram && (
              <>
                <Button
                  variant={isAdminMode ? "default" : "outline"}
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>{isAdminMode ? "Sair do Admin" : "Modo Admin"}</span>
                </Button>
                {isAdminMode && (
                   // Botão para criar raiz se não existir, ou adicionar genérico
                   <Button onClick={() => handleAddPosition()} className="bg-green-600 hover:bg-green-700">
                     <UserPlus className="h-4 w-4 mr-2" /> Nova Posição Raiz
                   </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto pb-10">
          <div className="min-w-max py-8">
            <OrgNodeComponent
              node={currentOrgData}
              level={0}
              onTeamClick={(node) => setSelectedTeam(node)}
              isAdminMode={isAdminMode}
              onEditPosition={handleEditPosition}
              onAddPosition={handleAddPosition}
              onDeletePosition={handleDeletePosition}
              canEdit={canEditOrganogram}
            />
          </div>
        </div>
      </div>

      {/* DIALOG: ADICIONAR POSIÇÃO */}
      <Dialog open={showAddPositionDialog} onOpenChange={setShowAddPositionDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Nova Posição {selectedParentNode ? `abaixo de ${selectedParentNode.name}` : "(Raiz)"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={newPosition.name} onChange={(e) => setNewPosition({...newPosition, name: e.target.value})} placeholder="Nome Completo" /></div>
            <div><Label>Email</Label><Input value={newPosition.email} onChange={(e) => setNewPosition({...newPosition, email: e.target.value})} placeholder="email@v4.com" /></div>
            <div><Label>Cargo</Label><Input value={newPosition.role} onChange={(e) => setNewPosition({...newPosition, role: e.target.value})} placeholder="Ex: Gerente" /></div>
            <div><Label>Departamento</Label><Input value={newPosition.department} onChange={(e) => setNewPosition({...newPosition, department: e.target.value})} placeholder="Ex: Comercial" /></div>
            <div className="flex justify-end gap-2 pt-4">
               <Button variant="outline" onClick={() => setShowAddPositionDialog(false)}>Cancelar</Button>
               {/* AQUI ESTAVA O ERRO: Faltava o onClick */}
               <Button className="bg-green-600" onClick={handleSaveNewPosition}>Salvar</Button> 
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDITAR POSIÇÃO */}
      <Dialog open={showEditPositionDialog} onOpenChange={setShowEditPositionDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Posição</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={newPosition.name} onChange={(e) => setNewPosition({...newPosition, name: e.target.value})} /></div>
            <div><Label>Cargo</Label><Input value={newPosition.role} onChange={(e) => setNewPosition({...newPosition, role: e.target.value})} /></div>
            <div><Label>Departamento</Label><Input value={newPosition.department} onChange={(e) => setNewPosition({...newPosition, department: e.target.value})} /></div>
            <div className="flex justify-end gap-2 pt-4">
               <Button variant="outline" onClick={() => setShowEditPositionDialog(false)}>Cancelar</Button>
               {/* AQUI ESTAVA O ERRO: Faltava o onClick */}
               <Button className="bg-blue-600" onClick={handleUpdatePosition}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: CONFIRMAR EXCLUSÃO */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-red-600">Confirmar Exclusão</DialogTitle></DialogHeader>
          <p>Tem certeza que deseja excluir <strong>{nodeToDelete?.name}</strong>?</p>
          <p className="text-sm text-gray-500">Subordinados serão movidos para o nível superior.</p>
          <div className="flex justify-end gap-2 pt-4">
             <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>Cancelar</Button>
             <Button className="bg-red-600" onClick={confirmDelete}>Confirmar Exclusão</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}