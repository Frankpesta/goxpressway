import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Auto-archive shipments held at the airport for 90+ days — runs daily at 02:00 UTC
crons.daily(
  "auto-archive-held-at-airport-shipments",
  { hourUTC: 2, minuteUTC: 0 },
  internal.shipments.autoArchiveHeldAtAirport
);

export default crons;
