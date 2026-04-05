declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
    }

    interface Request {
      user: User;
    }
  }
}

declare module "better-auth" {
  interface BetterAuthToken {
    // No role stored in token
  }
}

declare module "better-auth" {
  interface BetterAuthSession {
    user: {
      id: string;
      email: string;
      // No role in session
    };
  }
}

export {};
