import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    role?: string;
    id?: string;
  }
}
