"use client";

import { GamificationStats } from "@/components/gamification-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart, Loader2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FormAceleraRoi from "./FormAceleraRoi";

// Função para calcular tempo relativo
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  return "agora";
}

interface Usuario {
  id: string;
  name: string;
  image: string | null;
}

interface AcelerarOi {
  id: string;
  message: string;
  image: string | null;
  createdAt: Date | string;
  autor: Usuario;
  destinatario: Usuario;
  LikeAcelerarOi: Array<{ userId: string }>;
}

interface AcelerarOiResponse {
  success: boolean;
  data: AcelerarOi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

interface HomePageProps {
  user: {
    name: string;
    image: string;
  };
  pifeStats: {
    currentStreak: number;
    weeklyPoints: number;
    totalPoints: number;
    monthlyCheckins: number;
  };
  usuarios: Usuario[];
  acelerarOis: AcelerarOi[];
  currentUserId: string;
  squad?: {
    id: string;
    name: string;
    color: string;
    memberCount: number;
  };
}

async function fetchAcelerarOis({ pageParam = 1 }): Promise<AcelerarOiResponse> {
  const response = await fetch(`/api/v4/acelerar-oi?page=${pageParam}&limit=10`);
  if (!response.ok) throw new Error("Erro ao buscar Acelerar ROIs");
  return response.json();
}

async function toggleLikeAcelerarOi(acelerarOiId: string) {
  const response = await fetch(`/api/v4/acelerar-oi/${acelerarOiId}/like`, { method: "POST" });
  if (!response.ok) throw new Error("Erro ao dar like");
  return response.json();
}

export default function HomePage({
  user,
  pifeStats,
  usuarios,
  acelerarOis: initialAcelerarOis,
  currentUserId,
  squad: userSquad,
}: HomePageProps) {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["acelerar-rois"],
    queryFn: fetchAcelerarOis,
    getNextPageParam: (lastPage) => lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    initialData: {
      pages: [{
        success: true,
        data: initialAcelerarOis,
        pagination: { page: 1, limit: 10, total: initialAcelerarOis.length, hasMore: initialAcelerarOis.length >= 10, nextCursor: null },
      }],
      pageParams: [1],
    },
  });

  const likeMutation = useMutation({
    mutationFn: (acelerarOiId: string) => toggleLikeAcelerarOi(acelerarOiId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["acelerar-rois"] }); },
  });

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { threshold: 0.1 });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allAcelerarOis = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="container mx-auto px-2 md:py-8 py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image} />
            <AvatarFallback className="bg-orange-500 text-white font-bold">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Bem vindo, {user.name}</h1>
            <p className="text-sm font-semibold" style={{ color: userSquad?.color || '#888' }}>
              {userSquad ? userSquad.name : "Sem Squad"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* PIFE Stats */}
        <div className="lg:col-span-3">
          <GamificationStats
            currentStreak={pifeStats.currentStreak}
            longestStreak={pifeStats.currentStreak}
            totalPoints={pifeStats.totalPoints}
            weeklyGoal={280}
            weeklyProgress={pifeStats.weeklyPoints}
            level={Math.floor(pifeStats.totalPoints / 350)}
            nextLevelPoints={(Math.floor(pifeStats.totalPoints / 350) + 1) * 350}
            currentLevelPoints={pifeStats.totalPoints}
            monthlyCheckins={pifeStats.monthlyCheckins}
          />
        </div>

        {/* #SUCESSO Mural */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">#SUCESSO</CardTitle>
              <CardDescription className="text-sm">Reconhecimento Profissional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormAceleraRoi usuarios={usuarios} />
              <div className="max-h-[600px] overflow-y-auto space-y-3">
                {allAcelerarOis.map((post) => (
                  <div key={post.id} className="pb-3 border-b last:border-0">
                    <div className="flex items-start gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.autor.image || undefined} />
                        <AvatarFallback>{post.autor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{post.autor.name} ➔ {post.destinatario.name}</p>
                        <p className="text-xs text-muted-foreground italic">"{post.message}"</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeMutation.mutate(post.id)}
                          className="h-6 px-1 text-xs"
                        >
                          <Heart className={`h-3 w-3 mr-1 ${post.LikeAcelerarOi.some(l => l.userId === currentUserId) ? "fill-red-500 text-red-500" : ""}`} />
                          {post.LikeAcelerarOi.length}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
