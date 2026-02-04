import { Request, Response } from "express";
import * as storeService from "./store.service";

export async function createStore(req: Request, res: Response) {
  const userId = req.user.id;

  const store = await storeService.createStore(userId, req.body);
  res.status(201).json(store);
}

export async function getOwnStore(req: Request, res: Response) {
  const userId = req.user.id;

  const store = await storeService.getOwnStore(userId);
  res.json(store);
}

export async function updateOwnStore(req: Request, res: Response) {
  const userId = req.user.id;

  const store = await storeService.updateOwnStore(userId, req.body);
  res.json(store);
}

export async function deleteOwnStore(req: Request, res: Response) {
  const userId = req.user.id;

  await storeService.softDeleteStore(userId);
  res.status(204).send();
}

// PUBLIC
export async function getPublicStore(req: Request, res: Response) {
 const username = req.params.username as string;

  const store = await storeService.getPublicStoreByUsername(username);
  res.json(store);
}

// ADMIN
export async function adminListStores(req: Request, res: Response) {
  const stores = await storeService.adminListStores();
  res.json(stores);
}

export async function adminGetStoreById(req: Request<{ id: string }>,
  res: Response) {
  const { id } = req.params;

  const store = await storeService.adminGetStoreById(id);
  res.json(store);
}

export async function adminRestoreStore(req: Request<{ id: string }>,
  res: Response) {
  const { id } = req.params;

  const store = await storeService.adminRestoreStore(id);
  res.json(store);
}
