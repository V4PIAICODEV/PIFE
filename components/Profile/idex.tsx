"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { makeRequest } from "@/hooks/use-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Save, Upload, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Configuração do Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  squad: string | null;
  level: string;
  createdAt: string;
}

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  squad: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ConfiguracoesPage({ userData }: { userData: UserData }) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(userData.image);
  const [realSquads, setRealSquads] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSquads() {
      try {
        const response = await fetch("/api/public/squads");
        const data = await response.json();
        setRealSquads(data);
      } catch (error) {
        console.error("Erro ao carregar squads:", error);
      }
    }
    loadSquads();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      squad: userData.squad || null,
    },
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      let imageUrl = userData.image;

      // 1. Lógica de Upload para o Supabase Storage
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${userData.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pife-uploads') // Certifique-se de que o bucket existe e é público!
          .upload(filePath, profileImage);

        if (uploadError) {
          throw new Error("Erro ao subir imagem para o Supabase");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('pife-uploads')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Enviar dados finais para a sua API interna
      const payload = {
        name: data.name,
        squadId: data.squad === "none" ? null : data.squad,
        image: imageUrl, // Aqui vai a URL da imagem
      };

      await makeRequest({
        url: "/api/v4/user/profile",
        method: "PUT",
        body: payload, // Enviamos como JSON agora, já que a imagem é só uma URL
        showSuccessToast: true,
      });

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
      console.error(error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande! Máximo 2MB.");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Bem-vindo, <span className="text-primary font-bold">{userData.name.split(" ")[0]}</span></p>
      </div>

      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                {previewImage ? (
                  <Image src={previewImage} alt="Foto" width={80} height={80} className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Alterar Foto
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Seus Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squad">Squad</Label>
              <Select defaultValue={userData.squad || undefined} onValueChange={(v) => setValue("squad", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu squad" />
                </SelectTrigger>
                <SelectContent>
                  {realSquads.map((squad) => (
                    <SelectItem key={squad.id} value={squad.id}>{squad.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
