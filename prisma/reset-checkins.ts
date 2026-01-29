import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Removendo todos os dados de check-ins PIFE...");

  const deleteComments = await prisma.comment.deleteMany({});
  console.log(`💬 Comentários removidos: ${deleteComments.count}`);

  const deleteLikes = await prisma.like.deleteMany({});
  console.log(`❤️  Likes removidos: ${deleteLikes.count}`);

  const deleteCheckins = await prisma.checkinPife.deleteMany({});
  console.log(`📝 Check-ins removidos: ${deleteCheckins.count}`);

  console.log("✅ Reset concluído.");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o reset:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


