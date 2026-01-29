import { z } from "zod";

export enum LEVEL_OPTIONS {
  ADMIN = "ADMIN",
  COORDINATOR = "COORDINATOR",
  PLAYER = "PLAYER",
}

export const cadastroUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    image: z
      .any()
      .optional()
      .refine(
        (files) => {
          if (!files) return true;
          if (typeof FileList !== "undefined" && files instanceof FileList) {
            if (files.length === 0) return true;
            return files[0]?.size <= 5000000; // 5MB max
          }
          return true;
        },
        { message: "Imagem deve ter no máximo 5MB" }
      )
      .refine(
        (files) => {
          if (!files) return true;
          if (typeof FileList !== "undefined" && files instanceof FileList) {
            if (files.length === 0) return true;
            const file = files[0];
            return file?.type.startsWith("image/") || !file;
          }
          return true;
        },
        { message: "Apenas imagens são permitidas" }
      ),
    squad: z.string().min(1, "Selecione um squad"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    passwordConfirmation: z
      .string()
      .min(1, "Confirmação de senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export interface UserSession {
  id: string;
  name: string;
  email: string;
  level: LEVEL_OPTIONS;
  squad: string | null;
  image: string;
}

export enum PIFE_TYPES {
  P = "P",
  I = "I",
  F = "F",
  E = "E",
}

export enum EVIDENCE_TYPES {
  NOTE = "note",
  PHOTO = "photo",
  LINK = "link",
}

export const cadastroPife = z
  .object({
    pife: z.enum(["P", "I", "F", "E"], {
      required_error: "Selecione um tipo de atividade",
    }),
    evidenceType: z.nativeEnum(EVIDENCE_TYPES),
    description: z
      .string()
      .min(10, "Descrição deve ter pelo menos 10 caracteres")
      .max(500, "Descrição deve ter no máximo 500 caracteres"),
    image: z.any().optional(),
    link: z.string().url("Link inválido").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Se o tipo de evidência for PHOTO, a imagem é obrigatória
      if (data.evidenceType === EVIDENCE_TYPES.PHOTO) {
        return data.image && data.image.length > 0;
      }
      return true;
    },
    {
      message: "Selecione uma imagem quando o tipo de evidência for foto",
      path: ["image"],
    }
  )
  .refine(
    (data) => {
      // Se o tipo de evidência for LINK, o link é obrigatório
      if (data.evidenceType === EVIDENCE_TYPES.LINK) {
        return data.link && data.link.trim() !== "";
      }
      return true;
    },
    {
      message: "Informe um link quando o tipo de evidência for link",
      path: ["link"],
    }
  );

export const cadastroAcelerarOi = z.object({
  destinatarioId: z.string().min(1, "Selecione um usuário"),
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(500, "Mensagem deve ter no máximo 500 caracteres"),
});
