// auth.ts — Next Auth v5 with JWT sessions + MongoDB user lookup
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) return null;

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return null;

        if (!user.password) return null; // OAuth user trying to login with password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email?.toLowerCase().trim() });
        
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email?.toLowerCase().trim(),
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email?.toLowerCase().trim() });
          token.id = dbUser?._id.toString() as string;
        } else {
          token.id = user.id;
        }
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id    = token.id as string;
        session.user.name  = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
