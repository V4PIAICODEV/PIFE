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

// Inicialização do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CheckinFormData = z.infer<typeof cadastroPife>;

interface CheckinPageProps {
  totalPoints: number;
  streak: number;
  userName: string; // Adicionado para a saudação personalizada
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

// ... (Mantenha PIFE_OPTIONS e EVIDENCE_OPTIONS como estão no seu código)

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

      // 1. Upload para o Supabase Storage se houver imagem
      if (data.evidenceType === EVIDENCE_TYPES.PHOTO && data.image?.[0]) {
        const file = data.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `evidencias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pife-uploads')
          .upload(filePath, file);

        if (uploadError) throw new Error("Erro ao subir evidência para o Supabase");

        const { data: { publicUrl } } = supabase.storage
          .from('pife-uploads')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Envio dos dados como JSON para a API (mais estável para URLs)
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
      console.error("Erro no check-in:", error);
      toast.error(error.message || "Erro ao processar check-in");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto space-y-8">
        {/* Header com Saudação Corrigida */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Check-in PIFE</h1>
          </div>
          <p className="text-muted-foreground">
            Bem-vindo, <span className="text-primary font-bold">{userName?.split(" ")[0]}</span>! Registre sua evolução hoje.
          </p>
          <Badge variant="outline" className="mt-4">
            {formatDate(new Date())}
          </Badge>
        </div>

        {/* ... Restante do formulário permanece igual, garantindo que o onSubmit use a nova lógica ... */}
      </div>
    </div>
  );
}
