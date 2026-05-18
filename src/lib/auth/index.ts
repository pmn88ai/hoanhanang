import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "../../../database/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) return null;

        // --- Shadow admin check (env-only, không query DB) ---
        const shadowUsername = process.env.SHADOW_ADMIN_USERNAME;
        const shadowPassword = process.env.SHADOW_ADMIN_PASSWORD;

        if (
          shadowUsername &&
          shadowPassword &&
          username === shadowUsername &&
          password === shadowPassword
        ) {
          return {
            id: "shadow_admin",
            name: "Shadow Admin",
            email: "shadow@internal",
            role: "shadow_admin" as const,
          };
        }

        // --- Operator check (từ DB) ---
        const user = await db.query.users.findFirst({
          where: eq(users.email, username),
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id!;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role as "operator" | "shadow_admin";
      session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: "/dang-nhap",
    error: "/dang-nhap",
  },

  session: { strategy: "jwt" },
});
