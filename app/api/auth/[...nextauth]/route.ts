// No topo do arquivo, use bcryptjs em vez de bcrypt
import bcrypt from "bcryptjs"; 

// Dentro do CredentialsProvider
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await prisma.usuario.findUnique({
    where: { email: credentials.email }
  });

  // Se não achar o usuário ou a senha estiver vazia no banco
  if (!user || !user.password) return null;

  // COMPARAÇÃO CRÍTICA
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    level: user.level,
  };
}
