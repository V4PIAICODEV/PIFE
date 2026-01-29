import AcelerarOiFeed from "@/components/AcelerarOi/Feed";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus, Rocket } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0; // Sempre buscar dados frescos

export default async function AcelerarOiFeedPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Buscar usuário atual
  const currentUser = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Buscar todos os AcelerarOis
  const acelerarOis = await prisma.acelerarOi.findMany({
    orderBy: { createdAt: "desc" },
    include: {
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
      CommentAcelerarOi: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    take: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold">Feed AcelerarOi</h1>
            </div>
            <p className="text-muted-foreground">
              Veja os reconhecimentos da equipe
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-orange-500 to-pink-600"
          >
            <Link href="/v4/acelerar-oi">
              <Plus className="h-4 w-4 mr-2" />
              Criar AcelerarOi
            </Link>
          </Button>
        </div>

        {/* Feed */}
        <AcelerarOiFeed
          acelerarOis={acelerarOis}
          currentUserId={currentUser.id}
        />
      </div>
    </div>
  );
}




