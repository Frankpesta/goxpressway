import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { logAudit } from "./lib/audit";

export const getTimelineEvents = query({
  args: { shipmentId: v.id("shipments") },
  handler: async (ctx, { shipmentId }) => {
    const events = await ctx.db
      .query("timelineEvents")
      .withIndex("by_shipment_sequence", (q) => q.eq("shipmentId", shipmentId))
      .collect();
    return events.sort((a, b) => a.sequence - b.sequence);
  },
});

export const createTimelineEvent = mutation({
  args: {
    shipmentId: v.id("shipments"),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.string(),
    status: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");

    const id = await ctx.db.insert("timelineEvents", args);

    await logAudit(ctx, "timeline.event_created", adminId, {
      shipmentId: args.shipmentId,
      newValue: { title: args.title, status: args.status },
    });

    return id;
  },
});

export const updateTimelineEvent = mutation({
  args: {
    id: v.id("timelineEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.optional(v.string()),
    status: v.optional(v.string()),
    sequence: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");

    const event = await ctx.db.get(id);
    if (!event) throw new Error("Timeline event not found");

    const updates = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, updates);

    await logAudit(ctx, "timeline.event_updated", adminId, {
      shipmentId: event.shipmentId,
      previousValue: event,
      newValue: updates,
    });
  },
});

export const deleteTimelineEvent = mutation({
  args: { id: v.id("timelineEvents") },
  handler: async (ctx, { id }) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");

    const event = await ctx.db.get(id);
    if (!event) throw new Error("Timeline event not found");

    await ctx.db.delete(id);

    await logAudit(ctx, "timeline.event_deleted", adminId, {
      shipmentId: event.shipmentId,
      previousValue: { title: event.title },
    });
  },
});

/** Replaces all timeline events for a shipment (used in wizard edit) */
export const replaceTimelineEvents = mutation({
  args: {
    shipmentId: v.id("shipments"),
    events: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        location: v.optional(v.string()),
        eventDate: v.string(),
        status: v.string(),
        sequence: v.number(),
      })
    ),
  },
  handler: async (ctx, { shipmentId, events }) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("timelineEvents")
      .withIndex("by_shipment", (q) => q.eq("shipmentId", shipmentId))
      .collect();

    for (const ev of existing) await ctx.db.delete(ev._id);
    for (const ev of events) await ctx.db.insert("timelineEvents", { ...ev, shipmentId });

    await logAudit(ctx, "timeline.replaced", adminId, { shipmentId });
  },
});
