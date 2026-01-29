import NextAuth from "next-auth";
import nextAuthOptions from "@/lib/auth";

// A declaração precisa ser exatamente assim para o Next.js 14+
const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
