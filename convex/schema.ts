import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  shipments: defineTable({
    trackingCode: v.string(),
    qrCodeUrl: v.optional(v.string()),
    status: v.string(),
    shipmentType: v.string(),
    dispatchDate: v.optional(v.string()),
    estimatedDeliveryDate: v.optional(v.string()),
    shippingCost: v.number(),
    tax: v.number(),
    insurance: v.number(),
    totalCost: v.number(),
    weight: v.number(),
    length: v.number(),
    width: v.number(),
    height: v.number(),
    // Sender (embedded object)
    senderFullName: v.string(),
    senderEmail: v.string(),
    senderPhone: v.string(),
    senderAddress: v.string(),
    senderCity: v.string(),
    senderState: v.string(),
    senderCountry: v.string(),
    senderPostalCode: v.string(),
    // Receiver (embedded object)
    receiverFullName: v.string(),
    receiverEmail: v.string(),
    receiverPhone: v.string(),
    receiverAddress: v.string(),
    receiverCity: v.string(),
    receiverState: v.string(),
    receiverCountry: v.string(),
    receiverPostalCode: v.string(),
    // Meta
    archived: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_tracking_code", ["trackingCode"])
    .index("by_status", ["status"])
    .index("by_archived", ["archived"])
    .index("by_created_at", ["createdAt"]),

  shipmentItems: defineTable({
    shipmentId: v.id("shipments"),
    itemName: v.string(),
    description: v.optional(v.string()),
    quantity: v.number(),
    weight: v.number(),
    declaredValue: v.number(),
  }).index("by_shipment", ["shipmentId"]),

  routeCheckpoints: defineTable({
    shipmentId: v.id("shipments"),
    cityName: v.string(),
    country: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    sequence: v.number(),
    arrivalStatus: v.optional(v.string()),
  })
    .index("by_shipment", ["shipmentId"])
    .index("by_shipment_sequence", ["shipmentId", "sequence"]),

  timelineEvents: defineTable({
    shipmentId: v.id("shipments"),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.string(),
    status: v.string(),
    sequence: v.number(),
  })
    .index("by_shipment", ["shipmentId"])
    .index("by_shipment_sequence", ["shipmentId", "sequence"]),

  auditLogs: defineTable({
    action: v.string(),
    adminId: v.id("users"),
    shipmentId: v.optional(v.id("shipments")),
    timestamp: v.string(),
    previousValue: v.optional(v.any()),
    newValue: v.optional(v.any()),
    details: v.optional(v.string()),
  })
    .index("by_shipment", ["shipmentId"])
    .index("by_admin", ["adminId"])
    .index("by_timestamp", ["timestamp"]),
});
