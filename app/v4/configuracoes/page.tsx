import Configuracoes from "@/components/Profile/idex";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

async function getUserData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      squad: true,
      level: true,
      createdAt: true,
    },
  });

  if (!usuario) {
    redirect("/login");
  }

  return {
    id: usuario.id,
    name: usuario.name,
    email: usuario.email,
    image: usuario.image,
    squad: usuario.squad,
    level: usuario.level,
    createdAt: usuario.createdAt.toISOString(),
  };
}

export default async function ConfiguracoesPage() {
  const userData = await getUserData();

  return <Configuracoes userData={userData} />;
}
