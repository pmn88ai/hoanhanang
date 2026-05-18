import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "operator" | "shadow_admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "operator" | "shadow_admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: "operator" | "shadow_admin";
    id: string;
  }
}
