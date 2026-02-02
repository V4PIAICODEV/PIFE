"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BookOpen,
  Briefcase,
  Dumbbell,
  Flame,
  Heart,
  Medal,
  Target,
  Trophy,
} from "lucide-react";
import Image from "next/image";

// Interface ajustada para refletir que o squad pode ser um objeto do banco
interface UserRanking {
  id: string;
  name: string;
  email: string;
  image: string | null;
  squad: { id: string; name: string } | string | null; // Ajustado aqui
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

interface RankingPageProps {
  users: UserRanking[];
  currentUserId: string;
}

function PIFERankingCard({
  user,
  rank,
  period,
  currentUserId,
}: {
  user: UserRanking;
  rank: number;
  period: string;
  currentUserId: string;
}) {
  const isCurrentUser = user.id === currentUserId;

  const getRankIcon = () => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return null;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 1: return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
      case 2: return "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800";
      case 3: return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800";
      default: return isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-card";
    }
  };

  // CORREÇÃO DO ERRO #31: Extraindo o nome se for um objeto
  const squadName = typeof user.squad === "object" ? user.squad?.name : user.squad;

  const pifePoints = period === "mensal" ? user.monthlyPoints : user.totalPoints;

  return (
    <Card className={`${getRankColor()} ${isCurrentUser ? "ring-2 ring-primary/20" : ""}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getRankIcon()}
              <span className="font-bold text-lg">#{rank}</span>
            </div>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold flex items-center gap-2">
                {user.name}
                {isCurrentUser && <Badge variant="outline" className="text-[10px] h-4">VOCÊ</Badge>}
              </p>
              <div className="flex items-center gap-2">
                {/* Renderizando apenas o texto do nome do Squad */}
                {squadName && (
                  <Badge variant="secondary" className="text-xs">
                    {squadName}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px]">
                  {user.monthlyCheckins} check-ins
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{pifePoints}</p>
            <p className="text-xs text-muted-foreground">pontos PIFE</p>
            <div className="flex items-center justify-end gap-1 mt-1 text-orange-500">
              <Flame className="h-3 w-3" />
              <span className="text-xs font-bold">{user.streak} dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RankingPIFEPage({ users = [], currentUserId }: RankingPageProps) {
  const pifeRanking = users;
  const currentUserData = pifeRanking.find((u) => u.id === currentUserId);
  const currentUserRank = pifeRanking.findIndex((u) => u.id === currentUserId) + 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 uppercase">Ranking PIFE</h1>
        <p className="text-muted-foreground">Consistência e evolução profissional, física e mental.</p>
      </div>

      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-primary">#{currentUserRank || "-"}</p>
              <p className="text-xs text-muted-foreground uppercase">Sua Posição</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary">{currentUserData?.totalPoints || 0}</p>
              <p className="text-xs text-muted-foreground uppercase">Pontos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-orange-500">{currentUserData?.streak || 0}</p>
              <p className="text-xs text-muted-foreground uppercase">Streak</p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-500">{currentUserData?.monthlyCheckins || 0}</p>
              <p className="text-xs text-muted-foreground uppercase">Este Mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="geral">GERAL</TabsTrigger>
          <TabsTrigger value="mensal">MENSAL</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-3">
          {pifeRanking.map((user, index) => (
            <PIFERankingCard key={user.id} user={user} rank={index + 1} period="geral" currentUserId={currentUserId} />
          ))}
        </TabsContent>

        <TabsContent value="mensal" className="space-y-3">
          {[...pifeRanking]
            .sort((a, b) => b.monthlyPoints - a.monthlyPoints)
            .map((user, index) => (
              <PIFERankingCard key={user.id} user={user} rank={index + 1} period="mensal" currentUserId={currentUserId} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
