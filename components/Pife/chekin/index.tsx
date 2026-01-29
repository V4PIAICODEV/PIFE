"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useRequests from "@/hooks/use-requests";
import { formatDate } from "@/lib/utils";
import { cadastroPife, EVIDENCE_TYPES, PIFE_TYPES } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  CheckCircle,
  Dumbbell,
  FileText,
  Flame,
  Heart,
  LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type CheckinFormData = z.infer<typeof cadastroPife>;

interface CheckinPageProps {
  totalPoints: number;
  streak: number;
  recentCheckins: Array<{
    id: string;
    pife: string;
    description: string;
    image: string | null;
    link: string | null;
    createdAt: Date;
  }>;
  completedToday: string[]; // ["P", "I"] - tipos já preenchidos hoje
}

const PIFE_OPTIONS = [
  {
    type: PIFE_TYPES.P,
    label: "Profissional",
    description: "Atividade profissional realizada",
    color: "bg-blue-500",
    icon: Briefcase,
  },
  {
    type: PIFE_TYPES.I,
    label: "Intelectual",
    description: "Atividade de aprendizado intelectual",
    color: "bg-green-500",
    icon: BookOpen,
  },
  {
    type: PIFE_TYPES.F,
    label: "Físico",
    description: "Atividade física realizada",
    color: "bg-yellow-500",
    icon: Dumbbell,
  },
  {
    type: PIFE_TYPES.E,
    label: "Emocional",
    description: "Atividade de bem-estar emocional",
    color: "bg-purple-500",
    icon: Heart,
  },
];

const EVIDENCE_OPTIONS = [
  {
    type: EVIDENCE_TYPES.PHOTO,
    label: "Foto",
    icon: Camera,
    description: "Capturar foto como evidência",
  },
  {
    type: EVIDENCE_TYPES.LINK,
    label: "Link",
    icon: LinkIcon,
    description: "Compartilhar link relevante",
  },
  {
    type: EVIDENCE_TYPES.NOTE,
    label: "Nota",
    icon: FileText,
    description: "Descrição textual detalhada",
  },
];

export default function CheckinPage({
  totalPoints,
  streak,
  recentCheckins,
  completedToday,
}: CheckinPageProps) {
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<CheckinFormData>({
    resolver: zodResolver(cadastroPife),
    defaultValues: {
      evidenceType: EVIDENCE_TYPES.NOTE,
      description: "",
      link: "",
    },
  });

  const selectedPIFE = watch("pife");
  const selectedEvidence = watch("evidenceType");
  const description = watch("description");
  const imageFile = watch("image");

  const today = new Date();
  const todayFormatted = formatDate(today);

  const onSubmit = async (data: CheckinFormData) => {
    try {
      // Preparar FormData para envio
      const formData = new FormData();
      formData.append("pife", data.pife);
      formData.append("description", data.description);

      // Adicionar link se o tipo de evidência for LINK
      if (data.evidenceType === EVIDENCE_TYPES.LINK && data.link) {
        formData.append("link", data.link);
      }

      // Adicionar imagem se o tipo de evidência for PHOTO e o arquivo foi selecionado
      if (data.evidenceType === EVIDENCE_TYPES.PHOTO && data.image) {
        const file = data.image[0];
        if (file) {
          formData.append("image", file);
        }
      }

      // Call API usando makeRequest (useRequests)
      const { result } = await useRequests({
        url: "/api/v4/pife",
        method: "POST",
        body: formData,
        showSuccessToast: true,
      });

      setHasCheckedToday(true);
      reset();

      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
      // O erro já é tratado pelo useRequests com toast
    }
  };

  if (hasCheckedToday) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <Card className="text-center w-full h-full flex items-center justify-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check-in Realizado!</h2>
              <p className="text-muted-foreground mb-6">
                Seu check-in PIFE de hoje foi registrado com sucesso. Você
                ganhou +10 pontos!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Check-in PIFE</h1>
          </div>
          <p className="text-muted-foreground">
            Registre sua atividade diária e mantenha seu streak ativo
          </p>
          <Badge variant="outline" className="mt-2">
            {todayFormatted}
          </Badge>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Check-in Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg ">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5" />
                      <p className="text-sm font-medium">Seu Streak Atual</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-bold">{streak}</p>
                      <p className="text-sm opacity-90">dias consecutivos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold">{totalPoints}</p>
                    <p className="text-xs font-medium">pontos</p>
                    <p className="text-[10px] opacity-90">totais</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PIFE Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Selecione o tipo de atividade (PIFE)</CardTitle>
                <CardDescription>
                  Escolha qual tipo de atividade você realizou hoje
                  {completedToday.length > 0 && (
                    <span className="block mt-1 text-yellow-600 dark:text-yellow-500">
                      ⚠️ Você já preencheu {completedToday.length} tipo(s) hoje
                      (máximo 1 de cada por dia)
                    </span>
                  )}
                  {completedToday.length === 4 && (
                    <span className="block mt-1 text-green-600 dark:text-green-500">
                      ✅ Parabéns! Você completou todos os tipos hoje!
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 min-h-full">
                  {PIFE_OPTIONS.map((option) => {
                    const IconComponent = option.icon;
                    const isDisabled = completedToday.includes(option.type);
                    const isSelected = selectedPIFE === option.type;

                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() =>
                          !isDisabled && setValue("pife", option.type)
                        }
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-muted"
                            : isSelected
                            ? "border-primary bg-primary/5 hover:shadow-md"
                            : "border-border hover:border-primary/50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              option.color
                            } flex items-center justify-center text-white ${
                              isDisabled ? "opacity-70" : ""
                            }`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{option.label}</h3>
                              {isDisabled && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isDisabled
                                ? "Já preenchido hoje"
                                : option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {errors.pife && (
                    <p className="text-sm text-red-500 col-span-2">
                      {errors.pife.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Evidence Type */}
            {selectedPIFE && (
              <Card>
                <CardHeader>
                  <CardTitle>2. Tipo de evidência</CardTitle>
                  <CardDescription>
                    Como você quer documentar sua atividade?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {EVIDENCE_OPTIONS.map((evidence) => {
                      const Icon = evidence.icon;
                      return (
                        <button
                          key={evidence.type}
                          type="button"
                          onClick={() =>
                            setValue("evidenceType", evidence.type)
                          }
                          className={`p-3 rounded-lg border text-center transition-all ${
                            selectedEvidence === evidence.type
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium text-sm">
                            {evidence.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {selectedPIFE && (
              <Card>
                <CardHeader>
                  <CardTitle>3. Descreva sua atividade</CardTitle>
                  <CardDescription>
                    Conte o que você fez hoje (mínimo 10 caracteres)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição da atividade</Label>
                    <Textarea
                      id="description"
                      placeholder={
                        selectedPIFE === PIFE_TYPES.P
                          ? "Ex: Apresentei proposta comercial para novo cliente..."
                          : selectedPIFE === PIFE_TYPES.I
                          ? "Ex: Li capítulo sobre estratégias de marketing digital..."
                          : selectedPIFE === PIFE_TYPES.F
                          ? "Ex: Treino de 45 minutos na academia com foco em cardio..."
                          : "Ex: Pratiquei meditação por 20 minutos para reduzir o estresse..."
                      }
                      {...register("description")}
                      rows={4}
                      className="mt-2"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        {description?.length || 0}/500 caracteres
                      </p>
                      {errors.description && (
                        <p className="text-xs text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedEvidence === EVIDENCE_TYPES.LINK && (
                    <div>
                      <Label htmlFor="link">Link da evidência (opcional)</Label>
                      <Input
                        id="link"
                        type="url"
                        placeholder="https://..."
                        {...register("link")}
                        className="mt-2"
                      />
                      {errors.link && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.link.message}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedEvidence === EVIDENCE_TYPES.PHOTO && (
                    <div>
                      <Label htmlFor="image">Foto da evidência</Label>
                      <div className="mt-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          {...register("image")}
                          className="cursor-pointer"
                        />
                        {errors.image && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.image.message as string}
                          </p>
                        )}
                        {imageFile && imageFile[0] && (
                          <div className="mt-2 p-3 bg-muted rounded-lg flex items-center gap-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {imageFile[0].name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {selectedPIFE && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Flame className="h-5 w-5 mr-2" />
                        Fazer Check-in (+10 pontos)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Histórico Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCheckins.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum check-in realizado ainda
                    </p>
                  ) : (
                    recentCheckins.map((checkin) => {
                      // Mapear o tipo do Prisma para o tipo do componente
                      const pifeTypeMap: Record<string, string> = {
                        Profissional: PIFE_TYPES.P,
                        Intelectual: PIFE_TYPES.I,
                        Físico: PIFE_TYPES.F,
                        Emocional: PIFE_TYPES.E,
                      };
                      const pifeType = pifeTypeMap[checkin.pife];
                      const pifeOption = PIFE_OPTIONS.find(
                        (p) => p.type === pifeType
                      );
                      const IconComponent = pifeOption?.icon;

                      return (
                        <div
                          key={checkin.id}
                          className="p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full ${pifeOption?.color} flex items-center justify-center text-white`}
                              >
                                {IconComponent && (
                                  <IconComponent className="h-3 w-3" />
                                )}
                              </div>
                              <span className="font-medium text-sm">
                                {pifeOption?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-muted-foreground">
                                +10
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {formatDate(new Date(checkin.createdAt))}
                          </p>
                          <p className="text-sm">{checkin.description}</p>
                          {checkin.image && (
                            <div className="mt-2">
                              <img
                                src={checkin.image}
                                alt="Evidência"
                                className="rounded-md max-h-32 object-cover"
                              />
                            </div>
                          )}
                          {checkin.link && (
                            <a
                              href={checkin.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline mt-1 block"
                            >
                              🔗 Ver link
                            </a>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PIFE Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guia PIFE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {PIFE_OPTIONS.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div key={option.type} className="flex gap-2">
                        <div
                          className={`w-6 h-6 rounded-full ${option.color} flex items-center justify-center text-white flex-shrink-0`}
                        >
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-muted-foreground text-xs">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
