import { PrismaAdapter } from '@next-auth/prisma-adapter';import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { compare } from "bcryptjs";
import NextAuth from "next-auth/next";

type User = {
  id: string;
  name: string;
  hashedPassword: string;
  email: string;
  createdAt: Date;
  updatedAt:Date;
  schoolId:string,

};

type SessionStrategyType = 'jwt';

export const authOptions: NextAuthOptions = {

    
  adapter: PrismaAdapter(prisma),
 
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
      async authorize(credentials: Record<'email' | 'password'|'role', string> | undefined): Promise<User | null>  {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        let user;
        
        switch (credentials.role) {
          case "SUPER_ADMIN":
            user = await prisma.superAdmin.findUnique({
              where: { email: credentials.email },
             
            });
            break;
          case "SCHOOL_ADMIN":
            user = await prisma.schoolAdmin.findUnique({
              where: { email: credentials.email },
            
            });
            break;
          case "DEPARTMENT_ADMIN":
            user = await prisma.departmentAdmin.findUnique({
              where: { email: credentials.email },
            
            });
            break;
          case "TEACHER":
            user = await prisma.teacher.findUnique({
              where: { email: credentials.email },
            
           
            });
            break;
          case "STUDENT":
            user = await prisma.student.findUnique({
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
          schoolId: user.schoolId,
          hashedPassword:user.password,
          createdAt:user.createdAt,
          updatedAt:user.updatedAt

        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email:user.email,
          name:user.name,
          schoolId: user.schoolId,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        email: token.email,
        name: token.name,
        schoolId: token.schoolId,
      };
    },
  
  },
  
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt' as SessionStrategyType,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth;