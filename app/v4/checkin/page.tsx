import CheckinPage from "@/components/Pife/chekin";
import authOptions from "@/lib/auth"; // <--- IMPORTANTE: Importamos as configurações
import { prisma } from "@/lib/prisma";
import { getDayRangeInTimezone } from "@/lib/timezone";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    // Limite de 1 ano
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

export default async function Page() {
  // CORREÇÃO AQUI: Passamos authOptions para o getServerSession funcionar
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Buscar usuário
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) {
    redirect("/login");
  }

  // Buscar todos os check-ins do usuário ordenados por data
  const allCheckins = await prisma.checkinPife.findMany({
    where: { userId: usuario.id },
    orderBy: { createdAt: "desc" },
  });

  // Calcular total de pontos (cada check-in vale 10 pontos)
  const totalPoints = allCheckins.length * 10;

  // Calcular streak (dias consecutivos)
  const streak = calculateStreak(allCheckins);

  // Pegar os 10 últimos check-ins
  const recentCheckins = allCheckins.slice(0, 10);

  const appTimezone = process.env.APP_TIMEZONE || "America/Sao_Paulo";
  const { start: dayStart, end: dayEnd } = getDayRangeInTimezone(appTimezone);

  const todayCheckins = await prisma.checkinPife.findMany({
    where: {
      userId: usuario.id,
      createdAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    select: {
      pife: true,
    },
  });

  // Tipos já preenchidos hoje (converter para o formato P, I, F, E)
  const pifeReverseMap: Record<string, string> = {
    Profissional: "P",
    Intelectual: "I",
    Físico: "F",
    Emocional: "E",
  };

  const completedToday = todayCheckins.map((c) => pifeReverseMap[c.pife]);

  return (
    <CheckinPage
      totalPoints={totalPoints}
      streak={streak}
      recentCheckins={recentCheckins}
      completedToday={completedToday}
    />
  );
}