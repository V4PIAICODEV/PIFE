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
import { makeRequest } from "@/hooks/use-requests";
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
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Inicialização do Supabase para upload de evidências
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

type CheckinFormData = z.infer<typeof cadastroPife>;

interface CheckinPageProps {
  totalPoints: number;
  streak: number;
  userName: string; // Adicionado para a saudação
  recentCheckins: Array<{
    id: string;
    pife: string;
    description: string;
    image: string | null;
    link: string | null;
    createdAt: Date;
  }>;
  completedToday: string[];
}

const PIFE_OPTIONS = [
  { type: PIFE_TYPES.P, label: "Profissional", description: "Atividade profissional realizada", color: "bg-blue-500", icon: Briefcase },
  { type: PIFE_TYPES.I, label: "Intelectual", description: "Atividade de aprendizado intelectual", color: "bg-green-500", icon: BookOpen },
  { type: PIFE_TYPES.F, label: "Físico", description: "Atividade física realizada", color: "bg-yellow-500", icon: Dumbbell },
  { type: PIFE_TYPES.E, label: "Emocional", description: "Atividade de bem-estar emocional", color: "bg-purple-500", icon: Heart },
];

const EVIDENCE_OPTIONS = [
  { type: EVIDENCE_TYPES.PHOTO, label: "Foto", icon: Camera, description: "Capturar foto como evidência" },
  { type: EVIDENCE_TYPES.LINK, label: "Link", icon: LinkIcon, description: "Compartilhar link relevante" },
  { type: EVIDENCE_TYPES.NOTE, label: "Nota", icon: FileText, description: "Descrição textual detalhada" },
];

export default function CheckinPage({
  totalPoints,
  streak,
  userName,
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

  const onSubmit = async (data: CheckinFormData) => {
    try {
      let finalImageUrl = null;

      // 1. Upload da Foto para o Supabase Storage
      if (data.evidenceType === EVIDENCE_TYPES.PHOTO && data.image?.[0]) {
        if (!supabase) throw new Error("Supabase não configurado.");
        
        const file = data.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `evidencias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pife-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pife-uploads')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Envio dos dados como JSON para a API (mais estável para links de imagem)
      await makeRequest({
        url: "/api/v4/pife",
        method: "POST",
        body: {
          pife: data.pife,
          description: data.description,
          link: data.evidenceType === EVIDENCE_TYPES.LINK ? data.link : null,
          image: finalImageUrl, 
        },
        showSuccessToast: true,
      });

      setHasCheckedToday(true);
      reset();
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao fazer check-in:", error);
      toast.error(error.message || "Erro ao processar check-in");
    }
  };

  if (hasCheckedToday) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check-in Realizado!</h2>
            <p className="text-muted-foreground">Você ganhou +10 pontos!</p>
            <Button className="mt-6" onClick={() => setHasCheckedToday(false)}>Novo Check-in</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Check-in PIFE</h1>
          </div>
          {/* Saudação Ajustada */}
          <p className="text-muted-foreground">
            Bem-vindo, <span className="text-primary font-bold">{userName?.split(" ")[0]}</span>! Registre sua atividade e mantenha seu streak.
          </p>
          <Badge variant="outline" className="mt-4">{formatDate(new Date())}</Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="pt-6 pb-6 flex justify-between items-center">
                <div>
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
                  <p className="text-xs font-medium uppercase">pontos totais</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>1. Tipo de atividade (PIFE)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PIFE_OPTIONS.map((option) => {
                    const isDisabled = completedToday.includes(option.type);
                    const isSelected = selectedPIFE === option.type;
                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => !isDisabled && setValue("pife", option.type)}
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isDisabled ? "opacity-50 bg-muted" : isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center text-white`}>
                            <option.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{option.label}</h3>
                            <p className="text-xs text-muted-foreground">{isDisabled ? "Já preenchido" : option.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedPIFE && (
              <>
                <Card>
                  <CardHeader><CardTitle>2. Tipo de evidência</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {EVIDENCE_OPTIONS.map((ev) => (
                        <button
                          key={ev.type}
                          type="button"
                          onClick={() => setValue("evidenceType", ev.type)}
                          className={`p-3 rounded-lg border text-center transition-all ${selectedEvidence === ev.type ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <ev.icon className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{ev.label}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3. Detalhes</CardTitle>
                    {/* Aviso de 10 caracteres adicionado conforme solicitado */}
                    <CardDescription className="text-orange-500 font-medium">
                      Mínimo de 10 caracteres para a descrição.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Descrição</Label>
                      <Textarea {...register("description")} placeholder="O que você fez hoje?" rows={4} className="mt-2" />
                      {/* Contador e aviso dinâmico */}
                      <p className={`text-[10px] mt-1 ${description?.length < 10 ? "text-orange-500" : "text-muted-foreground"}`}>
                        {description?.length || 0}/500 caracteres {(description?.length < 10) && "(Mínimo 10)"}
                      </p>
                    </div>
                    {selectedEvidence === EVIDENCE_TYPES.LINK && (
                      <div><Label>Link</Label><Input {...register("link")} placeholder="https://..." className="mt-2" /></div>
                    )}
                    {selectedEvidence === EVIDENCE_TYPES.PHOTO && (
                      <div><Label>Foto</Label><Input type="file" accept="image/*" {...register("image")} className="mt-2" /></div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || (description?.length < 10)} 
                  className="w-full h-12 text-lg"
                >
                  {isSubmitting ? "Enviando..." : "Fazer Check-in (+10 pontos)"}
                </Button>
              </>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Histórico</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {recentCheckins.map((checkin) => (
                  <div key={checkin.id} className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="secondary" className="text-[10px]">{checkin.pife}</Badge>
                      <span className="text-[10px] text-muted-foreground">{formatDate(new Date(checkin.createdAt))}</span>
                    </div>
                    <p className="text-sm font-medium">{checkin.description}</p>
                    {checkin.image && <img src={checkin.image} alt="Evidência" className="mt-2 rounded-md max-h-32 w-full object-cover" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
