import { auth } from "./auth.core";
import { userService } from "./auth.service";
import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: name || email.split("@")[0],
        email,
        password,
      },
    });

    return res.json(response);
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return res.json(response);
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
}

export async function me(req: Request, res: Response) {
  return res.json((req as any).user);
}
