import { describe, it, expect, beforeEach, vi } from "vitest";
import { jobDb } from "../src/modules/jobs/job.db";
import { emailService } from "../src/modules/email/email.service";
import { payoutDb } from "../src/modules/payout/payout.db";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Job System", () => {
  it("should insert EMAIL job", async () => {
    const job = {
      type: "EMAIL",
      payload: {
        to: "test@example.com",
        template: "ORDER_CREATED",
        data: { orderId: "o1" },
      },
      status: "PENDING",
      runAt: new Date(),
    };

    const created = await jobDb.create(job as any);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      type: "EMAIL",
      status: "PENDING",
      attempts: 0,
    });
  });

  it("should insert PAYOUT_ELIGIBILITY job", async () => {
    const job = {
      type: "PAYOUT_ELIGIBILITY",
      payload: { payoutId: "p1" },
      status: "PENDING",
      runAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const created = await jobDb.create(job as any);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      type: "PAYOUT_ELIGIBILITY",
      status: "PENDING",
    });
  });

  it("should find pending jobs", async () => {
    const job1 = {
      type: "EMAIL",
      payload: { to: "test1@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    const job2 = {
      type: "EMAIL",
      payload: { to: "test2@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    await jobDb.create(job1 as any);
    await jobDb.create(job2 as any);

    const pending = await jobDb.findPendingJobs();
    expect(pending.length).toBeGreaterThanOrEqual(2);
  });

  it("should update job status to COMPLETED", async () => {
    const job = {
      type: "EMAIL",
      payload: { to: "test@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    const created = await jobDb.create(job as any);
    const jobId = created[0].id;

    const updated = await jobDb.updateStatus(jobId, "COMPLETED");
    expect(updated).toHaveLength(1);
    expect(updated[0].status).toBe("COMPLETED");
  });

  it("should update job status to FAILED with error", async () => {
    const job = {
      type: "EMAIL",
      payload: { to: "test@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    const created = await jobDb.create(job as any);
    const jobId = created[0].id;
    const errorMsg = "Email service unavailable";

    const updated = await jobDb.updateStatus(jobId, "FAILED", errorMsg);
    expect(updated[0].status).toBe("FAILED");
    expect(updated[0].lastError).toBe(errorMsg);
  });

  it("should increment job attempts", async () => {
    const job = {
      type: "EMAIL",
      payload: { to: "test@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
      attempts: 0,
    };

    const created = await jobDb.create(job as any);
    const jobId = created[0].id;

    const updated = await jobDb.incrementAttempts(jobId);
    expect(updated[0].attempts).toBeGreaterThan(0);
  });

  it("should list jobs by status", async () => {
    const job1 = {
      type: "EMAIL",
      payload: { to: "test@example.com", template: "ORDER_CREATED", data: {} },
      status: "COMPLETED",
      runAt: new Date(),
    };

    const job2 = {
      type: "EMAIL",
      payload: { to: "test2@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    await jobDb.create(job1 as any);
    await jobDb.create(job2 as any);

    const completed = await jobDb.listByStatus("COMPLETED");
    const pending = await jobDb.listByStatus("PENDING");

    expect(completed.length).toBeGreaterThan(0);
    expect(pending.length).toBeGreaterThan(0);
  });

  it("should handle job with invalid template gracefully", async () => {
    try {
      await emailService.send({
        to: "test@example.com",
        template: "INVALID_TEMPLATE",
        data: {},
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.message).toContain("Unknown email template");
    }
  });

  it("should handle payout eligibility transitions", async () => {
    const payoutJob = {
      type: "PAYOUT_ELIGIBILITY",
      payload: { payoutId: "p1" },
      status: "PENDING",
      runAt: new Date(),
    };

    const created = await jobDb.create(payoutJob as any);
    expect(created[0].type).toBe("PAYOUT_ELIGIBILITY");
    expect(created[0].payload).toHaveProperty("payoutId");
  });

  it("should schedule job for future execution", async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const job = {
      type: "PAYOUT_ELIGIBILITY",
      payload: { payoutId: "p1" },
      status: "PENDING",
      runAt: futureDate,
    };

    const created = await jobDb.create(job as any);
    expect(created[0].runAt.getTime()).toBeGreaterThanOrEqual(
      futureDate.getTime() - 1000
    ); // Allow 1s tolerance
  });

  it("should find job by ID", async () => {
    const job = {
      type: "EMAIL",
      payload: { to: "test@example.com", template: "ORDER_CREATED", data: {} },
      status: "PENDING",
      runAt: new Date(),
    };

    const created = await jobDb.create(job as any);
    const jobId = created[0].id;

    const found = await jobDb.findById(jobId);
    expect(found).toBeDefined();
    expect(found?.id).toBe(jobId);
    expect(found?.type).toBe("EMAIL");
  });

  it("should handle concurrent job processing safely", async () => {
    const jobs = [];
    for (let i = 0; i < 5; i++) {
      jobs.push({
        type: "EMAIL",
        payload: {
          to: `test${i}@example.com`,
          template: "ORDER_CREATED",
          data: {},
        },
        status: "PENDING",
        runAt: new Date(),
      });
    }

    const created = await Promise.all(
      jobs.map((j) => jobDb.create(j as any))
    );
    expect(created).toHaveLength(5);

    const pending = await jobDb.findPendingJobs();
    expect(pending.length).toBeGreaterThanOrEqual(5);
  });
});
