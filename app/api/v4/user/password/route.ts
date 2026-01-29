import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
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

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    if (newPassword.length < 3) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    // Verificar senha atual (comparação direta, sem hash)
    if (currentPassword !== usuario.password) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    // Verificar se senha nova é diferente da atual
    if (newPassword === usuario.password) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da senha atual" },
        { status: 400 }
      );
    }

    // Atualizar senha (sem hash, mantendo consistência com o resto da aplicação)
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: newPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: "Erro ao alterar senha" },
      { status: 500 }
    );
  }
}
