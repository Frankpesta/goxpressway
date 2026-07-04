"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import { StatusEmail } from "./email_templates/status_email";
import { ContactEmail } from "./email_templates/contact_email";
import { trackingUrl } from "./lib/tracking";

// ─── Template helpers — kept for unit tests ───────────────────────────────────

export interface StatusEmailContent {
  subject: string;
  heading: string;
  bodyHtml: string;
}

/** Pure function — safe to unit-test without Resend or react-email. */
export function getStatusEmailContent(
  status: string,
  recipientName: string,
  trackingCode: string,
  opts: {
    estimatedDeliveryDate?: string;
    senderCity?: string;
    receiverCity?: string;
  } = {}
): StatusEmailContent {
  type Config = { subject: string; heading: string; detail: string; accent: string };

  const STATUS_CONFIG: Record<string, Config> = {
    Created: {
      subject: `Shipment Created — ${trackingCode}`,
      heading: "Your shipment has been created",
      detail: "We've registered your shipment. Use your tracking number at any time to see real-time status updates.",
      accent: "#475569",
    },
    "Pending Pickup": {
      subject: `Pending Pickup — ${trackingCode}`,
      heading: "Your shipment is pending pickup",
      detail: "A courier is scheduled to collect your package soon. We'll notify you as soon as it's been picked up.",
      accent: "#d97706",
    },
    "Picked Up": {
      subject: `Shipment Picked Up — ${trackingCode}`,
      heading: "Your shipment has been picked up",
      detail: "Your package is in our hands. We'll keep you posted as it moves through our network.",
      accent: "#2563eb",
    },
    "In Transit": {
      subject: `In Transit — ${trackingCode}`,
      heading: "Your shipment is on its way",
      detail: "Your package is actively moving through our logistics network toward its destination.",
      accent: "#4f46e5",
    },
    "Arrived At Facility": {
      subject: `Arrived at Facility — ${trackingCode}`,
      heading: "Your shipment has arrived at a facility",
      detail: "Your package is at one of our processing facilities and is being prepared for the next leg of its journey.",
      accent: "#7c3aed",
    },
    "At Facility": {
      subject: `Arrived at Facility — ${trackingCode}`,
      heading: "Your shipment has arrived at a facility",
      detail: "Your package is at one of our processing facilities and is being prepared for the next leg of its journey.",
      accent: "#7c3aed",
    },
    "Out For Delivery": {
      subject: `Out for Delivery — ${trackingCode}`,
      heading: "Your shipment is out for delivery today",
      detail: "Your package is with a delivery courier and on its way to the destination address. Expect delivery today!",
      accent: "#ea580c",
    },
    "Out for Delivery": {
      subject: `Out for Delivery — ${trackingCode}`,
      heading: "Your shipment is out for delivery today",
      detail: "Your package is with a delivery courier and on its way to the destination address. Expect delivery today!",
      accent: "#ea580c",
    },
    Delivered: {
      subject: `Delivered — ${trackingCode}`,
      heading: "Your shipment has been delivered",
      detail: "Your package was successfully delivered. Thank you for choosing GOxpress Way.",
      accent: "#16a34a",
    },
    "Failed Delivery": {
      subject: `Delivery Attempt Failed — ${trackingCode}`,
      heading: "Delivery was unsuccessful",
      detail: "We were unable to complete delivery. Our courier will try again or please contact us to arrange a suitable time.",
      accent: "#dc2626",
    },
    Failed: {
      subject: `Delivery Attempt Failed — ${trackingCode}`,
      heading: "Delivery was unsuccessful",
      detail: "We were unable to complete delivery. Our courier will try again or please contact us to arrange a suitable time.",
      accent: "#dc2626",
    },
    Returned: {
      subject: `Shipment Returned — ${trackingCode}`,
      heading: "Your shipment is being returned",
      detail: "Your package is on its way back to the sender. Contact us if you'd like to arrange re-delivery.",
      accent: "#be123c",
    },
    Cancelled: {
      subject: `Shipment Cancelled — ${trackingCode}`,
      heading: "Your shipment has been cancelled",
      detail: "This shipment has been cancelled. Contact support if you believe this is an error.",
      accent: "#9f1239",
    },
  };

  const cfg: Config = STATUS_CONFIG[status] ?? {
    subject: `Shipment Update — ${trackingCode}`,
    heading: `Status update: ${status}`,
    detail: "There has been an update to your shipment. Check the tracking page for the latest information.",
    accent: "#475569",
  };

  const routeLine =
    opts.senderCity && opts.receiverCity
      ? `<p style="margin:6px 0 0;font-size:13px;color:#64748b;">${opts.senderCity} &rarr; ${opts.receiverCity}</p>`
      : "";

  const deliveryLine = opts.estimatedDeliveryDate
    ? `<p style="margin:6px 0 0;font-size:13px;color:#64748b;">Estimated delivery: <strong style="color:#1e293b">${opts.estimatedDeliveryDate}</strong></p>`
    : "";

  const bodyHtml = `
<p style="margin:0;font-size:15px;color:#1e293b;">
  Dear <strong>${recipientName}</strong>,
</p>
<div style="margin:20px 0;padding:18px 20px;background:#f8fafc;border-left:4px solid ${cfg.accent};border-radius:0 8px 8px 0;">
  <h2 style="margin:0;font-size:17px;color:${cfg.accent};font-weight:700;">${cfg.heading}</h2>
  ${routeLine}
  ${deliveryLine}
</div>
<p style="margin:0;font-size:14px;color:#475569;line-height:1.75;">${cfg.detail}</p>
`.trim();

  return { subject: cfg.subject, heading: cfg.heading, bodyHtml };
}

// ─── Internal action ─────────────────────────────────────────────────────────

export const sendStatusEmail = internalAction({
  args: {
    trackingCode: v.string(),
    status: v.string(),
    senderName: v.string(),
    senderEmail: v.string(),
    receiverName: v.string(),
    receiverEmail: v.string(),
    senderCity: v.optional(v.string()),
    receiverCity: v.optional(v.string()),
    estimatedDeliveryDate: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[emails] RESEND_API_KEY not set — skipping notification");
      return;
    }

    const resend = new Resend(apiKey);
    const publicUrl = trackingUrl(args.trackingCode);
    const from = "GOxpress Way <noreply@notifications.goxpressway.com>";

    const { subject } = getStatusEmailContent(args.status, "", args.trackingCode);

    const sharedProps = {
      trackingCode: args.trackingCode,
      status: args.status,
      publicUrl,
      senderCity: args.senderCity,
      receiverCity: args.receiverCity,
      estimatedDeliveryDate: args.estimatedDeliveryDate,
    };

    const [senderHtml, receiverHtml] = await Promise.all([
      render(React.createElement(StatusEmail, { ...sharedProps, recipientName: args.senderName, isReceiver: false })),
      render(React.createElement(StatusEmail, { ...sharedProps, recipientName: args.receiverName, isReceiver: true })),
    ]);

    const [senderResult, receiverResult] = await Promise.allSettled([
      resend.emails.send({ from, to: [args.senderEmail], subject, html: senderHtml }),
      resend.emails.send({ from, to: [args.receiverEmail], subject, html: receiverHtml }),
    ]);

    if (senderResult.status === "rejected") {
      console.error("[emails] Failed to send sender email:", senderResult.reason);
    }
    if (receiverResult.status === "rejected") {
      console.error("[emails] Failed to send receiver email:", receiverResult.reason);
    }
  },
});

// ─── Public contact form action ──────────────────────────────────────────────

export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Email service not configured");

    const resend = new Resend(apiKey);

    const html = await render(
      React.createElement(ContactEmail, {
        name: args.name,
        email: args.email,
        subject: args.subject,
        message: args.message,
      })
    );

    await resend.emails.send({
      from: "GOxpress Way Website <noreply@notifications.goxpressway.com>",
      to: ["support@goxpressway.com"],
      replyTo: args.email,
      subject: `[Contact] ${args.subject}`,
      html,
    });
  },
});
