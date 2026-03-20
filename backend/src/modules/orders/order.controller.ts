import { orderService } from "./order.service";

export const orderController = {
  create: async (req: any, res: any) => {
    const result = await orderService.createOrder(req.body);

    res.status(201).json({
      success: true,
      data: result,
      error: null,
    });
  },

  list: async (req: any, res: any) => {
    const orders = await orderService.listOrdersForCreator(
      req.user.id
    );

    res.json({ success: true, data: orders, error: null });
  },

  listForBuyer: async (req: any, res: any) => {
    const orders = await orderService.listOrdersForBuyer(
      req.user.id
    );

    res.json({ success: true, data: orders, error: null });
  },

  listAll: async (_req: any, res: any) => {
    const orders = await orderService.listAllOrders();
    res.json({ success: true, data: orders, error: null });
  },

  updateStatusCreator: async (req: any, res: any) => {
    await orderService.updateStatusCreator(
      req.params.id,
      req.body.status,
      req.user.id
    );

    res.json({ success: true, data: null, error: null });
  },

  updateStatusAdmin: async (req: any, res: any) => {
    await orderService.updateStatusAdmin(
      req.params.id,
      req.body.status
    );

    res.json({ success: true, data: null, error: null });
  },

  markRefund: async (req: any, res: any) => {
    await orderService.markRefund(
      req.params.id,
      req.body.refundAmount,
      req.user.id
    );

    res.json({ success: true, data: null, error: null });
  },

  softDelete: async (req: any, res: any) => {
    await orderService.softDeleteOrder(req.params.id);

    res.json({ success: true, data: null, error: null });
  },
};