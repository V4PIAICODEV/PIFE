import HomePage from "@/components/Dashboard";
import authOptions from "@/lib/auth";
// Removemos o import antigo: import { mockSquads } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { UserSession } from "@/types/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// --- NOVA LISTA DE SQUADS (Definida Localmente) ---
const mockSquads = [
  { id: "1", name: "Financeiro", color: "#EF4444" },
  { id: "2", name: "P&P", color: "#F97316" },
  { id: "3", name: "Assemble", color: "#F59E0B" },
  { id: "4", name: "Growth Lab", color: "#84CC16" },
  { id: "5", name: "Growthx", color: "#10B981" },
  { id: "6", name: "Roi Eagles", color: "#06B6D4" },
  { id: "7", name: "Sharks", color: "#3B82F6" },
  { id: "8", name: "Stark", color: "#6366F1" },
  { id: "9", name: "V4X", color: "#8B5CF6" },
  { id: "10", name: "Monetização", color: "#D946EF" },
  { id: "11", name: "Sales Ops", color: "#F43F5E" },
  { id: "12", name: "Tremborage", color: "#64748B" },
];

/**
 * Calcula o streak (sequência de dias consecutivos)
 * Se faltar um dia, volta a zero
 */
function calculateStreak(checkins: any[]): number {
  if (checkins.length === 0) return 0;

  // Agrupar check-ins por data (ignorar hora)
  const dateMap = new Map<string, boolean>();

  checkins.forEach((checkin) => {
    const date = new Date(checkin.createdAt);
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dateMap.set(dateKey, true);
  });

  // Verificar dias consecutivos a partir de hoje
  let streak = 0;
  const today = new Date();

  // Começar verificando de hoje para trás
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const dateKey = `${checkDate.getFullYear()}-${String(
      checkDate.getMonth() + 1
    ).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;

    if (dateMap.has(dateKey)) {
      streak++;
    } else {
      // Se não tem check-in neste dia, para a contagem
      // Exceto se for o primeiro dia (hoje) - pode não ter feito ainda
      if (i === 0) {
        continue;
      }
      break;
    }
  }

  return streak;
}

export default async function V4() {
  const user = await getServerSession(authOptions);

  if (!user) {
    redirect("/login");
  }

  const userSession = user.user as UserSession;

  // Buscar usuário no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email: userSession.email },
  });

  // Buscar todos os check-ins do usuário
  const allCheckins = await prisma.checkinPife.findMany({
    where: { userId: usuario?.id as string },
    orderBy: { createdAt: "desc" },
  });

  // 1. Calcular streak (dias consecutivos)
  const currentStreak = calculateStreak(allCheckins);

  // 2. Pontos totais até hoje (cada check-in vale 10 pontos)
  const totalPoints = allCheckins.length * 10;

  // 3. Pontos da semana (últimos 7 dias)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const weeklyCheckins = await prisma.checkinPife.count({
    where: {
      userId: usuario?.id as string,
      createdAt: {
        gte: weekAgo,
      },
    },
  });
  const weeklyPoints = weeklyCheckins * 10;

  // 4. Check-ins do mês
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyCheckins = await prisma.checkinPife.count({
    where: {
      userId: usuario?.id as string,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  const userS = {
    name: userSession.name,
    image: usuario?.image as string,
  };

  // Buscar squad completo do usuário usando a NOVA LISTA
  // Nota: userSession.squad guarda o ID (ex: "1", "2").
  // Se você cadastrou com o ID "1", ele vai achar "Financeiro" agora.
  const userSquad = userSession.squad
    ? mockSquads.find((s) => s.id === userSession.squad)
    : undefined;

  // Buscar todos os usuários exceto o atual para o FormAcelerarOi
  const usuarios = await prisma.usuario.findMany({
    where: {
      id: {
        not: usuario?.id as string,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalUsuarios = await prisma.usuario.count({
    where: {
      squadId: userSquad?.id,
    },
  });

  // Se o squad não for encontrado (ex: usuário antigo com ID que não existe mais),
  // enviamos um objeto vazio ou padrão para não quebrar a tela
  const squadInfo = userSquad ? {
    id: userSquad.id,
    name: userSquad.name,
    color: userSquad.color,
    memberCount: totalUsuarios,
  } : undefined;

  console.log(squadInfo);

  // Buscar AcelerarOis recentes
  const acelerarOis = await prisma.acelerarOi.findMany({
    orderBy: { createdAt: "desc" },
    take: 10, // Últimos 10
    select: {
      id: true,
      message: true,
      image: true, 
      createdAt: true,
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
    },
  });

  return (
    <HomePage
      user={userS}
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