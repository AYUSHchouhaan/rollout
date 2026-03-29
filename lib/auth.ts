import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser } from "@/db/queries";
import uuid4 from "uuid4";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.name) return false;

      const dbUser = await createUser({
        email: user.email,
        name: user.name,
        image: user.image || "",
        uuid: uuid4(),
      });

      // Attach DB fields to user so jwt callback can pick them up
      (user as any).id = dbUser.id;
      (user as any).messagecount = dbUser.messagecount;
      (user as any).uuid = dbUser.uuid;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.messagecount = (user as any).messagecount;
        token.uuid = (user as any).uuid;
      }
      return token;
    },
    async session({ session, token }: any) {
      // No DB call — just read from token (runs on every request)
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).messagecount = token.messagecount;
        (session.user as any).uuid = token.uuid;
      }
      return session;
    },
  },
});
