import { toast } from "sonner";

interface RequestOptions {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  body?: any;
  showSuccessToast?: boolean;
}

/**
 * Função utilitária para fazer requisições HTTP
 * Detecta automaticamente FormData e aplica headers corretos
 */
export const makeRequest = async ({
  url,
  method,
  body,
  showSuccessToast = false,
}: RequestOptions) => {
  try {
    // Configurar headers e body baseado no tipo
    const isFormData = body instanceof FormData;
    const headers: HeadersInit = isFormData
      ? {} // Deixar o browser definir Content-Type com boundary
      : { "Content-Type": "application/json" };

    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result.message || response.statusText || "Erro na requisição";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (showSuccessToast && result.message) {
      toast.success(result.message);
    }

    return { response, result };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao realizar requisição");
  }
};

export default makeRequest;
