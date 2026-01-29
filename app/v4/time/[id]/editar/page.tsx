"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Edit, Upload, Plus, Search, Download, FileText, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"

interface EditEmployeeProps {
  params: {
    id: string
  }
}

export default function EditEmployee({ params }: EditEmployeeProps) {
  const [formData, setFormData] = useState({
    name: "Ananda Souza",
    birthDate: "04/08/1993",
    email: "ananda.cordeiro1@v4company.com",
    phone: "+55 (38) 98705347",
    notifyBy: "E-mail",
    cpf: "",
    socialName: "",
    address: "",
    hasChildren: "",
    position: "Account",
    positionLevel: "(N/A)",
    contractType: "(N/A)",
    salary: "0.00",
    admissionDate: "06/05/2025",
    contractDuration: "",
    workCity: "",
    impact: [3],
    banco: "",
    agencia: "",
    conta: "",
    pix: "",
    razaoSocial: "",
    cnpj: "",
    benefitType: "",
    benefitValue: "0,00",
    companyParticipation: "",
    benefitStartDate: "",
    benefitEndDate: "",
    bonusType: "",
    bonusDate: "",
    bonusValue: "0,00",
    examType: "",
    examDate: "",
    examValidity: "",
  })

  const [benefits, setBenefits] = useState<any[]>([])
  const [bonuses, setBonuses] = useState<any[]>([])
  const [medicalExams, setMedicalExams] = useState<any[]>([])
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS - ACCOUNT -ANANDA CORDEIRO DE SOUZA (1).pdf",
      size: "225.19 KB",
      date: "17 Quinta-feira",
      month: "Julho",
      year: "2025",
      type: "pdf",
    },
  ])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddBenefit = () => {
    if (formData.benefitType && formData.benefitStartDate && formData.benefitEndDate) {
      const newBenefit = {
        id: Date.now(),
        type: formData.benefitType,
        value: formData.benefitValue,
        participation: formData.companyParticipation,
        startDate: formData.benefitStartDate,
        endDate: formData.benefitEndDate,
        attachment: null,
      }
      setBenefits([...benefits, newBenefit])
      setFormData((prev) => ({
        ...prev,
        benefitType: "",
        benefitValue: "0,00",
        companyParticipation: "",
        benefitStartDate: "",
        benefitEndDate: "",
      }))
    }
  }

  const handleAddBonus = () => {
    if (formData.bonusType && formData.bonusDate) {
      const newBonus = {
        id: Date.now(),
        type: formData.bonusType,
        date: formData.bonusDate,
        value: formData.bonusValue,
        attachment: null,
      }
      setBonuses([...bonuses, newBonus])
      setFormData((prev) => ({
        ...prev,
        bonusType: "",
        bonusDate: "",
        bonusValue: "0,00",
      }))
    }
  }

  const handleAddMedicalExam = () => {
    if (formData.examType && formData.examDate && formData.examValidity) {
      const newExam = {
        id: Date.now(),
        type: formData.examType,
        date: formData.examDate,
        validity: formData.examValidity,
        attachment: null,
      }
      setMedicalExams([...medicalExams, newExam])
      setFormData((prev) => ({
        ...prev,
        examType: "",
        examDate: "",
        examValidity: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/time/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Editar Perfil - {formData.name}</h1>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <Tabs defaultValue="dados-gerais" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
              <TabsTrigger value="dados-bancarios">Dados Bancários</TabsTrigger>
              <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
              <TabsTrigger value="bonificacoes">Bonificações</TabsTrigger>
              <TabsTrigger value="exames-medicos">Exames Médicos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-gerais" className="mt-0">
              <CardContent className="p-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6">Informações Pessoais</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4">
                        <Image src="/ananda.jpg" alt={formData.name} fill className="rounded-full object-cover" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Name and Birth Date */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value="1993-08-04"
                          onChange={(e) => handleInputChange("birthDate", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                          <span className="text-sm">🇧🇷</span>
                        </div>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notifyBy">Notificar por</Label>
                      <Select value={formData.notifyBy} onValueChange={(value) => handleInputChange("notifyBy", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="E-mail">E-mail</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Personal Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="socialName">Nome social</Label>
                      <Input
                        id="socialName"
                        value={formData.socialName}
                        onChange={(e) => handleInputChange("socialName", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Has Children */}
                  <div className="mb-8">
                    <Label className="text-base font-medium">Possui filhos</Label>
                    <RadioGroup
                      value={formData.hasChildren}
                      onValueChange={(value) => handleInputChange("hasChildren", value)}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="sim" />
                        <Label htmlFor="sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nao" />
                        <Label htmlFor="nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6">Informações Profissionais</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="position">Cargo</Label>
                      <div className="flex mt-1">
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => handleInputChange("position", e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0 px-3 bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="positionLevel">Nível de Cargo</Label>
                      <div className="flex mt-1">
                        <Input
                          id="positionLevel"
                          value={formData.positionLevel}
                          onChange={(e) => handleInputChange("positionLevel", e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0 px-3 bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contractType">Tipo de Contrato</Label>
                      <div className="flex mt-1">
                        <Input
                          id="contractType"
                          value={formData.contractType}
                          onChange={(e) => handleInputChange("contractType", e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0 px-3 bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="salary">Salário</Label>
                      <div className="flex mt-1">
                        <Input
                          id="salary"
                          value={formData.salary}
                          onChange={(e) => handleInputChange("salary", e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0 px-3 bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Admission Date and Contract Duration */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label htmlFor="admissionDate">Data de Admissão</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value="2025-05-06"
                        onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-end">
                      <RadioGroup
                        value={formData.contractDuration}
                        onValueChange={(value) => handleInputChange("contractDuration", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prazo" id="prazo" />
                          <Label htmlFor="prazo">Prazo do contrato</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="indeterminado" id="indeterminado" />
                          <Label htmlFor="indeterminado">Indeterminado</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Work City */}
                  <div className="mb-6">
                    <Label htmlFor="workCity">Cidade de Trabalho</Label>
                    <Input
                      id="workCity"
                      value={formData.workCity}
                      onChange={(e) => handleInputChange("workCity", e.target.value)}
                      className="mt-1 max-w-md"
                    />
                  </div>

                  {/* Impact Assessment */}
                  <div className="mb-8">
                    <Label className="text-base font-medium mb-4 block">
                      O quão impactante é esse colaborador para a empresa?
                    </Label>
                    <div className="max-w-md">
                      <Slider
                        value={formData.impact}
                        onValueChange={(value) => handleInputChange("impact", value)}
                        max={5}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="dados-bancarios">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Bank field - full width */}
                  <div>
                    <Label htmlFor="banco">Banco</Label>
                    <Input
                      id="banco"
                      placeholder="Nome do banco"
                      value={formData.banco}
                      onChange={(e) => handleInputChange("banco", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Agency and Account - side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="agencia">Agência</Label>
                      <Input
                        id="agencia"
                        placeholder="Número da agência"
                        value={formData.agencia}
                        onChange={(e) => handleInputChange("agencia", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="conta">Conta</Label>
                      <Input
                        id="conta"
                        placeholder="Número da conta"
                        value={formData.conta}
                        onChange={(e) => handleInputChange("conta", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* PIX, Corporate Name, and CNPJ */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="pix">Pix</Label>
                      <Input
                        id="pix"
                        placeholder="Chave PIX"
                        value={formData.pix}
                        onChange={(e) => handleInputChange("pix", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="razao-social">Razão social</Label>
                      <Input
                        id="razao-social"
                        placeholder="Razão social"
                        value={formData.razaoSocial}
                        onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        placeholder="__.___.___ / ____-__"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange("cnpj", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="beneficios">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Benefits Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="benefitType">Tipo de Benefício</Label>
                      <Select
                        value={formData.benefitType}
                        onValueChange={(value) => handleInputChange("benefitType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vale-refeicao">Vale Refeição</SelectItem>
                          <SelectItem value="vale-transporte">Vale Transporte</SelectItem>
                          <SelectItem value="plano-saude">Plano de Saúde</SelectItem>
                          <SelectItem value="plano-odontologico">Plano Odontológico</SelectItem>
                          <SelectItem value="seguro-vida">Seguro de Vida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="benefitValue">Valor</Label>
                      <Input
                        id="benefitValue"
                        value={`R$ ${formData.benefitValue}`}
                        onChange={(e) => handleInputChange("benefitValue", e.target.value.replace("R$ ", ""))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyParticipation">Participação da Empresa</Label>
                      <Input
                        id="companyParticipation"
                        placeholder="Ex: 100%"
                        value={formData.companyParticipation}
                        onChange={(e) => handleInputChange("companyParticipation", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Date Fields and Attachment */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="benefitStartDate">Data de Início</Label>
                      <Input
                        id="benefitStartDate"
                        type="date"
                        value={formData.benefitStartDate}
                        onChange={(e) => handleInputChange("benefitStartDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefitEndDate">Data final</Label>
                      <Input
                        id="benefitEndDate"
                        type="date"
                        value={formData.benefitEndDate}
                        onChange={(e) => handleInputChange("benefitEndDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Anexo</Label>
                      <div className="flex gap-2 mt-1">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button variant="outline" className="px-3 bg-transparent" onClick={handleAddBenefit}>
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Table */}
                  <div className="mt-8">
                    {benefits.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                            <div>Tipo de Benefício</div>
                            <div>Valor</div>
                            <div>Participação</div>
                            <div>Data</div>
                            <div>Anexo</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {benefits.map((benefit) => (
                            <div key={benefit.id} className="px-6 py-4">
                              <div className="grid grid-cols-5 gap-4 text-sm">
                                <div>{benefit.type}</div>
                                <div>R$ {benefit.value}</div>
                                <div>{benefit.participation}</div>
                                <div>
                                  {benefit.startDate} - {benefit.endDate}
                                </div>
                                <div>-</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">Nenhum benefício registrado até o momento.</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="bonificacoes">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Bonuses Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="bonusType">Tipo</Label>
                      <Select
                        value={formData.bonusType}
                        onValueChange={(value) => handleInputChange("bonusType", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bonus-performance">Bônus de Performance</SelectItem>
                          <SelectItem value="bonus-meta">Bônus por Meta</SelectItem>
                          <SelectItem value="bonus-projeto">Bônus de Projeto</SelectItem>
                          <SelectItem value="participacao-lucros">Participação nos Lucros</SelectItem>
                          <SelectItem value="premio-produtividade">Prêmio de Produtividade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bonusDate">Data</Label>
                      <Input
                        id="bonusDate"
                        type="date"
                        value={formData.bonusDate}
                        onChange={(e) => handleInputChange("bonusDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bonusValue">Valor</Label>
                      <Input
                        id="bonusValue"
                        value={`R$ ${formData.bonusValue}`}
                        onChange={(e) => handleInputChange("bonusValue", e.target.value.replace("R$ ", ""))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Anexo</Label>
                      <div className="flex gap-2 mt-1">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button variant="outline" className="px-3 bg-transparent" onClick={handleAddBonus}>
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bonuses Table */}
                  <div className="mt-8">
                    {bonuses.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                            <div>Tipo</div>
                            <div>Data</div>
                            <div>Valor</div>
                            <div>Anexo</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {bonuses.map((bonus) => (
                            <div key={bonus.id} className="px-6 py-4">
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>{bonus.type}</div>
                                <div>{bonus.date}</div>
                                <div>R$ {bonus.value}</div>
                                <div>-</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        Nenhuma bonificação registrada até o momento.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="exames-medicos">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="examType">Tipo</Label>
                      <Select value={formData.examType} onValueChange={(value) => handleInputChange("examType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admissional">Exame Admissional</SelectItem>
                          <SelectItem value="periodico">Exame Periódico</SelectItem>
                          <SelectItem value="demissional">Exame Demissional</SelectItem>
                          <SelectItem value="mudanca-funcao">Mudança de Função</SelectItem>
                          <SelectItem value="retorno-trabalho">Retorno ao Trabalho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="examDate">Data</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={formData.examDate}
                        onChange={(e) => handleInputChange("examDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="examValidity">Validade</Label>
                      <Input
                        id="examValidity"
                        type="date"
                        value={formData.examValidity}
                        onChange={(e) => handleInputChange("examValidity", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Anexo</Label>
                      <div className="flex gap-2 mt-1">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button variant="outline" className="px-3 bg-transparent" onClick={handleAddMedicalExam}>
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    {medicalExams.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                            <div>Tipo</div>
                            <div>Data</div>
                            <div>Validade</div>
                            <div>Anexo</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {medicalExams.map((exam) => (
                            <div key={exam.id} className="px-6 py-4">
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>{exam.type}</div>
                                <div>{exam.date}</div>
                                <div>{exam.validity}</div>
                                <div>-</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">Nenhum exame registrado até o momento.</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="documentos">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="flex items-center justify-between">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-orange-500">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar tudo
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Selecione o arquivo para fazer upload (até 20MB).</p>

                  {/* Documents List */}
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="space-y-2">
                        {/* Date Header */}
                        <div className="text-sm font-medium text-orange-500">
                          {doc.year} {doc.month}
                        </div>

                        {/* Document Item */}
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                              <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900 mb-1">{doc.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                  {doc.type}
                                </span>
                                <span>{doc.size}</span>
                                <span>{doc.date}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-4xl">
                    <div className="text-blue-500">ℹ️</div>
                    <p>
                      A TeamGuide salva automaticamente os dados inseridos no perfil, mas, para isso, aguarde a
                      conclusão do salvamento automático disposto no canto inferior direito desta tela ou clique
                      diretamente no botão "Salvar".
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/time/${params.id}`}>
                      <Button variant="outline">Fechar</Button>
                    </Link>
                    <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
