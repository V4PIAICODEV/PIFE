import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

// Dados de exemplo
const firstNames = [
  "João",
  "Maria",
  "Pedro",
  "Ana",
  "Carlos",
  "Julia",
  "Fernando",
  "Beatriz",
  "Lucas",
  "Camila",
];

const lastNames = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Costa",
  "Pereira",
  "Rodrigues",
  "Almeida",
];

const pifeDescriptions = {
  Profissional: [
    "Apresentei proposta comercial para novo cliente e fechamos o contrato!",
    "Concluí treinamento de liderança com certificação.",
    "Implementei novo processo que aumentou a produtividade em 30%.",
    "Liderei reunião estratégica com stakeholders do projeto.",
  ],
  Intelectual: [
    "Finalizei mais 3 capítulos do livro 'Marketing Digital Estratégico'.",
    "Completei curso online sobre Data Science.",
    "Li artigo científico sobre neurociência aplicada aos negócios.",
    "Estudei 2 horas sobre Python e Machine Learning.",
  ],
  Físico: [
    "Treino de 45 minutos na academia - cardio e musculação.",
    "Corrida matinal de 5km no parque.",
    "Aula de yoga - alongamento e relaxamento.",
    "Treino funcional de alta intensidade (HIIT).",
  ],
  Emocional: [
    "Sessão de meditação de 30 minutos pela manhã.",
    "Praticei gratidão - anotei 5 coisas pelas quais sou grato.",
    "Tempo de qualidade com a família - jantar especial.",
    "Terapia semanal - trabalhando autoconhecimento.",
  ],
};

const roiMessages = [
  "Parabéns pela entrega impecável do projeto! Seu trabalho inspirou toda a equipe! 🚀",
  "Que apresentação incrível! Você elevou o nível da nossa reunião! 👏",
  "Seu comprometimento com a qualidade é admirável! Continue assim! ⭐",
  "Obrigado por sempre ajudar os colegas! Você faz a diferença! 🤝",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  return new Date(
    now.getTime() -
      randomDays * 24 * 60 * 60 * 1000 -
      randomHours * 60 * 60 * 1000
  );
}

async function main() {
  console.log("🌱 Adicionando mais dados SEM deletar os existentes...");

  // Buscar usuários existentes
  const users = await prisma.usuario.findMany();

  console.log(`✅ Encontrados ${users.length} usuários!`);

  // Criar mais 20 check-ins PIFE
  console.log("📝 Criando mais check-ins PIFE...");
  const pifeTypes: Array<
    "Profissional" | "Intelectual" | "Físico" | "Emocional"
  > = ["Profissional", "Intelectual", "Físico", "Emocional"];

  for (let i = 0; i < 20; i++) {
    const user = getRandomElement(users);
    const pifeType = getRandomElement(pifeTypes);
    const description = getRandomElement(pifeDescriptions[pifeType]);

    await prisma.checkinPife.create({
      data: {
        userId: user.id,
        pife: pifeType,
        description,
        createdAt: getRandomDate(5), // Últimos 5 dias
      },
    });
  }

  console.log("✅ 20 check-ins PIFE adicionados!");

  // Criar mais 10 ROI
  console.log("🚀 Criando mais posts Acelerar ROI...");

  for (let i = 0; i < 10; i++) {
    const autor = getRandomElement(users);
    let destinatario = getRandomElement(users);

    while (destinatario.id === autor.id) {
      destinatario = getRandomElement(users);
    }

    await prisma.acelerarOi.create({
      data: {
        autorId: autor.id,
        destinatarioId: destinatario.id,
        message: getRandomElement(roiMessages),
        createdAt: getRandomDate(5),
      },
    });
  }

  console.log("✅ 10 posts Acelerar ROI adicionados!");

  const totalCheckins = await prisma.checkinPife.count();
  const totalRois = await prisma.acelerarOi.count();

  console.log("\n🎉 Dados adicionados com sucesso!");
  console.log(`📊 Total agora: ${totalCheckins} check-ins + ${totalRois} ROIs`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

