import { LayoutClient } from "@/components/LayoutV4";
import authOptions from "@/lib/auth";
import { UserSession } from "@/types/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LayoutV4({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getServerSession(authOptions);

  if (!result) {
    redirect("/login");
  }
  const user = result.user as UserSession;

  const allNavigationSections = [
    {
      type: "item",
      href: "/v4",
      label: "Dashboard",
      icon: "Home",
      allowedRoles: ["player", "coordinator", "admin"],
    },
    {
      type: "section",
      title: "PDI",
      allowedRoles: ["coordinator", "admin"],
      items: [
        { href: "/v4/trilha", label: "Trilha", icon: "BookOpen" },
        { href: "/v4/calendario", label: "Calendário", icon: "Calendar" },
        { href: "/v4/mural-faixas", label: "Mural das Faixas", icon: "Users" },
        { href: "/v4/treinamentos", label: "Treinamentos", icon: "Play" },
      ],
    },
    {
      type: "section",
      title: "PIFE",
      allowedRoles: ["player", "coordinator", "admin"],
      items: [
        { href: "/v4/checkin", label: "Check-in PIFE", icon: "Flame" },
        { href: "/v4/ranking", label: "Ranking PIFE", icon: "Trophy" },
        { href: "/v4/historico-pife", label: "Histórico", icon: "Clock" },
        { href: "/v4/feed-pife", label: "Feed PIFE", icon: "Users" },
      ],
    },
    {
      type: "section",
      title: "P&P",
      allowedRoles: ["coordinator", "admin"],
      items: [
        { href: "/v4/organograma", label: "Organograma", icon: "Network" },
        {
          href: "/v4/periodo-descanso",
          label: "Período de Descanso",
          icon: "Coffee",
        },
        { href: "/v4/time", label: "Time", icon: "UserPlus" },
        {
          href: "/v4/registro-1x1",
          label: "Registro de 1:1",
          icon: "MessageSquare",
        },
        { href: "/v4/ranking-1x1", label: "Ranking 1:1", icon: "BarChart3" },
      ],
    },

    {
      type: "section",
      title: "Admin",
      allowedRoles: ["admin"],
      items: [
        { href: "/v4/admin", label: "Admin", icon: "Settings" },
        {
          href: "/v4/admin/trilhas",
          label: "Gerenciar Trilhas",
          icon: "BookOpen",
        },
          { href: "/v4/admin/squads", label: "Gerenciar Squads", icon: "Users" },
        { href: "/v4/admin/usuarios", label: "Usuários", icon: "Users" },
      ],
    },
  ];

  // Filtrar seções baseadas no nível de permissão do usuário com hierarquia
  // Admin vê tudo, Coordinator vê coordinator + player, Player vê apenas player
  const userLevel = user.level.toLowerCase();

  const getRolesBasedOnHierarchy = (level: string): string[] => {
    switch (level) {
      case "admin":
        return ["admin", "coordinator", "player"];
      case "coordinator":
        return ["coordinator", "player"];
      case "player":
        return ["player"];
      default:
        return ["player"];
    }
  };

  const allowedRoles = getRolesBasedOnHierarchy(userLevel);
  const filteredNavigationSections = allNavigationSections.filter((section) =>
    section.allowedRoles.some((role) => allowedRoles.includes(role))
  );

  return (
    <LayoutClient user={user} navigationSections={filteredNavigationSections}>
      {children}
    </LayoutClient>
  );
}
