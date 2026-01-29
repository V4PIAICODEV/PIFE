import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Define cutoff as start of today (server local time)
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);

  console.log("🗑️  Removendo dados de check-ins PIFE anteriores a:", cutoff.toISOString());

  // 1) Remover comentários de check-ins antigos
  const deleteComments = await prisma.comment.deleteMany({
    where: {
      checkinPife: {
        createdAt: { lt: cutoff },
      },
    },
  });
  console.log(`💬 Comentários removidos: ${deleteComments.count}`);

  // 2) Remover likes de check-ins antigos
  const deleteLikes = await prisma.like.deleteMany({
    where: {
      checkinPife: {
        createdAt: { lt: cutoff },
      },
    },
  });
  console.log(`❤️  Likes removidos: ${deleteLikes.count}`);

  // 3) Remover os próprios check-ins antigos
  const deleteCheckins = await prisma.checkinPife.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });
  console.log(`📝 Check-ins removidos: ${deleteCheckins.count}`);

  console.log("✅ Limpeza concluída com sucesso.");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a limpeza:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


