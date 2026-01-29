import RankingPifePage from "@/components/Pife/Rankin";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface UserRanking {
  id: string;
  name: string;
  email: string;
  image: string | null;
  squad: string | null;
  totalPoints: number;
  monthlyCheckins: number;
  monthlyPoints: number;
  streak: number;
  lastCheckinDate: Date | null;
  pifeBreakdown: {
    P: number;
    I: number;
    F: number;
    E: number;
  };
}

async function getRankingData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentUser = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Buscar todos os usuários
  const users = await prisma.usuario.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      squad: true,
    },
  });

  // Calcular estatísticas para cada usuário
  const usersWithStats: UserRanking[] = await Promise.all(
    users.map(async (user) => {
      // Buscar todos os check-ins do usuário
      const checkins = await prisma.checkinPife.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          pife: true,
          createdAt: true,
        },
      });

      // Calcular pontos totais (10 pontos por check-in)
      const totalPoints = checkins.length * 10;

      // Calcular check-ins do mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCheckins = checkins.filter(
        (c) => c.createdAt >= startOfMonth
      ).length;

      // Calcular pontos mensais (10 pontos por check-in do mês)
      const monthlyPoints = monthlyCheckins * 10;

      // Calcular streak (dias consecutivos)
      let streak = 0;
      if (checkins.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedCheckins = checkins.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        const lastCheckin = new Date(sortedCheckins[0].createdAt);
        lastCheckin.setHours(0, 0, 0, 0);

        // Verificar se tem check-in hoje ou ontem
        const diffDays = Math.floor(
          (today.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 1) {
          streak = 1;
          let currentDate = new Date(lastCheckin);
          currentDate.setDate(currentDate.getDate() - 1);

          for (let i = 1; i < sortedCheckins.length; i++) {
            const checkinDate = new Date(sortedCheckins[i].createdAt);
            checkinDate.setHours(0, 0, 0, 0);

            if (checkinDate.getTime() === currentDate.getTime()) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else if (checkinDate.getTime() < currentDate.getTime()) {
              break;
            }
          }
        }
      }

      // Calcular breakdown por categoria PIFE
      const pifeMap: Record<string, keyof UserRanking["pifeBreakdown"]> = {
        Profissional: "P",
        Intelectual: "I",
        Físico: "F",
        Emocional: "E",
      };

      const pifeBreakdown = {
        P: 0,
        I: 0,
        F: 0,
        E: 0,
      };

      checkins.forEach((checkin) => {
        const key = pifeMap[checkin.pife];
        if (key) {
          pifeBreakdown[key]++;
        }
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        squad: user.squad,
        totalPoints,
        monthlyCheckins,
        monthlyPoints,
        streak,
        lastCheckinDate: checkins.length > 0 ? checkins[0].createdAt : null,
        pifeBreakdown,
      };
    })
  );

  // Ordenar por pontos totais (ranking geral)
  const rankedUsers = usersWithStats.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.streak - a.streak;
  });

  return {
    users: rankedUsers,
    currentUserId: currentUser.id,
  };
}

export default async function RankingPage() {
  const data = await getRankingData();

  return (
    <RankingPifePage users={data.users} currentUserId={data.currentUserId} />
  );
}
