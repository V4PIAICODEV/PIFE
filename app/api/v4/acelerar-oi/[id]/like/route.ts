import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const acelerarOiId = params.id;

    // Verificar se já deu like
    const existingLike = await prisma.likeAcelerarOi.findUnique({
      where: {
        userId_acelerarOiId: {
          userId: usuario.id,
          acelerarOiId,
        },
      },
    });

    if (existingLike) {
      // Se já deu like, remover (unlike)
      await prisma.likeAcelerarOi.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Like removido",
      });
    } else {
      // Se não deu like, adicionar
      await prisma.likeAcelerarOi.create({
        data: {
          userId: usuario.id,
          acelerarOiId,
        },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Like adicionado",
      });
    }
  } catch (error) {
    console.error("Erro ao dar like:", error);
    return NextResponse.json({ error: "Erro ao dar like" }, { status: 500 });
  }
}




