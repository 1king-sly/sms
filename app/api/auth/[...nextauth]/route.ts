import { PrismaAdapter } from '@next-auth/prisma-adapter';import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        let user;
        
        switch (credentials.role) {
          case "SUPER_ADMIN":
            user = await db.superAdmin.findUnique({
              where: { email: credentials.email },
            });
            break;
          case "SCHOOL_ADMIN":
            user = await db.schoolAdmin.findUnique({
              where: { email: credentials.email },
            });
            break;
          case "DEPARTMENT_ADMIN":
            user = await db.departmentAdmin.findUnique({
              where: { email: credentials.email },
            });
            break;
          case "TEACHER":
            user = await db.teacher.findUnique({
              where: { email: credentials.email },
            });
            break;
          case "STUDENT":
            user = await db.student.findUnique({
              where: { email: credentials.email },
            });
            break;
          default:
            return null;
        }

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: credentials.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          // role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };