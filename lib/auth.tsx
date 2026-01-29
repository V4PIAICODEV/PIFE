import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Primeiro tenta encontrar um usuário normal
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (user) {
            const passwordMatch = credentials.password === user.password;

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
          return null;
        }
      },
    }),
  ],
  jwt: {
   secret: "minhasenha_super_secreta_123",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.squad = user.squad;
        token.level = user.level;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user && typeof token.user === "object") {
        const userToken = token.user as any;
        session.user = {
          id: userToken.id || null,
          name: userToken.name || null,
          email: userToken.email || null,
          squad: userToken.squad || null,
          level: userToken.level || null,
          image: userToken.image || null,
        };
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
