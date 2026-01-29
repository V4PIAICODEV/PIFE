import { uploadFile } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { getDayRangeInTimezone } from "@/lib/timezone";
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const pifeFilter = searchParams.get("pife"); // P, I, F, E or null

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: usuario.id,
    };

    // Map filter to database enum
    if (pifeFilter) {
      const pifeMap: Record<string, string> = {
        P: "Profissional",
        I: "Intelectual",
        F: "Físico",
        E: "Emocional",
      };
      where.pife = pifeMap[pifeFilter];
    }

    // Get total count for pagination
    const total = await prisma.checkinPife.count({ where });

    // Get checkins with pagination
    const checkins = await prisma.checkinPife.findMany({
      where,
      include: {
        Like: true,
        Comment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Map database enum back to frontend format
    const mappedCheckins = checkins.map((checkin) => {
      const pifeReverseMap: Record<string, string> = {
        Profissional: "P",
        Intelectual: "I",
        Físico: "F",
        Emocional: "E",
      };

      return {
        id: checkin.id,
        date: checkin.createdAt,
        pife: pifeReverseMap[checkin.pife],
        note: checkin.description,
        image: checkin.image,
        link: checkin.link,
        points: 10, // Fixed points per check-in
        validated: true, // All check-ins are validated
        likes: checkin.Like.length,
        comments: checkin.Comment.length,
      };
    });

    // Calculate statistics
    const allCheckins = await prisma.checkinPife.findMany({
      where: { userId: usuario.id },
      select: { pife: true, createdAt: true },
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const stats = {
      total: allCheckins.length,
      thisMonth: allCheckins.filter(
        (c) =>
          c.createdAt.getMonth() === currentMonth &&
          c.createdAt.getFullYear() === currentYear
      ).length,
      byCategory: {
        P: allCheckins.filter((c) => c.pife === "Profissional").length,
        I: allCheckins.filter((c) => c.pife === "Intelectual").length,
        F: allCheckins.filter((c) => c.pife === "Físico").length,
        E: allCheckins.filter((c) => c.pife === "Emocional").length,
      },
    };

    return NextResponse.json({
      success: true,
      data: mappedCheckins,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar check-ins:", error);
    return NextResponse.json(
      { error: "Erro ao buscar check-ins" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Receber FormData
    const formData = await request.formData();

    const pife = formData.get("pife") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Validações básicas
    if (!pife || !description) {
      return NextResponse.json(
        { error: "PIFE e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    // Get user from database
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Map PIFE enum values
    const pifeMap: Record<string, string> = {
      P: "Profissional",
      I: "Intelectual",
      F: "Físico",
      E: "Emocional",
    };

    const pifeType = pifeMap[pife];

    const appTimezone = process.env.APP_TIMEZONE || "America/Sao_Paulo";
    const { start: todayStartUTC, end: todayEndUTC } =
      getDayRangeInTimezone(appTimezone);

    // Verificar se já existe check-in do mesmo tipo PIFE hoje (no timezone da aplicação)
    const existingCheckin = await prisma.checkinPife.findFirst({
      where: {
        userId: usuario.id,
        pife: pifeType as any,
        createdAt: {
          gte: todayStartUTC,
          lte: todayEndUTC,
        },
      },
    });

    if (existingCheckin) {
      const pifeNames: Record<string, string> = {
        P: "Profissional",
        I: "Intelectual",
        F: "Físico",
        E: "Emocional",
      };

      return NextResponse.json(
        {
          error: `Você já realizou um check-in ${pifeNames[pife]} hoje. Você pode postar apenas 1 check-in de cada tipo PIFE por dia (máximo 40 pontos = 4 tipos diferentes).`,
        },
        { status: 400 }
      );
    }

    // Upload da imagem para o MinIO (se fornecida)
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadFile(imageFile);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return NextResponse.json(
          { error: "Erro ao fazer upload da imagem" },
          { status: 500 }
        );
      }
    }

    const checkin = await prisma.checkinPife.create({
      data: {
        pife: pifeMap[pife] as any,
        description,
        image: imageUrl, // Salva a URL retornada pelo MinIO
        link: link || null,
        userId: usuario.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        checkin,
        message: "Check-in realizado com sucesso!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar check-in:", error);
    return NextResponse.json(
      { error: "Erro ao criar check-in" },
      { status: 500 }
    );
  }
}
