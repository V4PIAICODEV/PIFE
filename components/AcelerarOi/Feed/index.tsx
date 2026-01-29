"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

interface Usuario {
  id: string;
  name: string;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: Usuario;
}

interface AcelerarOi {
  id: string;
  message: string;
  image: string | null;
  createdAt: Date;
  autor: Usuario;
  destinatario: Usuario;
  LikeAcelerarOi: Array<{ userId: string }>;
  CommentAcelerarOi: Comment[];
}

interface AcelerarOiFeedProps {
  acelerarOis: AcelerarOi[];
  currentUserId: string;
}

export default function AcelerarOiFeed({
  acelerarOis: initialData,
  currentUserId,
}: AcelerarOiFeedProps) {
  const [acelerarOis, setAcelerarOis] = useState(initialData);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  const handleLike = async (acelerarOiId: string) => {
    try {
      const response = await fetch(`/api/v4/acelerar-oi/${acelerarOiId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();

        setAcelerarOis((prev) =>
          prev.map((post) => {
            if (post.id === acelerarOiId) {
              const userLiked = post.LikeAcelerarOi.some(
                (like) => like.userId === currentUserId
              );

              if (userLiked) {
                // Remove like
                return {
                  ...post,
                  LikeAcelerarOi: post.LikeAcelerarOi.filter(
                    (like) => like.userId !== currentUserId
                  ),
                };
              } else {
                // Add like
                return {
                  ...post,
                  LikeAcelerarOi: [
                    ...post.LikeAcelerarOi,
                    { userId: currentUserId },
                  ],
                };
              }
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  const handleComment = async (acelerarOiId: string) => {
    const content = commentInputs[acelerarOiId]?.trim();

    if (!content) return;

    try {
      const response = await fetch(
        `/api/v4/acelerar-oi/${acelerarOiId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        setAcelerarOis((prev) =>
          prev.map((post) => {
            if (post.id === acelerarOiId) {
              return {
                ...post,
                CommentAcelerarOi: [result.comment, ...post.CommentAcelerarOi],
              };
            }
            return post;
          })
        );

        // Limpar input
        setCommentInputs((prev) => ({ ...prev, [acelerarOiId]: "" }));
      }
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  if (acelerarOis.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum AcelerarOi por aqui ainda. Seja o primeiro a reconhecer
            alguém! 🚀
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {acelerarOis.map((post) => {
        const isLiked = post.LikeAcelerarOi.some(
          (like) => like.userId === currentUserId
        );
        const likesCount = post.LikeAcelerarOi.length;

        return (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.autor.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {post.autor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.autor.name}</p>
                      <span className="text-muted-foreground">→</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={post.destinatario.image || undefined}
                        />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-orange-500 to-pink-600 text-white">
                          {post.destinatario.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{post.destinatario.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(post.createdAt))}
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-600">
                  AcelerarOi 🚀
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">{post.message}</p>

              {post.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Imagem do post"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-stretch">
              {/* Like and Comment Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                {likesCount > 0 && (
                  <span>
                    {likesCount} {likesCount === 1 ? "curtida" : "curtidas"}
                  </span>
                )}
                {post.CommentAcelerarOi.length > 0 && (
                  <span>
                    {post.CommentAcelerarOi.length}{" "}
                    {post.CommentAcelerarOi.length === 1
                      ? "comentário"
                      : "comentários"}
                  </span>
                )}
              </div>

              <Separator className="mb-3" />

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={isLiked ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Curtido" : "Curtir"}
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </div>

              {/* Comments Section */}
              {post.CommentAcelerarOi.length > 0 && (
                <div className="space-y-3 mb-4">
                  {post.CommentAcelerarOi.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.image || undefined} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {comment.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted rounded-lg p-3">
                        <p className="text-sm font-semibold">
                          {comment.user.name}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date(comment.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Escreva um comentário..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(post.id);
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={() => handleComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}




