import HomePage from "@/components/Dashboard";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserSession } from "@/types/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// --- REMOVEMOS A LISTA ESTÁTICA ---
// Agora buscamos tudo do banco de dados (Supabase)

function calculateStreak(checkins: any[]): number {
  if (checkins.length === 0) return 0;
  const dateMap = new Map<string, boolean>();

  checkins.forEach((checkin) => {
    const date = new Date(checkin.createdAt);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dateMap.set(dateKey, true);
  });

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;

    if (dateMap.has(dateKey)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

export default async function V4() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userSession = session.user as UserSession;

  // 1. Busca Usuário com seu Squad REAL do banco
  const usuario = await prisma.usuario.findUnique({
    where: { email: userSession.email },
    include: {
      squad: true, // Traz os dados do time automaticamente do banco
    }
  });

  // 2. Busca Check-ins para métricas PIFE
  const allCheckins = await prisma.checkinPife.findMany({
    where: { userId: usuario?.id as string },
    orderBy: { createdAt: "desc" },
  });

  const currentStreak = calculateStreak(allCheckins);
  const totalPoints = allCheckins.length * 10;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyCheckins = await prisma.checkinPife.count({
    where: {
      userId: usuario?.id as string,
      createdAt: { gte: weekAgo },
    },
  });
  const weeklyPoints = weeklyCheckins * 10;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthlyCheckins = await prisma.checkinPife.count({
    where: {
      userId: usuario?.id as string,
      createdAt: { gte: startOfMonth },
    },
  });

  // 3. Busca Squad e conta membros de forma dinâmica
  const memberCount = usuario?.squadId ? await prisma.usuario.count({
    where: { squadId: usuario.squadId }
  }) : 0;

  const squadInfo = usuario?.squad ? {
    id: usuario.squad.id,
    name: usuario.squad.name,
    color: "#FF5733", // Você pode adicionar uma coluna 'color' no banco depois
    memberCount,
  } : undefined;

  // 4. Busca todos os usuários para o "Acelerar Oi" (Social do PIFE)
  const usuarios = await prisma.usuario.findMany({
    where: { id: { not: usuario?.id } },
    select: { id: true, name: true, image: true },
    orderBy: { name: "asc" },
  });

  const acelerarOis = await prisma.acelerarOi.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      autor: true,
      destinatario: true,
      LikeAcelerarOi: true,
    }
  });

  return (
    <HomePage
      user={{ name: usuario?.name, image: usuario?.image }}
      pifeStats={{
        currentStreak,
        weeklyPoints,
        totalPoints,
        monthlyCheckins,
      }}
      usuarios={usuarios}
      acelerarOis={acelerarOis}
      currentUserId={usuario?.id as string}
      squad={squadInfo}
    />
  );
}
