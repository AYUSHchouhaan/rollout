import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "@/db/queries";
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

      await createUser({
        email: user.email,
        name: user.name,
        image: user.image || "",
        uuid: uuid4(),
      });

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
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).messagecount = token.messagecount;
        (session.user as any).uuid = token.uuid;
      }
      if (session.user?.email) {
        const dbUser = await getUser(session.user.email);
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).messagecount = dbUser.messagecount;
          (session.user as any).uuid = dbUser.uuid;
        }
      }
      return session;
    },
  },
});
