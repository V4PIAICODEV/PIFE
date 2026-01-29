// Versão "Dublê" para rodar localmente sem erros
export const minioClient = {} as any;

export async function uploadFile(file: File): Promise<string> {
  console.log("Upload simulado: Imagem ignorada no modo local.");
  return ""; 
}

export async function deleteFile(fileUrl: string): Promise<void> {
  console.log("Delete simulado.");
}