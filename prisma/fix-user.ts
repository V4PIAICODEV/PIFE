import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = "wagnergomes@v4company.com"
  const password = "123456" 
  const hashedPassword = await hash(password, 10)

  console.log(`🔨 Corrigindo acesso para: ${email}`)

  await prisma.usuario.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      level: "ADMIN",
      squadId: null // Limpa o squad para evitar erros de relação
    },
    create: {
      name: "Wagner Gomes Junior",
      email,
      password: hashedPassword,
      level: "ADMIN",
      role: "Diretor",
      squadId: null
    }
  })

  console.log("✅ USUÁRIO ATUALIZADO COM SUCESSO!")
  console.log("👉 Tente logar com:")
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Senha: ${password}`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })