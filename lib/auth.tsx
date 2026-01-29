import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs"; // ADICIONADO: Importação correta do bcryptjs

declare module "next-auth" {
  interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    squad?: string | null;
    level?: string | null;
  }

  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      squad?: string | null;
      level?: string | null;
    };
  }
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: { email: credentials.email },
          });

          if (user && user.password) {
            // AJUSTE CRÍTICO: Compara a senha digitada com o Hash do banco usando bcryptjs
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);

            if (passwordMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                squad: user.squad,
                level: user.level,
                image: user.image,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  // IMPORTANTE: Use a variável de ambiente NEXTAUTH_SECRET que configuramos na Vercel
  secret: process.env.NEXTAUTH_SECRET, 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.squad = user.squad;
        token.level = user.level;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.squad = token.squad as string;
        session.user.level = token.level as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

export default nextAuthOptions;
