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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  AlertTriangle,
  Briefcase,
  Camera,
  KeyRound,
  LogOut,
  Save,
  Upload,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const mockSquads = [
  { id: "1", name: "Financeiro", color: "#EF4444" },
  { id: "2", name: "P&P", color: "#F97316" },
  { id: "3", name: "Assemble", color: "#F59E0B" },
  { id: "4", name: "Growth Lab", color: "#84CC16" },
  { id: "5", name: "Growthx", color: "#10B981" },
  { id: "6", name: "Roi Eagles", color: "#06B6D4" },
  { id: "7", name: "Sharks", color: "#3B82F6" },
  { id: "8", name: "Stark", color: "#6366F1" },
  { id: "9", name: "V4X", color: "#8B5CF6" },
  { id: "10", name: "Monetização", color: "#D946EF" },
  { id: "11", name: "Sales Ops", color: "#F43F5E" },
  { id: "12", name: "Tremborage", color: "#64748B" },
];

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
  squad: z.string().optional().nullable(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(3, "Senha deve ter pelo menos 3 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ConfiguracoesPage({ userData }: { userData: UserData }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(userData.image);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue, // Adicionado para atualizar o valor do Select
    formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      squad: userData.squad || null,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      // Envia o ID do squad se existir
      if (data.squad) {
        formData.append("squad", data.squad);
      }

      // Envia a imagem apenas se um novo arquivo foi selecionado
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

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await makeRequest({
        url: "/api/v4/user/password",
        method: "PUT",
        body: data,
        showSuccessToast: true,
      });
      resetPassword();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
      </div>

      <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Foto de Perfil</CardTitle>
            <CardDescription>Adicione uma foto para personalizar seu perfil</CardDescription>
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
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Escolher Foto
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...registerProfile("name")} placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squad">Squad</Label>
              <Select 
                defaultValue={userData.squad || undefined} 
                onValueChange={(value) => setValue("squad", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu squad" />
                </SelectTrigger>
                <SelectContent>
                  {mockSquads.map((squad) => (
                    <SelectItem key={squad.id} value={squad.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: squad.color }} />
                        {squad.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmittingProfile}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmittingProfile ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
