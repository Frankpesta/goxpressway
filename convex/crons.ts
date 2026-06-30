import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Auto-archive delivered shipments older than 90 days — runs daily at 02:00 UTC
crons.daily(
  "auto-archive-delivered-shipments",
  { hourUTC: 2, minuteUTC: 0 },
  internal.shipments.autoArchiveDelivered
);

export default crons;
