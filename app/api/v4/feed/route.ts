import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor");

    console.log("=== FEED API ===");
    console.log("Limit:", limit);
    console.log("Cursor:", cursor);
    console.log("Usuario ID:", usuario.id);

    // Buscar posts com cursor-based pagination
    // Se tem cursor, busca posts ANTES dessa data
    // Buscar mais para poder combinar e ordenar
    const fetchLimit = limit * 2;

    // Fetch PIFE check-ins
    const checkins = await prisma.checkinPife.findMany({
      where: cursor ? { createdAt: { lt: new Date(cursor) } } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        Like: {
          select: {
            userId: true,
          },
        },
        Comment: {
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
      orderBy: {
        createdAt: "desc",
      },
      take: fetchLimit,
    });

    // Fetch Acelerar ROI posts
    const acelerarOis = await prisma.acelerarOi.findMany({
      where: cursor ? { createdAt: { lt: new Date(cursor) } } : {},
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
      orderBy: {
        createdAt: "desc",
      },
      take: fetchLimit,
    });

    // Map PIFE enum to frontend format
    const pifeReverseMap: Record<string, string> = {
      Profissional: "P",
      Intelectual: "I",
      Físico: "F",
      Emocional: "E",
    };

    // Format PIFE posts
    const pifePost = checkins.map((checkin) => ({
      id: checkin.id,
      type: "pife" as const,
      user: {
        id: checkin.user.id,
        name: checkin.user.name,
        avatar: checkin.user.image,
        initials: checkin.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
      pife: pifeReverseMap[checkin.pife],
      description: checkin.description,
      image: checkin.image,
      link: checkin.link,
      timestamp: checkin.createdAt,
      likes: checkin.Like.length,
      comments: checkin.Comment.length,
      commentsList: checkin.Comment.map((comment) => ({
        id: comment.id,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.image,
        },
        content: comment.content || "",
        timestamp: comment.createdAt,
      })),
      isLiked: checkin.Like.some((like) => like.userId === usuario.id),
    }));

    // Format Acelerar ROI posts
    const acelerarRoiPosts = acelerarOis.map((acelerarOi) => ({
      id: acelerarOi.id,
      type: "acelerar-roi" as const,
      user: {
        id: acelerarOi.autor.id,
        name: acelerarOi.autor.name,
        avatar: acelerarOi.autor.image,
        initials: acelerarOi.autor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
      destinatario: {
        id: acelerarOi.destinatario.id,
        name: acelerarOi.destinatario.name,
        avatar: acelerarOi.destinatario.image,
      },
      description: acelerarOi.message,
      image: acelerarOi.image,
      timestamp: acelerarOi.createdAt,
      likes: acelerarOi.LikeAcelerarOi.length,
      comments: acelerarOi.CommentAcelerarOi.length,
      commentsList: acelerarOi.CommentAcelerarOi.map((comment) => ({
        id: comment.id,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.image,
        },
        content: comment.content,
        timestamp: comment.createdAt,
      })),
      isLiked: acelerarOi.LikeAcelerarOi.some(
        (like) => like.userId === usuario.id
      ),
    }));

    // Combine and sort by timestamp (most recent first)
    const allPosts = [...pifePost, ...acelerarRoiPosts].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Pegar apenas o que foi solicitado (limit)
    const paginatedPosts = allPosts.slice(0, limit);

    // HasMore se temos posts suficientes OU se buscamos o máximo de alguma fonte
    const hasMore =
      allPosts.length > limit ||
      checkins.length === fetchLimit ||
      acelerarOis.length === fetchLimit;

    // Get next cursor (timestamp do ÚLTIMO post retornado) - sempre como string
    const nextCursor =
      paginatedPosts.length > 0
        ? new Date(
            paginatedPosts[paginatedPosts.length - 1].timestamp
          ).toISOString()
        : null;

    console.log("=== FEED RESPONSE ===");
    console.log("Checkins fetched:", checkins.length);
    console.log("AcelerarOis fetched:", acelerarOis.length);
    console.log("All posts combined:", allPosts.length);
    console.log("Paginated posts:", paginatedPosts.length);
    console.log("Has more:", hasMore);
    console.log("Next cursor:", nextCursor);
    console.log("First post date:", paginatedPosts[0]?.timestamp);
    console.log(
      "Last post date:",
      paginatedPosts[paginatedPosts.length - 1]?.timestamp
    );

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page: 1, // Não usado em cursor-based
        limit,
        total: allPosts.length,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar feed:", error);
    return NextResponse.json({ error: "Erro ao buscar feed" }, { status: 500 });
  }
}
