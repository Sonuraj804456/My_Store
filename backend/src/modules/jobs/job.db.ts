import {
  pgTable,
  uuid,
  jsonb,
  timestamp,
  pgEnum,
  integer,
  text,
  index,
} from "drizzle-orm/pg-core";
import { eq, and } from "drizzle-orm";
import { db } from "../../config/db";

export const jobTypeEnum = pgEnum("job_type", ["EMAIL", "PAYOUT_ELIGIBILITY"]);
export type JobType = "EMAIL" | "PAYOUT_ELIGIBILITY";

export const jobStatusEnum = pgEnum("job_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: jobTypeEnum("type").notNull(),
    payload: jsonb("payload").notNull(),
    status: jobStatusEnum("status").notNull().default("PENDING"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    runAt: timestamp("run_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    statusRunAtIdx: index("jobs_status_run_at").on(table.status, table.runAt),
  })
);

export const jobDb = {
  create: (data: any) => db.insert(jobs).values(data).returning(),

  findById: (id: string) => {
    return db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1)
      .then((result) => result[0] || null);
  },

  findPendingJobs: async () => {
    return db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "PENDING" as JobStatus))
      .limit(100);
  },

  findDueJobs: async () => {
    return db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "PENDING" as JobStatus))
      .orderBy((jobs: any) => jobs.runAt)
      .limit(100);
  },

  update: (id: string, data: any) =>
    db
      .update(jobs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning(),

  updateStatus: (id: string, status: JobStatus, lastError?: string) =>
    db
      .update(jobs)
      .set({
        status,
        lastError,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning(),

  incrementAttempts: async (id: string) => {
    // Get current attempts value
    const record = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!record.length) return [];

    const firstRecord = record[0];
    if (!firstRecord) return [];

    const newAttempts = (firstRecord.attempts || 0) + 1;

    return db
      .update(jobs)
      .set({
        attempts: newAttempts,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();
  },

  listAll: async () => {
    return db.select().from(jobs);
  },

  listByStatus: async (status: JobStatus) => {
    return db
      .select()
      .from(jobs)
      .where(eq(jobs.status, status));
  },

  deleteOldCompleted: (olderThanDays: number = 7) => {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    return db
      .delete(jobs)
      .where(and(eq(jobs.status, "COMPLETED")));
  },
};
