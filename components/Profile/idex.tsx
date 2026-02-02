"use client";

import type React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeRequest } from "@/hooks/use-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Save,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  // Busca os squads reais do banco para evitar o erro 400
  useEffect(() => {
    async function loadSquads() {
      try {
        const response = await fetch("/api/public/squads");
        const data = await response.json();
        setRealSquads(data);
      } catch (error) {
        console.error("Erro ao carregar squads do banco:", error);
      }
    }
    loadSquads();
  }, []);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue,
    formState: { isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      squad: userData.squad || null,
    },
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      // Envia o ID real do banco. Se não houver, envia vazio para o Prisma tratar como null
      if (data.squad && data.squad !== "none") {
        formData.append("squad", data.squad);
      }

      if (profileImage) {
        formData.append("image", profileImage);
      }

      await makeRequest({
        url: "/api/v4/user/profile",
        method: "PUT",
        body: formData,
        showSuccessToast: true,
      });

      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                {previewImage ? (
                  <Image src={previewImage} alt="Foto" width={80} height={80} className="w-20 h-20 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Escolher Foto
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Dados da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...registerProfile("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squad">Squad</Label>
              <Select 
                defaultValue={userData.squad || undefined} 
                onValueChange={(value) => setValue("squad", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu squad real" />
                </SelectTrigger>
                <SelectContent>
                  {realSquads.length > 0 ? (
                    realSquads.map((squad) => (
                      <SelectItem key={squad.id} value={squad.id}>
                        {squad.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Carregando squads...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmittingProfile}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmittingProfile ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
