import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockSquads } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { Mail, Users } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: { squad: string };
}) {
  const squad = await searchParams;

  // Buscar usuários do squad
  const squadUsers = await prisma.usuario.findMany({
    where: {
      squad: squad.squad,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Mapear o número do squad para o nome no mock-data
  const squadInfo = mockSquads.find((s) => s.id === String(squad.squad));
  const squadName = squadInfo ? squadInfo.name : `#${squad.squad}`;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Squad Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Squad {squadName}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-2 text-base">
            <Users className="h-4 w-4" />
            {squadUsers.length} {squadUsers.length === 1 ? "membro" : "membros"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Squad Members */}
      <Card>
        <CardHeader>
          <CardTitle>Membros</CardTitle>
          <CardDescription>
            Todos os membros que fazem parte deste squad
          </CardDescription>
        </CardHeader>
        <CardContent>
          {squadUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum membro encontrado neste squad.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {squadUsers.map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Avatar */}
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="space-y-1 w-full">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
