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

    // ALTERAÇÃO: Agora recebemos JSON do frontend, não mais FormData
    const body = await request.json();
    const { name, squadId, image } = body;

    // Validação básica do nome
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ message: "Nome inválido" }, { status: 400 });
    }

    // Validação de Squad: Garante que o ID seja um UUID válido ou null
    const validSquadId = (squadId && squadId.length > 5) ? squadId : null;

    const updatedUser = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        name: name.trim(),
        squadId: validSquadId,
        // Se 'image' vier no body, usamos ela (URL do Supabase), senão mantemos a atual
        image: image !== undefined ? image : usuario.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        squadId: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Perfil atualizado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    
    // Erro P2003 = Chave estrangeira (Squad ID não existe no banco)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: "O Squad selecionado não é válido." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Erro interno ao salvar perfil" }, { status: 500 });
  }
}
