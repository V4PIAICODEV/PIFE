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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useRequests from "@/hooks/use-requests";
import { formatDate } from "@/lib/utils";
import { cadastroAcelerarOi } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Heart, Rocket, Send, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type AcelerarOiFormData = z.infer<typeof cadastroAcelerarOi>;

interface Usuario {
  id: string;
  name: string;
  image: string | null;
}

interface AcelerarOiFormProps {
  usuarios: Usuario[];
}

export default function AcelerarOiForm({ usuarios }: AcelerarOiFormProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<AcelerarOiFormData>({
    resolver: zodResolver(cadastroAcelerarOi),
    defaultValues: {
      message: "",
    },
  });

  const selectedUserId = watch("destinatarioId");
  const message = watch("message");
  const imageFile = watch("image");

  const selectedUser = usuarios.find((u) => u.id === selectedUserId);

  const onSubmit = async (data: AcelerarOiFormData) => {
    try {
      // Preparar FormData para envio
      const formData = new FormData();
      formData.append("destinatarioId", data.destinatarioId);
      formData.append("message", data.message);

      // Adicionar imagem se o arquivo foi selecionado
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      // Call API
      await useRequests({
        url: "/api/v4/acelerar-oi",
        method: "POST",
        body: formData,
        showSuccessToast: true,
      });

      setHasSubmitted(true);
      reset();

      setTimeout(() => {
        router.refresh();
        setHasSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar AcelerarOi:", error);
    }
  };

  if (hasSubmitted) {
    return (
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AcelerarOi Enviado!</h2>
          <p className="text-muted-foreground">
            Seu reconhecimento foi compartilhado com sucesso! 🚀
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">AcelerarOi</h1>
        </div>
        <p className="text-muted-foreground">
          Reconheça e valorize um colega da equipe
        </p>
        <Badge variant="outline" className="mt-2">
          {formatDate(new Date())}
        </Badge>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            1. Selecione quem você quer reconhecer
          </CardTitle>
          <CardDescription>
            Escolha um colega para enviar um AcelerarOi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="destinatario">Usuário</Label>
            <Select
              onValueChange={(value) => setValue("destinatarioId", value)}
              value={selectedUserId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((usuario) => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    {usuario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinatarioId && (
              <p className="text-sm text-red-500">
                {errors.destinatarioId.message}
              </p>
            )}
          </div>

          {selectedUser && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {selectedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  Será notificado do reconhecimento
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensagem */}
      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              2. Escreva sua mensagem
            </CardTitle>
            <CardDescription>
              Conte o que essa pessoa fez de especial (mínimo 10 caracteres)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Mensagem de reconhecimento</Label>
              <Textarea
                id="message"
                placeholder="Ex: Quero reconhecer o excelente trabalho que você fez no projeto X. Sua dedicação e criatividade fizeram toda a diferença!"
                {...register("message")}
                rows={4}
                className="mt-2"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  {message?.length || 0}/500 caracteres
                </p>
                {errors.message && (
                  <p className="text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            {/* Upload de imagem opcional */}
            <div>
              <Label htmlFor="image">Imagem (opcional)</Label>
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
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {selectedUserId && (
        <Card>
          <CardContent className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Enviar AcelerarOi 🚀
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </form>
  );
}




