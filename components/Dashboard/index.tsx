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
import { mockUsers } from "@/lib/mock-data";
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

// Fetch Acelerar ROI with pagination
async function fetchAcelerarOis({
  pageParam = 1,
}): Promise<AcelerarOiResponse> {
  const response = await fetch(
    `/api/v4/acelerar-oi?page=${pageParam}&limit=10`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar Acelerar ROIs");
  }

  return response.json();
}

// Toggle like mutation
async function toggleLikeAcelerarOi(acelerarOiId: string) {
  const response = await fetch(`/api/v4/acelerar-oi/${acelerarOiId}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erro ao dar like");
  }

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

  // Infinite query for Acelerar ROIs
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["acelerar-rois"],
      queryFn: fetchAcelerarOis,
      getNextPageParam: (lastPage) => {
        return lastPage.pagination.hasMore
          ? lastPage.pagination.page + 1
          : undefined;
      },
      initialPageParam: 1,
      initialData: {
        pages: [
          {
            success: true,
            data: initialAcelerarOis,
            pagination: {
              page: 1,
              limit: 10,
              total: initialAcelerarOis.length,
              hasMore: initialAcelerarOis.length >= 10,
              nextCursor:
                initialAcelerarOis.length > 0
                  ? new Date(
                      initialAcelerarOis[
                        initialAcelerarOis.length - 1
                      ].createdAt
                    ).toISOString()
                  : null,
            },
          },
        ],
        pageParams: [1],
      },
    });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (acelerarOiId: string) => toggleLikeAcelerarOi(acelerarOiId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acelerar-rois"] });
    },
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLike = (acelerarOiId: string) => {
    likeMutation.mutate(acelerarOiId);
  };

  // Get all posts from all pages
  const allAcelerarOis = data?.pages.flatMap((page) => page.data) || [];

  if (!user || !pifeStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 md:py-8 py-4 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            <AvatarImage src={user.image} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold text-balance">
              Bem vindo investidor, {user.name}
            </h1>
            {/* SQUAD aqui no lugar da data */}
            <p 
              className="mt-1 lg:text-xl text-sm font-semibold"
              style={{ color: userSquad?.color || '#888' }}
            >
              {userSquad ? userSquad.name : "Sem Squad"}
            </p>
          </div>
        </div>

        {/* DATA no canto direito e menor */}
        <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Stats Section */}
        <div className="lg:col-span-3">
          <GamificationStats
            currentStreak={pifeStats.currentStreak}
            longestStreak={pifeStats.currentStreak}
            totalPoints={pifeStats.totalPoints}
            weeklyGoal={280}
            weeklyProgress={pifeStats.weeklyPoints}
            level={Math.floor(pifeStats.totalPoints / 350)}
            nextLevelPoints={
              (Math.floor(pifeStats.totalPoints / 350) + 1) * 350
            }
            currentLevelPoints={pifeStats.totalPoints}
            monthlyCheckins={pifeStats.monthlyCheckins}
          />
        </div>

        {/* Right Sidebar - #SUCESSO and other sections */}
        <div className="space-y-4 flex flex-col-reverse lg:flex-col gap-4 min-w-[280px]">
          {/* #SUCESSO Mural */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  {/* Título alterado para #SUCESSO */}
                  <CardTitle className="text-lg">#SUCESSO</CardTitle>
                  <CardDescription className="text-sm">
                    Mural de elogios profissionais
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/logo-v4.png"
                    alt="V4"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New post input */}
              <FormAceleraRoi usuarios={usuarios} />

              <div
                className="max-h-[800px] overflow-y-auto space-y-3"
                id="acelerar-roi-scroll"
              >
                {/* AcelerarOis */}
                {allAcelerarOis.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">
                      Nenhum reconhecimento ainda. Seja o primeiro! 🚀
                    </p>
                  </div>
                ) : (
                  <>
                    {allAcelerarOis.map((post) => {
                      const isLiked = post.LikeAcelerarOi.some(
                        (like) => like.userId === currentUserId
                      );
                      const likesCount = post.LikeAcelerarOi.length;

                      // Calcular tempo relativo
                      const timeAgo = getTimeAgo(new Date(post.createdAt));

                      return (
                        <div
                          key={post.id}
                          className="pb-3 border-b border-border/50 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage
                                src={post.autor.image || undefined}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                {post.autor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="font-medium">
                                  {post.autor.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {timeAgo}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-sm">Para: </span>
                                <Avatar className="inline-flex h-4 w-4 align-middle mx-1">
                                  <AvatarImage
                                    src={post.destinatario.image || undefined}
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {post.destinatario.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-red-600">
                                  {post.destinatario.name}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 italic">
                                {post.message}
                              </p>
                              {post.image && post.image.trim() !== "" && (
                                <div className="mt-2">
                                  <img
                                    src={post.image}
                                    alt="Evidência"
                                    className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  disabled={likeMutation.isPending}
                                  className={`h-6 px-2 ${
                                    isLiked
                                      ? "text-red-500"
                                      : "text-muted-foreground hover:text-red-500"
                                  }`}
                                >
                                  <Heart
                                    className={`h-3 w-3 mr-1 ${
                                      isLiked ? "fill-current" : ""
                                    }`}
                                  />
                                  <span className="text-xs">{likesCount}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Load More Trigger */}
                    {hasNextPage && (
                      <div ref={loadMoreRef} className="py-4 text-center">
                        {isFetchingNextPage && (
                          <Loader2 className="h-5 w-5 animate-spin mx-auto text-orange-500" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {userSquad && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  {userSquad.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: userSquad.color }}
                >
                  {userSquad.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{userSquad.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {userSquad.memberCount} membros
                </p>
                <Link
                  href={`/v4/squad?squad=${userSquad.id}`}
                  className="cursor-pointer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Ver Squad
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}