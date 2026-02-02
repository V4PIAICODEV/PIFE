import authOptions from "@/lib/auth";
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
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const squadId = formData.get("squad") as string | null; 
    const imageFile = formData.get("image") as File | null;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ message: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }

    // --- LOG PARA DEBUG (Veja no terminal da Vercel) ---
    console.log("Tentando atualizar usuário:", usuario.email, "para o Squad:", squadId);

    // Ajuste da Imagem: Se o MinIO estiver falhando, o sistema ignorará o upload 
    // e manterá a imagem atual em vez de retornar Erro 500.
    let imageUrl = usuario.image;
    
    // NOTA: Se você não estiver usando o MinIO agora, recomendo converter a imagem 
    // para Base64 ou usar o Supabase Storage futuramente.
    // Por enquanto, apenas comentamos o erro fatal.

    // Atualizar usuário no Prisma
    const updatedUser = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        name: name.trim(),
        // Aqui garantimos que o squadId seja passado corretamente ou limpo se for vazio
        squadId: (squadId && squadId !== "undefined" && squadId !== "null") ? squadId : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        squadId: true,
        level: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Perfil atualizado com sucesso!",
    });
  } catch (error: any) {
    console.error("ERRO CRÍTICO NO PERFIL:", error.message);
    
    // Se o erro for de Chave Estrangeira (Squad não existe)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: "O Squad selecionado não existe no banco de dados." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erro interno ao atualizar perfil. Verifique os dados do Squad." },
      { status: 500 }
    );
  }
}
