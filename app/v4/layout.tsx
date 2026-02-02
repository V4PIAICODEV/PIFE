import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
// AJUSTE AQUI: O nome do arquivo no GitHub é layout-client.tsx
import { LayoutClient } from "./layout-client"; 
import { redirect } from "next/navigation";

export default async function LayoutV4({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Restaurando o menu completo do PIFE
  const navigationSections = [
    {
      type: "item",
      label: "Dashboard",
      href: "/v4",
      icon: "Home",
    },
    {
      type: "section",
      title: "SISTEMA PIFE",
      items: [
        { label: "Check-in Diário", href: "/v4/checkin", icon: "Flame" },
        { label: "Ranking Geral", href: "/v4/ranking", icon: "Trophy" },
        { label: "Meu Histórico", href: "/v4/historico-pife", icon: "Clock" },
        { label: "Feed de Equipe", href: "/v4/feed-pife", icon: "MessageSquare" },
        { label: "Mural de Faixas", href: "/v4/mural-faixas", icon: "Users" },
      ],
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
