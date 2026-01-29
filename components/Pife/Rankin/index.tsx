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
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
      case 2:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800";
      case 3:
        return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800";
      default:
        return isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-muted/20";
    }
  };

  // Usar pontos mensais se for a aba mensal, senão usar pontos totais
  const pifePoints = period === "mensal" ? user.monthlyPoints : user.totalPoints;
  const pifeStreak = user.streak;
  const monthlyCheckins = user.monthlyCheckins;

  return (
    <Card
      className={`${getRankColor()} ${
        isCurrentUser ? "ring-2 ring-primary/20" : ""
      }`}
    >
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
                alt={`${user.name} profile`}
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
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">
                    Você
                  </Badge>
                )}
              </p>
              <div className="flex items-center gap-2">
                {user.squad && (
                  <Badge variant="secondary" className="text-xs">
                    {user.squad}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {monthlyCheckins} este mês
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{pifePoints}</p>
            <p className="text-sm text-muted-foreground">pontos PIFE</p>
            <div className="flex items-center gap-1 mt-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-500">{pifeStreak} dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RankingPIFEPage({
  users,
  currentUserId,
}: RankingPageProps) {
  const pifeRanking = users;

  const getCurrentUserRank = () => {
    return pifeRanking.findIndex((u) => u.id === currentUserId) + 1;
  };

  const currentUserData = pifeRanking.find((u) => u.id === currentUserId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ranking PIFE</h1>
        <p className="text-muted-foreground">
          Ranking baseado na consistência e qualidade dos check-ins PIFE
        </p>
      </div>

      {/* Current User PIFE Stats */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Suas Métricas PIFE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                #{getCurrentUserRank()}
              </p>
              <p className="text-sm text-muted-foreground">Posição PIFE</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {currentUserData?.totalPoints || 0}
              </p>
              <p className="text-sm text-muted-foreground">Pontos PIFE</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">
                {currentUserData?.streak || 0}
              </p>
              <p className="text-sm text-muted-foreground">Streak Atual</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {currentUserData?.monthlyCheckins || 0}
              </p>
              <p className="text-sm text-muted-foreground">Este Mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PIFE Methodology Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Metodologia PIFE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2">
                <Briefcase className="h-4 w-4" />
              </div>
              <p className="font-semibold text-blue-700">Profissional</p>
              <p className="text-xs text-blue-600">Atividades profissionais</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-4 w-4" />
              </div>
              <p className="font-semibold text-green-700">Intelectual</p>
              <p className="text-xs text-green-600">
                Desenvolvimento intelectual
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-2">
                <Dumbbell className="h-4 w-4" />
              </div>
              <p className="font-semibold text-purple-700">Físico</p>
              <p className="text-xs text-purple-600">Atividades físicas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-2">
                <Heart className="h-4 w-4" />
              </div>
              <p className="font-semibold text-orange-700">Emocional</p>
              <p className="text-xs text-orange-600">Bem-estar emocional</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="geral">Ranking Geral</TabsTrigger>
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ranking Geral PIFE</h3>
            <Badge variant="outline">Baseado em pontos PIFE totais</Badge>
          </div>
          <div className="space-y-3">
            {pifeRanking.map((user, index) => (
              <PIFERankingCard
                key={user.id}
                user={user}
                rank={index + 1}
                period="geral"
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mensal" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ranking Mensal</h3>
            <Badge variant="outline">Check-ins deste mês</Badge>
          </div>
          <div className="space-y-3">
            {[...pifeRanking]
              .sort((a, b) => {
                if (b.monthlyPoints !== a.monthlyPoints) {
                  return b.monthlyPoints - a.monthlyPoints;
                }
                return b.streak - a.streak;
              })
              .map((user, index) => (
                <PIFERankingCard
                  key={user.id}
                  user={user}
                  rank={index + 1}
                  period="mensal"
                  currentUserId={currentUserId}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
