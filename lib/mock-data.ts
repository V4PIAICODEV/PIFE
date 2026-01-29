import type {
  Badge,
  BeltType,
  Item,
  MentoringSession,
  PraisePost,
  Squad,
  Step,
  User,
} from "./types";

export const BELT_COLORS: Record<BeltType, string> = {
  white: "#ffffff",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  brown: "#a16207",
  black: "#1f2937",
};

export const BELT_NAMES: Record<BeltType, string> = {
  white: "Faixa Branca",
  blue: "Faixa Azul",
  purple: "Faixa Roxa",
  brown: "Faixa Marrom",
  black: "Faixa Preta",
};

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@empresa.com",
    role: "player", // Regular user - cannot see P&P
    squadId: "1",
    belt: "blue",
    degree: 2,
    points: 450,
    streak: 7,
    createdAt: new Date("2024-01-15"),
    profilePhoto: "/professional-woman-avatar.png",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@empresa.com",
    role: "coordinator", // Coordinator - can view but not edit
    squadId: "1",
    belt: "white",
    degree: 4,
    points: 280,
    streak: 3,
    createdAt: new Date("2024-02-01"),
    profilePhoto: "/professional-man-avatar.png",
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria@empresa.com",
    role: "coordinator", // Updated to coordinator role
    squadId: "2",
    belt: "purple",
    degree: 1,
    points: 720,
    streak: 12,
    createdAt: new Date("2023-11-10"),
    profilePhoto: "/mentor-woman-avatar.jpg",
  },
  {
    id: "4",
    name: "João Admin",
    email: "joao@empresa.com",
    role: "admin", // Full admin access
    squadId: "3",
    belt: "black",
    degree: 3,
    points: 1200,
    streak: 25,
    createdAt: new Date("2023-08-01"),
    profilePhoto: "/admin-man-avatar.jpg",
  },
];

export const mockSquads: Squad[] = [
  { id: "1", name: "ASAP ROI", color: "#3b82f6" },
  { id: "2", name: "SOX", color: "#10b981" },
  { id: "3", name: "Cyber Crew", color: "#f59e0b" },
  { id: "4", name: "Brabo2Coin", color: "#8b5cf6" },
  { id: "5", name: "Inside Sharks", color: "#ef4444" },
  { id: "6", name: "Batmeta", color: "#06b6d4" },
  { id: "7", name: "Codezillas-techops", color: "#84cc16" },
  { id: "8", name: "Áreas de Meio", color: "#1f2937" },
  { id: "9", name: "USA", color: "#1f2937" },
];

export const mockSteps: Step[] = [
  {
    id: "v0",
    name: "Step V0 - Fundamentos",
    belt: "white",
    order: 0,
    description: "Conhecimentos básicos e fundamentos",
    color: "#ffffff",
  },
  {
    id: "v1",
    name: "Step V1 - Intermediário",
    belt: "blue",
    order: 1,
    description: "Desenvolvimento de habilidades intermediárias",
    color: "#3b82f6",
  },
  {
    id: "v2",
    name: "Step V2 - Avançado",
    belt: "purple",
    order: 2,
    description: "Competências avançadas e especialização",
    color: "#8b5cf6",
  },
];

export const mockItems: Item[] = [
  {
    id: "1",
    stepId: "v0",
    type: "course",
    title: "Cientista do Marketing - Completo",
    url: "https://example.com/course1",
    required: true,
    points: 30,
    description: "Curso completo sobre marketing digital e análise de dados",
  },
  {
    id: "2",
    stepId: "v0",
    type: "book",
    title: "Growth Hacking - Sean Ellis",
    required: true,
    points: 40,
    description: "Livro sobre estratégias de crescimento e otimização",
  },
  {
    id: "3",
    stepId: "v0",
    type: "course",
    title: "Ekyte Gestão de Tarefas - Stooge",
    url: "https://example.com/course2",
    required: false,
    points: 25,
    description: "Metodologias de gestão de tarefas e produtividade",
  },
  {
    id: "4",
    stepId: "v0",
    type: "course",
    title: "Account Manager Iniciante - Stooge",
    url: "https://example.com/course3",
    required: false,
    points: 30,
    description:
      "Fundamentos de gestão de contas e relacionamento com clientes",
  },
  {
    id: "5",
    stepId: "v0",
    type: "course",
    title: "Formação Gestão de Tráfego - Iniciante Stooge",
    url: "https://example.com/course4",
    required: true,
    points: 35,
    description: "Curso completo de gestão de tráfego pago para iniciantes",
  },

  // V1 - Blue Belt Items
  {
    id: "6",
    stepId: "v1",
    type: "course",
    title: "Curso Stooge - Customer Success Iniciante",
    url: "https://example.com/course5",
    required: true,
    points: 40,
    description: "Fundamentos de Customer Success e retenção de clientes",
  },
  {
    id: "7",
    stepId: "v1",
    type: "course",
    title: "IA para Marketing - Adapta",
    url: "https://example.com/course6",
    required: false,
    points: 35,
    description:
      "Aplicação de inteligência artificial em estratégias de marketing",
  },
  {
    id: "8",
    stepId: "v1",
    type: "cert",
    title: "META ASSOCIATE: 100-101",
    url: "https://www.facebook.com/business/learn",
    required: true,
    points: 60,
    description:
      "Certificação oficial Meta para profissionais de marketing digital",
  },
  {
    id: "9",
    stepId: "v1",
    type: "cert",
    title: "Google Analytics 4 Skillshop",
    url: "https://skillshop.withgoogle.com",
    required: true,
    points: 60,
    description: "Certificação oficial do Google Analytics 4",
  },
  {
    id: "10",
    stepId: "v1",
    type: "book",
    title: "Empresas Feitas para Vencer - Jim Collins",
    required: true,
    points: 40,
    description:
      "Análise de empresas de alto desempenho e suas características",
  },
  {
    id: "11",
    stepId: "v1",
    type: "book",
    title: "Customer Success - Dan Steinman",
    required: false,
    points: 40,
    description: "Estratégias para maximizar o sucesso do cliente",
  },

  // V2 - Purple Belt Items
  {
    id: "12",
    stepId: "v2",
    type: "cert",
    title: "PROFESSIONAL 400-101",
    url: "https://example.com/cert1",
    required: true,
    points: 80,
    description: "Certificação profissional avançada em marketing digital",
  },
  {
    id: "13",
    stepId: "v2",
    type: "course",
    title: "G4 - Fundamentos em Gestão por OKRs",
    url: "https://example.com/course7",
    required: true,
    points: 45,
    description: "Metodologia OKRs para gestão de objetivos e resultados",
  },
  {
    id: "14",
    stepId: "v2",
    type: "course",
    title: "MVP & Go to Market",
    url: "https://example.com/course8",
    required: false,
    points: 40,
    description: "Estratégias de lançamento de produtos e validação de mercado",
  },
  {
    id: "15",
    stepId: "v2",
    type: "book",
    title: "Gestão de Alta Performance",
    required: true,
    points: 45,
    description: "Técnicas avançadas de gestão e liderança de equipes",
  },
  {
    id: "16",
    stepId: "v2",
    type: "book",
    title: "A Lógica do Consumo - Martin Lindstrom",
    required: false,
    points: 40,
    description: "Psicologia do consumidor e comportamento de compra",
  },
];

export const mockBadges: Badge[] = [
  {
    id: "1",
    code: "STREAK_7",
    name: "Streak Master",
    icon: "🔥",
    description: "Manteve streak de 7 dias",
    rule: "streak >= 7",
  },
  {
    id: "2",
    code: "CERT_MASTER",
    name: "Cert Master",
    icon: "🏆",
    description: "Completou 5 certificações",
    rule: "certifications >= 5",
  },
];

export const mockPositions = [
  {
    id: "1",
    name: "Analista de Marketing Digital",
    description:
      "Responsável por campanhas de marketing digital e análise de performance",
    department: "Marketing",
    level: "junior" as const,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Especialista em Growth",
    description: "Foco em estratégias de crescimento e otimização de funis",
    department: "Marketing",
    level: "pleno" as const,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Gerente de Marketing",
    description: "Liderança de equipe e estratégia de marketing",
    department: "Marketing",
    level: "senior" as const,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Customer Success Analyst",
    description: "Gestão de relacionamento e sucesso do cliente",
    department: "Customer Success",
    level: "junior" as const,
    createdAt: new Date("2024-01-01"),
  },
];

export const mockTrailTemplates = [
  {
    id: "1",
    positionId: "1",
    name: "Trilha Analista Marketing Digital",
    description: "Desenvolvimento completo para analistas de marketing digital",
    steps: mockSteps,
    items: mockItems,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    positionId: "2",
    name: "Trilha Growth Specialist",
    description: "Especialização em growth hacking e otimização",
    steps: mockSteps,
    items: mockItems.filter((item) => item.stepId !== "v0"), // Advanced trail
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const mockMentoringSessions: MentoringSession[] = [
  {
    id: "1",
    mentorName: "Antônio Derick",
    mentorAvatar: "/mentor-antonio.jpg",
    date: "15 Outubro 2025",
    day: "Quarta-feira",
    time: "09:00 - 09:30",
    duration: "30 minutos",
    status: "scheduled" as const,
  },
  {
    id: "2",
    mentorName: "Nathalia Fernandes",
    mentorAvatar: "/mentor-nathalia.jpg",
    date: "14 Outubro 2025",
    day: "Terça-feira",
    time: "16:30 - 17:00",
    duration: "30 minutos",
    status: "scheduled" as const,
  },
  {
    id: "3",
    mentorName: "Brenno Vieira",
    mentorAvatar: "/mentor-brenno.jpg",
    date: "14 Outubro 2025",
    day: "Terça-feira",
    time: "15:00 - 15:30",
    duration: "30 minutos",
    status: "scheduled" as const,
  },
  {
    id: "4",
    mentorName: "Daniel Vrena",
    mentorAvatar: "/mentor-daniel.jpg",
    date: "14 Outubro 2025",
    day: "Terça-feira",
    time: "15:00 - 15:30",
    duration: "30 minutos",
    status: "scheduled" as const,
  },
  {
    id: "5",
    mentorName: "Marcus Vinícius Galissi Massaki",
    mentorAvatar: "/mentor-marcus.jpg",
    date: "14 Outubro 2025",
    day: "Terça-feira",
    time: "14:00 - 14:30",
    duration: "30 minutos",
    status: "scheduled" as const,
  },
];

export const mockPraisePosts: PraisePost[] = [
  {
    id: "1",
    authorName: "Lucas Henrique Silva Flores",
    authorAvatar: "/user-lucas.jpg",
    targetName: "Maria Luiza de Oliveira Iacono",
    message: "Malu, muito obrigado por tudo que você fe...",
    timeAgo: "8 horas",
    reactions: 1,
    hasReacted: false,
  },
  {
    id: "2",
    authorName: "Yuri Vicente",
    authorAvatar: "/user-yuri.jpg",
    targetName: "Jonata Amaral",
    message: "Passando para deixar meu agradecimento ...",
    timeAgo: "8 horas",
    reactions: 1,
    hasReacted: false,
  },
  {
    id: "3",
    authorName: "Bárbara Gabriela Heydt",
    authorAvatar: "/user-barbara.jpg",
    targetName: "Jonata Amaral",
    message: "Quero te agradecer por compartilhar comi...",
    timeAgo: "8 horas",
    reactions: 1,
    hasReacted: false,
  },
];

export const currentUser: User = mockUsers[3]; // João Admin - full admin access
