import { type Role } from "./roles";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
      email?: string;
    }

    interface Request {
      user: User;
    }
  }
}

declare module "better-auth" {
  interface BetterAuthToken {
    role: string;
  }
}

declare module "better-auth" {
  interface BetterAuthSession {
    user: {
      role: string;
    };
  }
}

export {};
