import { jobDb } from "./job.db";
import { emailService } from "../email/email.service";
import { payoutDb } from "../payout/payout.db";
import { eq } from "drizzle-orm";

let jobRunnerInterval: NodeJS.Timeout | null = null;
let isRunning = false;
const MAX_ATTEMPTS = 3;
const JOB_POLL_INTERVAL = 30000; // 30 seconds

/**
 * Start the background job runner
 * Runs every 30 seconds to process pending jobs
 */
export async function startJobRunner() {
  if (jobRunnerInterval) {
    console.log("Job runner already started");
    return;
  }

  console.log("🚀 Starting job runner...");

  jobRunnerInterval = setInterval(async () => {
    try {
      await processJobs();
    } catch (error) {
      console.error("Job runner error:", error);
    }
  }, JOB_POLL_INTERVAL);

  // Run immediately on startup
  await processJobs();
}

/**
 * Stop the job runner
 */
export function stopJobRunner() {
  if (jobRunnerInterval) {
    clearInterval(jobRunnerInterval);
    jobRunnerInterval = null;
    console.log("Job runner stopped");
  }
}

/**
 * Main job processing loop
 */
async function processJobs() {
  if (isRunning) return; // Prevent concurrent runs
  isRunning = true;

  try {
    const now = new Date();
    const allJobs = await jobDb.listByStatus("PENDING");

    // Filter jobs that are due (runAt <= now)
    const dueJobs = allJobs.filter((job) => new Date(job.runAt) <= now);

    if (dueJobs.length === 0) {
      // Silently skip if no jobs due
      return;
    }

    console.log(`⏱️  Processing ${dueJobs.length} due job(s)`);

    for (const job of dueJobs) {
      try {
        await processJob(job);
      } catch (error) {
        console.error(`Failed to process job ${job.id}:`, error);
      }
    }
  } finally {
    isRunning = false;
  }
}

/**
 * Process a single job
 */
async function processJob(job: any) {
  try {
    // Mark as processing
    await jobDb.updateStatus(job.id, "PROCESSING");

    let success = false;

    if (job.type === "EMAIL") {
      success = await handleEmailJob(job);
    } else if (job.type === "PAYOUT_ELIGIBILITY") {
      success = await handlePayoutEligibilityJob(job);
    } else {
      throw new Error(`Unknown job type: ${job.type}`);
    }

    if (success) {
      await jobDb.updateStatus(job.id, "COMPLETED");
      console.log(`✅ Job ${job.id} completed`);
    }
  } catch (error: any) {
    const attempts = (job.attempts ?? 0) + 1;
    const errorMessage = error.message || String(error);

    await jobDb.incrementAttempts(job.id);

    if (attempts >= MAX_ATTEMPTS) {
      // Mark as failed after max attempts
      await jobDb.updateStatus(job.id, "FAILED", errorMessage);
      console.error(
        `❌ Job ${job.id} failed after ${MAX_ATTEMPTS} attempts: ${errorMessage}`
      );
    } else {
      // Reset to pending but don't process yet
      // The next iteration will pick it up again
      console.warn(
        `⚠️  Job ${job.id} failed (attempt ${attempts}/${MAX_ATTEMPTS}): ${errorMessage}`
      );
      // Update back to pending so it can be retried
      await jobDb.updateStatus(job.id, "PENDING", errorMessage);
    }
  }
}

/**
 * Handle EMAIL job type
 */
async function handleEmailJob(job: any): Promise<boolean> {
  const { to, template, data } = job.payload;

  if (!to || !template) {
    throw new Error("Invalid email job payload: missing to or template");
  }

  await emailService.send({
    to,
    template,
    data,
  });

  return true;
}

/**
 * Handle PAYOUT_ELIGIBILITY job type
 * Processes payout eligibility transitions from LOCKED -> ELIGIBLE
 */
async function handlePayoutEligibilityJob(job: any): Promise<boolean> {
  const { payoutId } = job.payload;

  if (!payoutId) {
    throw new Error("Invalid payout eligibility job: missing payoutId");
  }

  const payout = await payoutDb.findById(payoutId);

  if (!payout) {
    throw new Error(`Payout ${payoutId} not found`);
  }

  // Only process if still LOCKED
  if (payout.status !== "LOCKED") {
    console.log(`Payout ${payoutId} already in ${payout.status} status`);
    return true; // Consider it successful since it's already processed
  }

  const now = new Date();
  const eligibleAt = new Date(payout.eligibleAt);

  if (now >= eligibleAt) {
    // Update status to ELIGIBLE
    await payoutDb.update(payoutId, { status: "ELIGIBLE" });

    // Notification should happen in dedicated workflow (e.g., order email events)
    console.log(`Payout ${payoutId} is now eligible for release`);
    return true;
  } else {
    throw new Error(
      `Payout ${payoutId} not eligible until ${eligibleAt.toISOString()}`
    );
  }
}
