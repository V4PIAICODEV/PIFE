"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PIFEType } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookOpen,
  Briefcase,
  Dumbbell,
  ExternalLink,
  Flame,
  Heart,
  HeartIcon,
  Loader2,
  MessageCircle,
  Rocket,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface User {
  id: string;
  name: string;
  avatar: string | null;
  initials: string;
}

interface Destinatario {
  id: string;
  name: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  content: string;
  timestamp: string | Date;
}

interface PIFEPost {
  id: string;
  type: "pife";
  user: User;
  pife: string;
  description: string;
  image: string | null;
  link: string | null;
  timestamp: string | Date;
  likes: number;
  comments: number;
  commentsList: Comment[];
  isLiked: boolean;
}

interface AcelerarRoiPost {
  id: string;
  type: "acelerar-roi";
  user: User;
  destinatario: Destinatario;
  description: string;
  image: string | null;
  timestamp: string | Date;
  likes: number;
  comments: number;
  commentsList: Comment[];
  isLiked: boolean;
}

type FeedPost = PIFEPost | AcelerarRoiPost;

interface FeedResponse {
  success: boolean;
  data: FeedPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

interface FeedPIFEPageProps {
  initialData?: FeedResponse;
}

const PIFE_CONFIG = {
  P: { label: "Profissional", color: "bg-blue-500", icon: Briefcase },
  I: { label: "Intelectual", color: "bg-green-500", icon: BookOpen },
  F: { label: "Físico", color: "bg-orange-500", icon: Dumbbell },
  E: { label: "Emocional", color: "bg-purple-500", icon: HeartIcon },
};

// Fetch feed data
async function fetchFeed({
  pageParam,
}: {
  pageParam?: string | null;
}): Promise<FeedResponse> {
  const url = pageParam
    ? `/api/v4/feed?limit=10&cursor=${encodeURIComponent(pageParam)}`
    : `/api/v4/feed?limit=10`;

  console.log("Fetching feed:", url);
  console.log("Page param (cursor):", pageParam);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar feed");
  }

  return response.json();
}

// Toggle like mutation
async function toggleLike(postId: string, postType: "pife" | "acelerar-roi") {
  const endpoint =
    postType === "pife"
      ? `/api/v4/pife/${postId}/like`
      : `/api/v4/acelerar-oi/${postId}/like`;

  console.log("Calling like endpoint:", endpoint);

  const response = await fetch(endpoint, {
    method: "POST",
  });

  console.log("Like response status:", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("Like error response:", error);
    throw new Error("Erro ao dar like");
  }

  const data = await response.json();
  console.log("Like response data:", data);
  return data;
}

// Add comment mutation
async function addComment(
  postId: string,
  postType: "pife" | "acelerar-roi",
  content: string
) {
  const endpoint =
    postType === "pife"
      ? `/api/v4/pife/${postId}/comment`
      : `/api/v4/acelerar-oi/${postId}/comment`;

  console.log("Adding comment:", { endpoint, content });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  console.log("Comment response status:", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("Comment error response:", error);
    throw new Error("Erro ao comentar");
  }

  const data = await response.json();
  console.log("Comment response data:", data);
  return data;
}

export default function FeedPIFEPage({ initialData }: FeedPIFEPageProps) {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  // Infinite query for feed (cursor-based)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: fetchFeed,
      getNextPageParam: (lastPage) => {
        console.log("getNextPageParam called:", {
          hasMore: lastPage.pagination.hasMore,
          nextCursor: lastPage.pagination.nextCursor,
        });
        return lastPage.pagination.hasMore && lastPage.pagination.nextCursor
          ? lastPage.pagination.nextCursor
          : undefined;
      },
      initialPageParam: null as string | null,
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [null],
          }
        : undefined,
    });

  // Like mutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: ({
      postId,
      postType,
    }: {
      postId: string;
      postType: "pife" | "acelerar-roi";
    }) => {
      console.log("Like mutation triggered:", { postId, postType });
      return toggleLike(postId, postType);
    },
    onMutate: async ({ postId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(["feed"]);

      // Optimistically update
      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: FeedResponse) => ({
            ...page,
            data: page.data.map((post: FeedPost) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      console.error("Like error:", err);
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["feed"], context.previousData);
      }
    },
    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) {
      console.log("loadMoreRef not found");
      return;
    }

    console.log("Setting up Intersection Observer");

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Intersection Observer triggered:", {
          isIntersecting: entries[0].isIntersecting,
          hasNextPage,
          isFetchingNextPage,
        });

        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("🔥 Fetching next page!");
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      console.log("Disconnecting observer");
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Comment mutation with optimistic update
  const commentMutation = useMutation({
    mutationFn: ({
      postId,
      postType,
      content,
    }: {
      postId: string;
      postType: "pife" | "acelerar-roi";
      content: string;
    }) => {
      console.log("Comment mutation triggered:", { postId, postType, content });
      return addComment(postId, postType, content);
    },
    onMutate: async ({ postId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(["feed"]);

      // Optimistically update
      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: FeedResponse) => ({
            ...page,
            data: page.data.map((post: FeedPost) => {
              if (post.id === postId) {
                // Temporary optimistic comment
                const optimisticComment = {
                  id: `temp-${Date.now()}`,
                  user: {
                    id: "current-user",
                    name: "Você",
                    avatar: null,
                  },
                  content,
                  timestamp: new Date().toISOString(),
                };

                return {
                  ...post,
                  comments: post.comments + 1,
                  commentsList: [
                    optimisticComment,
                    ...(post.commentsList || []),
                  ],
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousData };
    },
    onSuccess: (data, variables) => {
      console.log("Comment success:", data);
      setCommentText((prev) => ({ ...prev, [variables.postId]: "" }));
    },
    onError: (err, variables, context) => {
      console.error("Comment error:", err);
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["feed"], context.previousData);
      }
    },
    onSettled: () => {
      // Refetch to get real data
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const handleLike = (postId: string, postType: "pife" | "acelerar-roi") => {
    likeMutation.mutate({ postId, postType });
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleComment = (postId: string, postType: "pife" | "acelerar-roi") => {
    const content = commentText[postId]?.trim();
    if (!content) return;

    commentMutation.mutate({ postId, postType, content });
  };

  // Get all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  // Debug
  useEffect(() => {
    console.log("=== FEED DEBUG ===");
    console.log("Total pages loaded:", data?.pages.length);
    console.log("Total posts:", allPosts.length);
    console.log("Has next page:", hasNextPage);
    console.log("Is fetching next:", isFetchingNextPage);
  }, [data, allPosts.length, hasNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h1 className="text-xl font-bold">Feed PIFE</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {allPosts.map((post) => {
            // Determine badge config
            let badgeConfig;
            let IconComponent;
            let badgeText;

            if (post.type === "pife") {
              const pifeConfig = PIFE_CONFIG[post.pife as PIFEType];
              badgeConfig = pifeConfig?.color || "bg-orange-500";
              IconComponent = pifeConfig?.icon || Flame;
              badgeText = post.pife;
            } else {
              badgeConfig = "bg-orange-500";
              IconComponent = Rocket;
              badgeText = "Acelerar ROI";
            }

            return (
              <Card key={post.id} className="overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={post.user.avatar || "/placeholder.svg"}
                        alt={post.user.name}
                      />
                      <AvatarFallback>{post.user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {post.user.name}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`${badgeConfig} text-white border-0 text-xs`}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {badgeText}
                        </Badge>
                      </div>
                      {post.type === "acelerar-roi" && (
                        <p className="text-xs text-muted-foreground">
                          enviou para{" "}
                          <span className="font-semibold">
                            {post.destinatario.name}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.timestamp), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={post.image}
                      alt="Post"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => handleLike(post.id, post.type)}
                        disabled={likeMutation.isPending}
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            post.isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.type === "pife" && post.link && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {post.type === "pife" && (
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-xs font-medium text-orange-500">
                            +10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Likes Count */}
                  <p className="font-semibold text-sm">{post.likes} curtidas</p>

                  {/* Comments Count */}
                  {post.comments > 0 && (
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Ver {post.comments} comentário
                      {post.comments !== 1 ? "s" : ""}
                    </button>
                  )}

                  {/* Post Description */}
                  <div className="text-sm">
                    <span className="font-semibold mr-2">{post.user.name}</span>
                    <span>{post.description}</span>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <div className="space-y-3 pt-3 border-t">
                      {/* Comments List */}
                      {post.commentsList && post.commentsList.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {post.commentsList.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex gap-2 text-sm"
                            >
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage
                                  src={
                                    comment.user.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="text-xs">
                                  {comment.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="bg-muted rounded-lg px-3 py-2">
                                  <p className="font-semibold text-xs">
                                    {comment.user.name}
                                  </p>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(
                                    new Date(comment.timestamp),
                                    {
                                      addSuffix: true,
                                      locale: ptBR,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Adicione um comentário..."
                          value={commentText[post.id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleComment(post.id, post.type);
                            }
                          }}
                          className="text-sm"
                          disabled={commentMutation.isPending}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(post.id, post.type)}
                          disabled={
                            !commentText[post.id]?.trim() ||
                            commentMutation.isPending
                          }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="py-4 text-center">
            {isFetchingNextPage && (
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-500" />
            )}
            {hasNextPage && !isFetchingNextPage && (
              <p className="text-xs text-muted-foreground">
                Role para carregar mais...
              </p>
            )}
            {!hasNextPage && allPosts.length > 0 && (
              <p className="text-xs text-muted-foreground">Fim do feed</p>
            )}
          </div>

          {/* Empty State */}
          {allPosts.length === 0 && (
            <Card className="p-12 text-center">
              <Flame className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum check-in ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Seja o primeiro a fazer um check-in e compartilhar sua jornada!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
