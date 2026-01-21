import { Roles } from "./roles";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Roles;
        email?: string;
      };
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
