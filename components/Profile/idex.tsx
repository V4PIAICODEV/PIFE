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
// Removemos a importação antiga do mock-data
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

// --- NOVA LISTA DE SQUADS (Definida Localmente) ---
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

// Schema de validação para perfil
const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  squad: z.string().optional(),
});

// Schema de validação para senha
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(3, "Senha deve ter pelo menos 3 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ConfiguracoesPage({
  userData,
}: {
  userData: UserData;
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    userData.image
  );
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form para perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      squad: userData.squad || undefined,
    },
  });

  // Form para senha (modal)
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
      if (data.squad) formData.append("squad", data.squad);
      
      // Ajuste: Apenas envia a imagem se ela existir e for válida
      if (profileImage) {
         formData.append("image", profileImage);
      }

      await makeRequest({
        url: "/api/v4/user/profile",
        method: "PUT",
        body: formData,
        showSuccessToast: true,
      });

      // Atualizar a sessão
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
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências do sistema
        </p>
      </div>

      {/* Formulário Único */}
      <form
        onSubmit={handleSubmitProfile(onSubmitProfile)}
        className="space-y-6"
      >
        {/* Foto de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Foto de Perfil
            </CardTitle>
            <CardDescription>
              Adicione uma foto para personalizar seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                {previewImage ? (
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Foto de perfil"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Escolher Foto
                </Button>
                <p className="text-sm text-muted-foreground">
                  Recomendado: 400x400px, máximo 2MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize seus dados pessoais e de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                {...registerProfile("name")}
                placeholder="Digite seu nome completo"
              />
              {errorsProfile.name && (
                <p className="text-sm text-destructive">
                  {errorsProfile.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Squad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Squad
            </CardTitle>
            <CardDescription>
              Selecione o squad ao qual você pertence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="squad">Squad</Label>
              <Select
                defaultValue={userData.squad || undefined}
                onValueChange={(value) => {
                  const event = {
                    target: { name: "squad", value },
                  } as any;
                  registerProfile("squad").onChange(event);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu squad" />
                </SelectTrigger>
                <SelectContent>
                  {mockSquads.map((squad) => (
                    <SelectItem key={squad.id} value={squad.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: squad.color }}
                        />
                        {squad.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorsProfile.squad && (
                <p className="text-sm text-destructive">
                  {errorsProfile.squad.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Gerencie a segurança da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha de acesso ao sistema
                </p>
              </div>
              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <KeyRound className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Alterar Senha</DialogTitle>
                    <DialogDescription>
                      Digite sua senha atual e escolha uma nova senha
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmitPassword(onSubmitPassword)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword("currentPassword")}
                        placeholder="Digite sua senha atual"
                      />
                      {errorsPassword.currentPassword && (
                        <p className="text-sm text-destructive">
                          {errorsPassword.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword("newPassword")}
                        placeholder="Digite sua nova senha"
                      />
                      {errorsPassword.newPassword && (
                        <p className="text-sm text-destructive">
                          {errorsPassword.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword("confirmPassword")}
                        placeholder="Confirme sua nova senha"
                      />
                      {errorsPassword.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errorsPassword.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsPasswordDialogOpen(false);
                          resetPassword();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmittingPassword}>
                        {isSubmittingPassword
                          ? "Alterando..."
                          : "Alterar Senha"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.refresh()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmittingProfile}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmittingProfile ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>

      {/* Sair da Conta */}
      <Card className="border-destructive/20 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="h-5 w-5" />
            Sair da Conta
          </CardTitle>
          <CardDescription>
            Desconecte-se do sistema e retorne à página de login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Ao sair, você precisará fazer login novamente para acessar o
                sistema.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}