"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BeltBadge } from "@/components/belt-badge"
import { Plus, Edit, Trash2, BookOpen, Award, Book, Search, Users, Target, Settings } from "lucide-react"
import type { Position, TrailTemplate, Item, ItemType } from "@/lib/types"

// Mock data for positions and trails
const mockPositions: Position[] = [
  {
    id: "1",
    name: "Analista de Marketing Digital",
    description: "Responsável por campanhas de marketing digital e análise de performance",
    department: "Marketing",
    level: "pleno",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Desenvolvedor Frontend",
    description: "Desenvolvimento de interfaces web e mobile",
    department: "Tecnologia",
    level: "pleno",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Customer Success Manager",
    description: "Gestão de relacionamento e sucesso do cliente",
    department: "Customer Success",
    level: "senior",
    createdAt: new Date("2024-01-01"),
  },
]

const mockTrailTemplates: TrailTemplate[] = [
  {
    id: "1",
    positionId: "1",
    name: "Trilha Marketing Digital",
    description: "Desenvolvimento completo para analistas de marketing digital",
    steps: [
      { id: "v0", name: "Fundamentos", belt: "white", order: 0, description: "Conceitos básicos", color: "#ffffff" },
      {
        id: "v1",
        name: "Intermediário",
        belt: "blue",
        order: 1,
        description: "Habilidades intermediárias",
        color: "#3b82f6",
      },
      { id: "v2", name: "Avançado", belt: "purple", order: 2, description: "Especialização", color: "#8b5cf6" },
    ],
    items: [],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export default function AdminTrilhasPage() {
  const [activeTab, setActiveTab] = useState("positions")
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [selectedTrail, setSelectedTrail] = useState<TrailTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingPosition, setIsAddingPosition] = useState(false)
  const [isAddingTrail, setIsAddingTrail] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  // Form states
  const [positionForm, setPositionForm] = useState({
    name: "",
    description: "",
    department: "",
    level: "pleno" as Position["level"],
  })

  const [trailForm, setTrailForm] = useState({
    name: "",
    description: "",
    positionId: "",
  })

  const [itemForm, setItemForm] = useState({
    stepId: "",
    type: "course" as ItemType,
    title: "",
    url: "",
    required: false,
    points: 0,
    description: "",
  })

  const handleAddPosition = () => {
    console.log("Adding position:", positionForm)
    setIsAddingPosition(false)
    setPositionForm({ name: "", description: "", department: "", level: "pleno" })
  }

  const handleAddTrail = () => {
    console.log("Adding trail:", trailForm)
    setIsAddingTrail(false)
    setTrailForm({ name: "", description: "", positionId: "" })
  }

  const handleAddItem = () => {
    console.log("Adding item:", itemForm)
    setIsEditingItem(false)
    setItemForm({ stepId: "", type: "course", title: "", url: "", required: false, points: 0, description: "" })
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item)
    setItemForm({
      stepId: item.stepId,
      type: item.type,
      title: item.title,
      url: item.url || "",
      required: item.required,
      points: item.points,
      description: item.description || "",
    })
    setIsEditingItem(true)
  }

  const filteredPositions = mockPositions.filter(
    (position) =>
      position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administração de Trilhas</h1>
        <p className="text-muted-foreground">Gerencie posições, trilhas de desenvolvimento e cursos por cargo</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Posições
          </TabsTrigger>
          <TabsTrigger value="trails" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Trilhas
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Cursos & Itens
          </TabsTrigger>
        </TabsList>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar posições..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <Dialog open={isAddingPosition} onOpenChange={setIsAddingPosition}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Posição
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Posição</DialogTitle>
                  <DialogDescription>Crie uma nova posição para organizar trilhas de desenvolvimento</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="position-name">Nome da Posição</Label>
                    <Input
                      id="position-name"
                      value={positionForm.name}
                      onChange={(e) => setPositionForm({ ...positionForm, name: e.target.value })}
                      placeholder="Ex: Analista de Marketing Digital"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-description">Descrição</Label>
                    <Textarea
                      id="position-description"
                      value={positionForm.description}
                      onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
                      placeholder="Descreva as responsabilidades da posição..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-department">Departamento</Label>
                    <Input
                      id="position-department"
                      value={positionForm.department}
                      onChange={(e) => setPositionForm({ ...positionForm, department: e.target.value })}
                      placeholder="Ex: Marketing, Tecnologia, Vendas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-level">Nível</Label>
                    <Select
                      value={positionForm.level}
                      onValueChange={(value: Position["level"]) => setPositionForm({ ...positionForm, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Júnior</SelectItem>
                        <SelectItem value="pleno">Pleno</SelectItem>
                        <SelectItem value="senior">Sênior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingPosition(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPosition}>Criar Posição</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{position.name}</CardTitle>
                      <CardDescription>{position.department}</CardDescription>
                    </div>
                    <Badge variant="secondary">{position.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{position.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Posição</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta posição? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trails Tab */}
        <TabsContent value="trails" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select
                value={selectedPosition?.id || "default"}
                onValueChange={(value) => {
                  const position = mockPositions.find((p) => p.id === value)
                  setSelectedPosition(position || null)
                }}
              >
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Selecione uma posição" />
                </SelectTrigger>
                <SelectContent>
                  {mockPositions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name} - {position.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddingTrail} onOpenChange={setIsAddingTrail}>
              <DialogTrigger asChild>
                <Button disabled={!selectedPosition}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Trilha
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Trilha</DialogTitle>
                  <DialogDescription>
                    Crie uma trilha de desenvolvimento para {selectedPosition?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trail-name">Nome da Trilha</Label>
                    <Input
                      id="trail-name"
                      value={trailForm.name}
                      onChange={(e) => setTrailForm({ ...trailForm, name: e.target.value })}
                      placeholder="Ex: Trilha Marketing Digital Avançado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trail-description">Descrição</Label>
                    <Textarea
                      id="trail-description"
                      value={trailForm.description}
                      onChange={(e) => setTrailForm({ ...trailForm, description: e.target.value })}
                      placeholder="Descreva os objetivos desta trilha..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingTrail(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddTrail}>Criar Trilha</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedPosition && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Trilhas para {selectedPosition.name}
                  </CardTitle>
                  <CardDescription>{selectedPosition.description}</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-4">
                {mockTrailTemplates
                  .filter((trail) => trail.positionId === selectedPosition.id)
                  .map((trail) => (
                    <Card key={trail.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{trail.name}</CardTitle>
                            <CardDescription>{trail.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={trail.isActive ? "default" : "secondary"}>
                              {trail.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {trail.steps.map((step) => (
                              <BeltBadge key={step.id} belt={step.belt} degree={1} size="sm" showDegree={false} />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {trail.steps.length} steps • {trail.items.length} itens
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedTrail(trail)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Trilha</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta trilha? Todos os itens associados serão removidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          {selectedTrail ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Gerenciar Itens - {selectedTrail.name}
                      </CardTitle>
                      <CardDescription>Adicione, edite ou remova cursos, certificações e livros</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedTrail(null)}>
                      Voltar às Trilhas
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Select
                    value={itemForm.stepId || "default"}
                    onValueChange={(value) => setItemForm({ ...itemForm, stepId: value })}
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Filtrar por step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os steps</SelectItem>
                      {selectedTrail.steps.map((step) => (
                        <SelectItem key={step.id} value={step.id}>
                          <div className="flex items-center gap-2">
                            <BeltBadge belt={step.belt} degree={1} size="sm" showDegree={false} />
                            {step.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Editar Item" : "Adicionar Novo Item"}</DialogTitle>
                      <DialogDescription>
                        {editingItem
                          ? "Modifique as informações do item"
                          : "Adicione um novo curso, certificação ou livro à trilha"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="item-step">Step</Label>
                          <Select
                            value={itemForm.stepId || "default"}
                            onValueChange={(value) => setItemForm({ ...itemForm, stepId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o step" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedTrail.steps.map((step) => (
                                <SelectItem key={step.id} value={step.id}>
                                  <div className="flex items-center gap-2">
                                    <BeltBadge belt={step.belt} degree={1} size="sm" showDegree={false} />
                                    {step.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="item-type">Tipo</Label>
                          <Select
                            value={itemForm.type}
                            onValueChange={(value: ItemType) => setItemForm({ ...itemForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="course">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Curso
                                </div>
                              </SelectItem>
                              <SelectItem value="cert">
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Certificação
                                </div>
                              </SelectItem>
                              <SelectItem value="book">
                                <div className="flex items-center gap-2">
                                  <Book className="h-4 w-4" />
                                  Livro
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="item-title">Título</Label>
                        <Input
                          id="item-title"
                          value={itemForm.title}
                          onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                          placeholder="Ex: Curso de Marketing Digital Avançado"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-url">URL (opcional)</Label>
                        <Input
                          id="item-url"
                          value={itemForm.url}
                          onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                          placeholder="https://exemplo.com/curso"
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-description">Descrição</Label>
                        <Textarea
                          id="item-description"
                          value={itemForm.description}
                          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                          placeholder="Descreva o conteúdo e objetivos..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="item-points">Pontos</Label>
                          <Input
                            id="item-points"
                            type="number"
                            value={itemForm.points}
                            onChange={(e) => setItemForm({ ...itemForm, points: Number.parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id="item-required"
                            checked={itemForm.required}
                            onChange={(e) => setItemForm({ ...itemForm, required: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="item-required">Item obrigatório</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingItem(false)
                          setEditingItem(null)
                          setItemForm({
                            stepId: "",
                            type: "course",
                            title: "",
                            url: "",
                            required: false,
                            points: 0,
                            description: "",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddItem}>{editingItem ? "Salvar Alterações" : "Adicionar Item"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando cursos, certificações ou livros a esta trilha
                </p>
                <Button onClick={() => setIsEditingItem(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Item
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Selecione uma trilha</h3>
                <p className="text-muted-foreground">
                  Vá para a aba "Trilhas" e clique em "Gerenciar" para editar os itens de uma trilha
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
