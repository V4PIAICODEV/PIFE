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
    const imageUrl = formData.get("imageUrl") as string | null; // Receberemos a URL já pronta do frontend

    // Validação de Squad: O erro 400 ocorre se o ID não for um UUID válido do Supabase
    // Se o ID for "1", "2" (do mock), o Prisma vai rejeitar.
    const validSquadId = (squadId && squadId.length > 5) ? squadId : null;

    const updatedUser = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        name: name.trim(),
        squadId: validSquadId,
        image: imageUrl || usuario.image,
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
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: "ID de Squad inválido para o banco Supabase." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
