import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { LayoutClient } from "./layout-client";
import { redirect } from "next/navigation";

export default async function LayoutV4({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // LIMPEZA AQUI: Definimos apenas as seções do PIFE e Dashboard
  const navigationSections = [
    {
      type: "item",
      label: "Dashboard",
      href: "/v4",
      icon: "Home",
    },
    {
      type: "item",
      label: "Check-in PIFE",
      href: "/v4/checkin",
      icon: "Flame",
    },
    {
      type: "item",
      label: "Ranking PIFE",
      href: "/v4/ranking",
      icon: "Trophy",
    },
    {
      type: "item",
      label: "Mural das Faixas",
      href: "/v4/mural-faixas",
      icon: "Users",
    },
    {
      type: "item",
      label: "Configurações",
      href: "/v4/configuracoes",
      icon: "Settings",
    },
  ];

  return (
    <LayoutClient 
      user={session.user} 
      navigationSections={navigationSections}
    >
      {children}
    </LayoutClient>
  );
}
