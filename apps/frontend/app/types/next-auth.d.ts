import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    accessToken?: string;
  }
}

// Export the extended session type for use in components
export interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
  } & DefaultSession["user"];
  accessToken?: string;
}
