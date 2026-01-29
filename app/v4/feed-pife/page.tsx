import FeedPIFEPage from "@/components/Pife/Feed";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getInitialFeedData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Buscar o usuário atual logado
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) {
    redirect("/login");
  }

  const limit = 10;

  // Fetch PIFE check-ins
  const checkins = await prisma.checkinPife.findMany({
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
    take: limit,
  });

  // Fetch Acelerar ROI posts
  const acelerarOis = await prisma.acelerarOi.findMany({
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
    take: limit,
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
    timestamp: checkin.createdAt.toISOString(),
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
      timestamp: comment.createdAt.toISOString(),
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
    timestamp: acelerarOi.createdAt.toISOString(),
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
      timestamp: comment.createdAt.toISOString(),
    })),
    isLiked: acelerarOi.LikeAcelerarOi.some(
      (like) => like.userId === usuario.id
    ),
  }));

  // Combine and sort by timestamp
  const allPosts = [...pifePost, ...acelerarRoiPosts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const paginatedPosts = allPosts.slice(0, limit);

  // Verificar se temos mais dados
  const totalAvailable = checkins.length + acelerarOis.length;
  const hasMore = totalAvailable > limit;

  // Next cursor é o timestamp do último post (sempre string)
  const nextCursor =
    paginatedPosts.length > 0 && hasMore
      ? paginatedPosts[paginatedPosts.length - 1].timestamp
      : null;

  console.log("=== SSR FEED ===");
  console.log("Checkins:", checkins.length);
  console.log("AcelerarOis:", acelerarOis.length);
  console.log("Total available:", totalAvailable);
  console.log("Paginated:", paginatedPosts.length);
  console.log("Has more:", hasMore);

  return {
    success: true,
    data: paginatedPosts,
    pagination: {
      page: 1,
      limit,
      total: totalAvailable,
      hasMore,
      nextCursor,
    },
  };
}

export default async function Page() {
  const initialData = await getInitialFeedData();

  return <FeedPIFEPage initialData={initialData} />;
}
