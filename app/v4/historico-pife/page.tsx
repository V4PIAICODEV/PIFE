import HistoricoPIFEPage from "@/components/Pife/Hisorico";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getInitialHistoricoData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) {
    redirect("/login");
  }

  const page = 1;
  const limit = 10;

  // Get total count
  const total = await prisma.checkinPife.count({
    where: { userId: usuario.id },
  });

  // Get checkins with pagination
  const checkins = await prisma.checkinPife.findMany({
    where: { userId: usuario.id },
    include: {
      Like: true,
      Comment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
    take: limit,
  });

  // Map database enum back to frontend format
  const pifeReverseMap: Record<string, string> = {
    Profissional: "P",
    Intelectual: "I",
    Físico: "F",
    Emocional: "E",
  };

  const mappedCheckins = checkins.map((checkin) => ({
    id: checkin.id,
    date: checkin.createdAt.toISOString(),
    pife: pifeReverseMap[checkin.pife] as "P" | "I" | "F" | "E",
    note: checkin.description,
    image: checkin.image,
    link: checkin.link,
    points: 10,
    validated: true,
    likes: checkin.Like.length,
    comments: checkin.Comment.length,
  }));

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

  return {
    success: true,
    data: mappedCheckins,
    stats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function Page() {
  const initialData = await getInitialHistoricoData();

  return <HistoricoPIFEPage initialData={initialData} />;
}
