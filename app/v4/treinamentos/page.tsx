"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currentUser } from "@/lib/mock-data"
import { Plus, Search, Play, Clock, Upload, Eye } from "lucide-react"

// Mock training data
const mockTrainings = [
  {
    id: "1",
    title: "Fundamentos de Vendas Digitais",
    description: "Aprenda os conceitos básicos para dominar as vendas no ambiente digital",
    instructor: "Carlos Silva",
    duration: 45,
    thumbnailUrl: "/digital-sales-training-thumbnail.jpg",
    videoUrl: "#",
    category: "Vendas",
    tags: ["vendas", "digital", "fundamentos"],
    level: "beginner" as const,
    viewCount: 234,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Estratégias Avançadas de Copywriting",
    description: "Técnicas profissionais para criar textos que convertem e engajam",
    instructor: "Ana Costa",
    duration: 60,
    thumbnailUrl: "/copywriting-advanced-strategies-thumbnail.jpg",
    videoUrl: "#",
    category: "Marketing",
    tags: ["copywriting", "conversão", "avançado"],
    level: "advanced" as const,
    viewCount: 189,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Gestão de Projetos Ágeis",
    description: "Metodologias ágeis aplicadas à gestão de projetos digitais",
    instructor: "Roberto Lima",
    duration: 90,
    thumbnailUrl: "/agile-project-management-thumbnail.jpg",
    videoUrl: "#",
    category: "Gestão",
    tags: ["gestão", "projetos", "ágil", "scrum"],
    level: "intermediate" as const,
    viewCount: 156,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Design Thinking para Negócios",
    description: "Como aplicar design thinking para resolver problemas complexos",
    instructor: "Marina Santos",
    duration: 75,
    thumbnailUrl: "/design-thinking-business-thumbnail.jpg",
    videoUrl: "#",
    category: "Inovação",
    tags: ["design", "thinking", "inovação", "negócios"],
    level: "intermediate" as const,
    viewCount: 203,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Análise de Dados com Power BI",
    description: "Transforme dados em insights poderosos para seu negócio",
    instructor: "Pedro Oliveira",
    duration: 120,
    thumbnailUrl: "/power-bi-data-analysis-thumbnail.jpg",
    videoUrl: "#",
    category: "Tecnologia",
    tags: ["dados", "powerbi", "análise", "business intelligence"],
    level: "advanced" as const,
    viewCount: 167,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Liderança e Comunicação Eficaz",
    description: "Desenvolva habilidades de liderança e comunicação assertiva",
    instructor: "Julia Ferreira",
    duration: 55,
    thumbnailUrl: "/leadership-communication-skills-thumbnail.jpg",
    videoUrl: "#",
    category: "Liderança",
    tags: ["liderança", "comunicação", "soft skills"],
    level: "intermediate" as const,
    viewCount: 298,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const categories = [
  { name: "Todos", color: "bg-gray-500" },
  { name: "Vendas", color: "bg-green-500" },
  { name: "Marketing", color: "bg-blue-500" },
  { name: "Gestão", color: "bg-purple-500" },
  { name: "Inovação", color: "bg-orange-500" },
  { name: "Tecnologia", color: "bg-red-500" },
  { name: "Liderança", color: "bg-yellow-500" },
]

export default function TrainingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "beginner" as const,
    tags: "",
  })

  const isAdmin = currentUser.role === "admin" || currentUser.role === "mentor"

  const filteredTrainings = mockTrainings.filter((training) => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || training.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUploadTraining = () => {
    // Here would be the logic to upload the training
    console.log("Uploading training:", newTraining)
    setIsUploadDialogOpen(false)
    setNewTraining({
      title: "",
      description: "",
      instructor: "",
      category: "",
      level: "beginner",
      tags: "",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Iniciante"
      case "intermediate":
        return "Intermediário"
      case "advanced":
        return "Avançado"
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Treinamentos Internos</h1>
              <p className="text-muted-foreground">Desenvolva suas habilidades com nossos treinamentos exclusivos</p>
            </div>
            {isAdmin && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Treinamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Treinamento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newTraining.title}
                        onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                        placeholder="Digite o título do treinamento"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newTraining.description}
                        onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                        placeholder="Descreva o conteúdo do treinamento"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="instructor">Instrutor</Label>
                        <Input
                          id="instructor"
                          value={newTraining.instructor}
                          onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })}
                          placeholder="Nome do instrutor"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                          value={newTraining.category}
                          onValueChange={(value) => setNewTraining({ ...newTraining, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter((cat) => cat.name !== "Todos")
                              .map((category) => (
                                <SelectItem key={category.name} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="level">Nível</Label>
                        <Select
                          value={newTraining.level}
                          onValueChange={(value: any) => setNewTraining({ ...newTraining, level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                        <Input
                          id="tags"
                          value={newTraining.tags}
                          onChange={(e) => setNewTraining({ ...newTraining, tags: e.target.value })}
                          placeholder="vendas, digital, fundamentos"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="video">Arquivo de Vídeo</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique para selecionar ou arraste o arquivo de vídeo
                        </p>
                        <Button variant="outline" size="sm">
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUploadTraining}>Publicar Treinamento</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar treinamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Training Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={training.thumbnailUrl || "/placeholder.svg"}
                  alt={training.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Assistir
                  </Button>
                </div>
                <Badge className={`absolute top-2 right-2 ${getLevelColor(training.level)}`}>
                  {getLevelText(training.level)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {training.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {training.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{training.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {training.duration}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {training.viewCount}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Por {training.instructor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrainings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum treinamento encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
