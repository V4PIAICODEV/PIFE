"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useRequests from "@/hooks/use-requests";
// Removemos o import do zod antigo para criar um novo aqui com regras mais flexíveis
// import { cadastroAcelerarOi } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Camera, Check, Rocket, Smile, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// --- NOVA REGRA DE VALIDAÇÃO (Mais flexível) ---
const cadastroAcelerarOiFlexivel = z.object({
  destinatarioId: z.string().min(1, "Selecione um usuário"),
  message: z
    .string()
    .min(2, "Mensagem muito curta") // Reduzido de 10 para 2 caracteres
    .max(500, "Mensagem deve ter no máximo 500 caracteres"),
});

type AcelerarOiFormData = z.infer<typeof cadastroAcelerarOiFlexivel>;

interface Usuario {
  id: string;
  name: string;
  image: string | null;
}

interface FormAcelerarOiProps {
  usuarios: Usuario[];
}

export default function FormAcelerarOi({ usuarios }: FormAcelerarOiProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Garantir que o emoji picker só renderize no cliente
  useEffect(() => {
    setMounted(true);
  }, [usuarios]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<AcelerarOiFormData>({
    resolver: zodResolver(cadastroAcelerarOiFlexivel),
    defaultValues: {
      message: "",
    },
  });

  const selectedUserId = watch("destinatarioId");
  const message = watch("message");

  const selectedUser = usuarios.find((u) => u.id === selectedUserId);

  // Filtrar usuários baseado na busca de menção
  const filteredUsers = usuarios.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  // Detectar @ e mostrar lista de menções
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // --- BLOQUEIO RÍGIDO DE 500 CARACTERES ---
    if (value.length > 500) {
       // Se tentar passar de 500, cortamos o texto e não deixamos digitar mais
       e.target.value = value.substring(0, 500);
       setValue("message", e.target.value);
       return; // Para a execução aqui
    }
    
    const cursorPosition = e.target.selectionStart;

    // Encontrar a última @ antes do cursor
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Verificar se não há espaço após o @
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        setSelectedMentionIndex(0);

        // Calcular posição do popover (aproximada)
        const textarea = textareaRef.current;
        if (textarea) {
          const lineHeight = 24; // Altura aproximada da linha
          const lines = textBeforeCursor.split("\n");
          const currentLine = lines.length - 1;
          const top = currentLine * lineHeight + 40; // +40 para offset

          setMentionPosition({ top, left: 0 });
        }
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Inserir menção de usuário
  const insertMention = (user: Usuario) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const value = message || "";
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textBeforeAt = value.substring(0, lastAtIndex);
      const textAfterCursor = value.substring(cursorPosition);
      const newValue = `${textBeforeAt}@${user.name} ${textAfterCursor}`;

      setValue("message", newValue);
      setValue("destinatarioId", user.id);
      setShowMentions(false);

      // Refocar e posicionar cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = lastAtIndex + user.name.length + 2; // +2 para @ e espaço
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  // Navegação por teclado nas menções
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions || filteredUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedMentionIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      insertMention(filteredUsers[selectedMentionIndex]);
    } else if (e.key === "Escape") {
      setShowMentions(false);
    }
  };

  // Fechar menções e emoji picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Fechar menções
      if (
        mentionsRef.current &&
        !mentionsRef.current.contains(target) &&
        !textareaRef.current?.contains(target)
      ) {
        setShowMentions(false);
      }

      // Fechar emoji picker
      const emojiPickerContainer = document.querySelector(".EmojiPickerReact");
      if (
        showEmojiPicker &&
        emojiPickerContainer &&
        !emojiPickerContainer.contains(target)
      ) {
        const emojiButton = document.querySelector("[data-emoji-button]");
        if (emojiButton && !emojiButton.contains(target)) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Adicionar emoji ao texto
  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = message || "";
    // Verifica limite antes de adicionar emoji
    if (currentMessage.length + emojiData.emoji.length > 500) return;

    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage =
        currentMessage.substring(0, start) +
        emojiData.emoji +
        currentMessage.substring(end);

      setValue("message", newMessage);

      // Manter o cursor na posição correta após inserir o emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + emojiData.emoji.length,
          start + emojiData.emoji.length
        );
      }, 0);
    } else {
      setValue("message", currentMessage + emojiData.emoji);
    }

    setShowEmojiPicker(false);
  };

  // Preview da imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remover imagem
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: AcelerarOiFormData) => {
    try {
      // Preparar FormData para envio
      const formData = new FormData();
      formData.append("destinatarioId", data.destinatarioId);
      formData.append("message", data.message);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // Call API
      await useRequests({
        url: "/api/v4/acelerar-oi",
        method: "POST",
        body: formData,
        showSuccessToast: true,
      });

      reset();
      setImagePreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        router.refresh();
        // window.location.reload(); // Opcional: descomente se o router.refresh não atualizar a lista
      }, 1000);
    } catch (error) {
      console.error("Erro ao criar AcelerarOi:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Preview do usuário selecionado */}
      {selectedUser && (
        <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
          <Avatar>
            <AvatarImage src={selectedUser.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-600 text-white">
              {selectedUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Reconhecendo {selectedUser.name}
            </p>
            <p className="text-xs text-muted-foreground">Será notificado 🚀</p>
          </div>
        </div>
      )}

      {/* Mensagem com menções */}
      <div className="space-y-2 relative">
        <Textarea
          {...register("message")}
          ref={(e) => {
            register("message").ref(e);
            (textareaRef as any).current = e;
          }}
          onChange={(e) => {
            register("message").onChange(e);
            handleTextChange(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Digite @ para mencionar alguém..."
          rows={3}
          maxLength={500} // Bloqueio nativo do HTML
          className="resize-none"
        />

        {/* Lista de menções */}
        {showMentions && (
          <div
            ref={mentionsRef}
            className="absolute z-50 w-full max-w-sm bg-popover border rounded-md shadow-lg"
            style={{ top: `${mentionPosition.top}px` }}
          >
            {filteredUsers.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.map((user, index) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => insertMention(user)}
                    className={`w-full flex items-center gap-2 p-2 hover:bg-accent transition-colors ${
                      index === selectedMentionIndex ? "bg-accent" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.name.toLowerCase().replace(/\s+/g, "")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {!selectedUserId && (
              <span className="mr-2">
                💡 Digite{" "}
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded">@</kbd>{" "}
                para mencionar
              </span>
            )}
            {/* Contador de caracteres com cor de alerta se chegar perto do limite */}
            <span className={message?.length === 500 ? "text-red-500 font-bold" : ""}>
               {message?.length || 0}/500 caracteres
            </span>
          </p>
          {errors.message && (
            <p className="text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>
      </div>

      {/* Preview da imagem */}
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
            
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Emoji Picker */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              data-emoji-button
            >
              <Smile className="h-4 w-4" />
            </Button>
            {showEmojiPicker && mounted && (
              <div className="absolute bottom-full left-0 mb-2 z-[9999] bg-background border rounded-lg shadow-2xl">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    onEmojiClick(emojiData);
                  }}
                  width={350}
                  height={400}
                  theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                  searchPlaceHolder="Buscar emoji..."
                  previewConfig={{ showPreview: false }}
                  lazyLoadEmojis={true}
                />
              </div>
            )}
          </div>

          {/* Upload de imagem */}
          <label htmlFor="image-upload">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              asChild
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </label>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !selectedUserId || !message?.trim()}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-black dark:text-white"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Enviar
            </>
          )}
        </Button>
      </div>
    </form>
  );
}