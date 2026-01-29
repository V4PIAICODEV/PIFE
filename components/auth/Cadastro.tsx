"use client";

import { cadastroUserSchema } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import makeRequest from "@/hooks/use-requests";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type CadastroFormData = z.infer<typeof cadastroUserSchema>;

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
  // Estado para armazenar os Squads reais do banco
  const [squadsList, setSquadsList] = useState<{ id: string; name: string }[]>([]);
  
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroUserSchema),
    mode: "onSubmit",
    // --- CORREÇÃO IMPORTANTE DO ERRO 'UNCONTROLLED' ---
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      squad: "", 
    }
  });

  // Busca os Squads ao carregar a tela
  useEffect(() => {
    async function fetchSquads() {
      try {
        // Busca da rota PÚBLICA (que não exige login)
        const res = await fetch("/api/public/squads"); 
        
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSquadsList(data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar squads:", error);
      }
    }
    fetchSquads();
  }, []);

  const onSubmit = async (data: CadastroFormData) => {
    try {
      console.log("Iniciando envio do formulário:", data);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("passwordConfirmation", data.passwordConfirmation);
      formData.append("squad", data.squad); // Envia o ID real (CUID)
      
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const { result } = await makeRequest({
        url: "/api/cadastro",
        method: "POST",
        body: formData,
        showSuccessToast: true,
      });

      console.log("Cadastro realizado:", result);

      router.push("/login");
      reset();
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full flex flex-col gap-4"
    >
      <div className="">
        <Label htmlFor="signup-name" className={errors.name && "text-red-500"}>
          {errors.name?.message ? String(errors.name.message) : "Nome Completo"}
        </Label>
        <Input
          id="signup-name"
          {...register("name")}
          placeholder="Seu nome completo"
          className={errors.name ? "border-red-500" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="signup-email"
          className={errors.email && "text-red-500"}
        >
          {errors.email?.message ? String(errors.email.message) : "Email"}
        </Label>
        <Input
          id="signup-email"
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
          className={errors.email ? "border-red-500" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="signup-image"
          className={errors.image && "text-red-500"}
        >
          {errors.image?.message
            ? String(errors.image.message)
            : "Imagem do Perfil (opcional)"}
        </Label>
        <Input
          id="signup-image"
          {...register("image")}
          type="file"
          accept="image/*"
          className={errors.image ? "border-red-500" : ""}
        />
      </div>

      {/* SELEÇÃO DE SQUAD DINÂMICA */}
      <div className="space-y-2">
        <Label
          htmlFor="signup-squad"
          className={errors.squad && "text-red-500"}
        >
          {errors.squad?.message ? String(errors.squad.message) : "Squad"}
        </Label>
        <Controller
          control={control}
          name="squad"
          render={({ field }) => (
            // Adicionado || "" para garantir componente controlado
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className={errors.squad ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione um squad" />
              </SelectTrigger>
              <SelectContent>
                {squadsList.length > 0 ? (
                  squadsList.map((squad) => (
                    <SelectItem key={squad.id} value={squad.id}>
                      {squad.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>
                    Carregando squads...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-password"
          className={errors.password && "text-red-500"}
        >
          {errors.password?.message ? String(errors.password.message) : "Senha"}
        </Label>
        <Input
          id="signup-password"
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="********"
          className={errors.password ? "border-red-500" : ""}
          onMouseEnter={() => setShowPassword(true)}
          onMouseLeave={() => setShowPassword(false)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-password-confirmation"
          className={errors.passwordConfirmation && "text-red-500"}
        >
          {errors.passwordConfirmation?.message
            ? String(errors.passwordConfirmation.message)
            : "Confirmação de Senha"}
        </Label>
        <Input
          id="signup-password-confirmation"
          {...register("passwordConfirmation")}
          type={showPasswordConfirmation ? "text" : "password"}
          placeholder="********"
          className={errors.passwordConfirmation ? "border-red-500" : ""}
          onMouseEnter={() => setShowPasswordConfirmation(true)}
          onMouseLeave={() => setShowPasswordConfirmation(false)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#E70000] hover:bg-[#CC0000] col-span-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}