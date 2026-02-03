import { prisma } from "@/lib/prisma";
import { getDayRangeInTimezone } from "@/lib/timezone";
import authOptions from "@/lib/auth"; // Garanta que este import aponta para seu authOptions
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const pifeFilter = searchParams.get("pife");

    const skip = (page - 1) * limit;

    const where: any = { userId: usuario.id };

    if (pifeFilter) {
      const pifeMap: Record<string, string> = {
        P: "Profissional", I: "Intelectual", F: "Físico", E: "Emocional",
      };
      where.pife = pifeMap[pifeFilter];
    }

    const total = await prisma.checkinPife.count({ where });

    const checkins = await prisma.checkinPife.findMany({
      where,
      include: { Like: true, Comment: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const mappedCheckins = checkins.map((checkin) => {
      const pifeReverseMap: Record<string, string> = {
        Profissional: "P", Intelectual: "I", Físico: "F", Emocional: "E",
      };

      return {
        id: checkin.id,
        date: checkin.createdAt,
        pife: pifeReverseMap[checkin.pife as string],
        description: checkin.description, // Garantindo que o campo descrição seja enviado
        image: checkin.image, // URL DO SUPABASE AQUI
        link: checkin.link,
        likes: checkin.Like?.length || 0,
        comments: checkin.Comment?.length || 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: mappedCheckins,
      pagination: { total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Erro ao buscar check-ins:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // AJUSTE CRÍTICO: Agora recebemos JSON, pois o upload da imagem é feito no frontend via Supabase
    const body = await request.json();
    const { pife, description, link, image } = body; 

    if (!pife || !description) {
      return NextResponse.json({ error: "PIFE e descrição são obrigatórios" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const pifeMap: Record<string, string> = {
      P: "Profissional", I: "Intelectual", F: "Físico", E: "Emocional",
    };

    const pifeType = pifeMap[pife as string];

    // Validação de duplicidade no dia
    const appTimezone = process.env.APP_TIMEZONE || "America/Sao_Paulo";
    const { start: todayStartUTC, end: todayEndUTC } = getDayRangeInTimezone(appTimezone);

    const existingCheckin = await prisma.checkinPife.findFirst({
      where: {
        userId: usuario.id,
        pife: pifeType as any,
        createdAt: { gte: todayStartUTC, lte: todayEndUTC },
      },
    });

    if (existingCheckin) {
      return NextResponse.json({ 
        error: `Você já realizou um check-in ${pifeType} hoje.` 
      }, { status: 400 });
    }

    // Criação do check-in salvando a URL da imagem que veio do Supabase
    const checkin = await prisma.checkinPife.create({
      data: {
        pife: pifeType as any,
        description,
        image: image || null, // URL pública do Supabase
        link: link || null,
        userId: usuario.id,
      },
    });

    return NextResponse.json({
      success: true,
      checkin,
      message: "Check-in realizado com sucesso!",
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar check-in:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
