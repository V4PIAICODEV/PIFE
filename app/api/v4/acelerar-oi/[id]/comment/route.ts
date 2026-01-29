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

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comentário não pode ser vazio" },
        { status: 400 }
      );
    }

    const acelerarOiId = params.id;

    const comment = await prisma.commentAcelerarOi.create({
      data: {
        userId: usuario.id,
        acelerarOiId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      comment,
      message: "Comentário adicionado",
    });
  } catch (error) {
    console.error("Erro ao comentar:", error);
    return NextResponse.json({ error: "Erro ao comentar" }, { status: 500 });
  }
}




