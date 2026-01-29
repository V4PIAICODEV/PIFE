import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const squadsOficiais = [
  "Financeiro",
  "P&P",
  "Assemble",
  "Growth Lab",
  "Growthx",
  "Roi Eagles",
  "Sharks",
  "Stark",
  "V4X",
  "Monetização",
  "Sales Ops",
  "Tremborage"
];

async function main() {
  console.log("🚀 Iniciando Seed de Emergência...");

  // 1. Criar Squads
  for (const nome of squadsOficiais) {
    const squad = await prisma.squad.upsert({
      where: { id: nome }, // Truque: tenta achar, se não achar, cria
      update: {},
      create: { name: nome },
    }).catch(async () => {
      // Fallback se o ID não for o nome (caso o schema use CUID/UUID)
      return await prisma.squad.create({ data: { name: nome } })
    });
    console.log(`✅ Squad garantido: ${nome}`);
  }

  // 2. Criar Admin (se não existir)
  const emailAdmin = "admin@v4.com";
  const existe = await prisma.usuario.findUnique({ where: { email: emailAdmin }});

  if (!existe) {
    const passwordHash = await hash("123456", 10);
    await prisma.usuario.create({
      data: {
        name: "Admin Geral",
        email: emailAdmin,
        password: passwordHash,
        level: "ADMIN",
        role: "Diretor",
        department: "Diretoria",
        squadId: null 
      }
    });
    console.log("👤 Admin criado: admin@v4.com / 123456");
  }

  console.log("🏁 PRONTO! Pode testar.");
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })