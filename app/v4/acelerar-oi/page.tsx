import AcelerarOiForm from "@/components/AcelerarOi/Form";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AcelerarOiPage() {
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

  // Buscar todos os usuários exceto o atual
  const usuarios = await prisma.usuario.findMany({
    where: {
      id: {
        not: currentUser.id,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <AcelerarOiForm usuarios={usuarios} />
      </div>
    </div>
  );
}




