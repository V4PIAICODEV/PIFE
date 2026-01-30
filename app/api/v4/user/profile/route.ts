import authOptions from "@/lib/auth";
import { uploadFile } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Receber FormData
    const formData = await request.formData();

    const name = formData.get("name") as string;
    // Alterado de 'squad' para 'squadId' para alinhar com o banco
    const squadId = formData.get("squad") as string | null; 
    const imageFile = formData.get("image") as File | null;

    // Validações
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Nome deve ter pelo menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Upload da imagem para o MinIO (se fornecida)
    let imageUrl = usuario.image;
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadFile(imageFile);
        console.log("Imagem salva no MinIO:", imageUrl);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        // Se der erro aqui, verifique as variáveis do MinIO na Vercel
        return NextResponse.json(
          { message: "Erro ao fazer upload da imagem" },
          { status: 500 }
        );
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        name: name.trim(),
        // AJUSTE: O nome da coluna no banco é squadId
        squadId: squadId || null, 
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        squadId: true, // Ajustado para squadId
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Perfil atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
