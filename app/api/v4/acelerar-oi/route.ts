import { uploadFile } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Receber FormData
    const formData = await request.formData();

    const destinatarioId = formData.get("destinatarioId") as string;
    const message = formData.get("message") as string;
    const imageFile = formData.get("image") as File | null;

    console.log("=== DEBUG ACELERAR OI ===");
    console.log("destinatarioId:", destinatarioId);
    console.log("message:", message);
    console.log(
      "imageFile:",
      imageFile
        ? {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
          }
        : null
    );

    // Validações básicas
    if (!destinatarioId || !message) {
      return NextResponse.json(
        { error: "Destinatário e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    // Get user from database (autor)
    const autor = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!autor) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se destinatário existe
    const destinatario = await prisma.usuario.findUnique({
      where: { id: destinatarioId },
    });

    if (!destinatario) {
      return NextResponse.json(
        { error: "Destinatário não encontrado" },
        { status: 404 }
      );
    }

    // Upload da imagem para o MinIO (se fornecida)
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("Iniciando upload da imagem...");
        imageUrl = await uploadFile(imageFile);
        console.log("Upload concluído! URL:", imageUrl);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return NextResponse.json(
          { error: "Erro ao fazer upload da imagem" },
          { status: 500 }
        );
      }
    } else {
      console.log("Nenhuma imagem para fazer upload");
    }

    const acelerarOi = await prisma.acelerarOi.create({
      data: {
        autorId: autor.id,
        destinatarioId: destinatario.id,
        message,
        image: imageUrl,
      },
      include: {
        autor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        destinatario: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    console.log("Acelerar Roi criado:", {
      id: acelerarOi.id,
      imageUrl: acelerarOi.image,
    });

    return NextResponse.json(
      {
        success: true,
        acelerarOi,
        message: "Acelerar Roi criado com sucesso!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar AcelerarOi:", error);
    return NextResponse.json(
      { error: "Erro ao criar AcelerarOi" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor");

    const skip = (page - 1) * limit;

    // Buscar AcelerarOi com paginação
    const acelerarOis = await prisma.acelerarOi.findMany({
      where: cursor ? { createdAt: { lt: new Date(cursor) } } : {},
      orderBy: { createdAt: "desc" },
      include: {
        autor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        destinatario: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        LikeAcelerarOi: {
          select: {
            userId: true,
          },
        },
        CommentAcelerarOi: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      take: limit,
    });

    // Get total count
    const total = await prisma.acelerarOi.count();

    const hasMore = acelerarOis.length === limit;
    const nextCursor =
      hasMore && acelerarOis.length > 0
        ? acelerarOis[acelerarOis.length - 1].createdAt.toISOString()
        : null;

    return NextResponse.json({
      success: true,
      data: acelerarOis,
      pagination: {
        page,
        limit,
        total,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar AcelerarOis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar AcelerarOis" },
      { status: 500 }
    );
  }
}
