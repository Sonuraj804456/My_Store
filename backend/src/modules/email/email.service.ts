// Email abstraction layer - currently uses console logging
// Can be replaced with real email provider (SendGrid, etc.)

export interface EmailPayload {
  to: string;
  template: string;
  data: Record<string, any>;
}

const emailTemplates: Record<string, (data: any) => { subject: string; body: string }> = {
  ORDER_CREATED: (data) => ({
    subject: "Order Confirmed",
    body: `
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order #${data.orderId}</p>
      <p>Total: $${data.totalAmount}</p>
      <p>Status: ${data.status}</p>
    `,
  }),

  ORDER_STATUS_UPDATED: (data) => ({
    subject: `Order Status Updated: ${data.status}`,
    body: `
      <h1>Order Status Updated</h1>
      <p>Your order #${data.orderId} is now <strong>${data.status}</strong></p>
      <p>Timestamp: ${new Date(data.updatedAt).toLocaleString()}</p>
    `,
  }),

  DISPUTE_ESCALATED: (data) => ({
    subject: "Dispute Escalated",
    body: `
      <h1>Dispute Escalated</h1>
      <p>Admin notification: Dispute on order #${data.orderId} has been escalated.</p>
      <p>Reason: ${data.reason}</p>
    `,
  }),

  PAYOUT_RELEASED: (data) => ({
    subject: "Payout Released",
    body: `
      <h1>Payout Released!</h1>
      <p>Your payout of $${data.netAmount} has been released.</p>
      <p>Gross: $${data.grossAmount}</p>
      <p>Commission: $${data.commissionAmount}</p>
    `,
  }),
};

export const emailService = {
  /**
   * Send email - abstracted function that logs to console for now
   * In production, replace with real email provider
   */
  async send(payload: EmailPayload): Promise<void> {
    const template = emailTemplates[payload.template];
    if (!template) {
      throw new Error(`Unknown email template: ${payload.template}`);
    }

    const { subject, body } = template(payload.data);

    // Log to console instead of sending real emails
    console.log(`📧 EMAIL SENT:`);
    console.log(`  To: ${payload.to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Template: ${payload.template}`);
    console.log(`  Data:`, JSON.stringify(payload.data, null, 2));
    console.log(`  Body: ${body}`);
  },
};
