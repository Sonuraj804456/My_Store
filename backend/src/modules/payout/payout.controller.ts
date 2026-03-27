import { Request, Response } from "express";
import { payoutService } from "./payout.service";

export async function listPayouts(req: Request, res: Response) {
  const userId = req.user.id;
  const status = req.query.status as string | undefined;

  const payouts = await payoutService.getPayoutsForCreator(userId, { status });
  res.json(payouts);
}

export async function getSummary(req: Request, res: Response) {
  const userId = req.user.id;
  const summary = await payoutService.getPayoutSummaryForCreator(userId);
  res.json(summary);
}

export async function adminListPayouts(req: Request, res: Response) {
  const status = req.query.status as string | undefined;

  const payouts = await payoutService.listAll({ status });
  res.json(payouts);
}

export async function adminReleasePayout(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const updated = await payoutService.releasePayout(id);
  res.json(updated);
}

export async function adminCancelPayout(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const updated = await payoutService.cancelPayout(id);
  res.json(updated);
}

export async function adminFreezePayout(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const updated = await payoutService.freezePayout(id);
  res.json(updated);
}

export async function adminUnfreezePayout(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const updated = await payoutService.unfreezePayout(id);
  res.json(updated);
}
