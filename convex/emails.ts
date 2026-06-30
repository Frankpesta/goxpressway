"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { trackingUrl } from "./lib/tracking";

// ─── Template helpers ────────────────────────────────────────────────────────

const NAVY = "#1a3461";
const BLUE = "#2563eb";

export interface StatusEmailContent {
  subject: string;
  heading: string;
  bodyHtml: string;
}

/** Pure function — safe to unit-test without Resend. */
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
      detail:
        "We've registered your shipment. Use your tracking number at any time to see real-time status updates.",
      accent: "#475569",
    },
    "Pending Pickup": {
      subject: `Pending Pickup — ${trackingCode}`,
      heading: "Your shipment is pending pickup",
      detail:
        "A courier is scheduled to collect your package soon. We'll notify you as soon as it's been picked up.",
      accent: "#d97706",
    },
    "Picked Up": {
      subject: `Shipment Picked Up — ${trackingCode}`,
      heading: "Your shipment has been picked up",
      detail:
        "Your package is in our hands. We'll keep you posted as it moves through our network.",
      accent: BLUE,
    },
    "In Transit": {
      subject: `In Transit — ${trackingCode}`,
      heading: "Your shipment is on its way",
      detail:
        "Your package is actively moving through our logistics network toward its destination.",
      accent: "#4f46e5",
    },
    "At Facility": {
      subject: `Arrived at Facility — ${trackingCode}`,
      heading: "Your shipment has arrived at a facility",
      detail:
        "Your package is at one of our processing facilities and is being prepared for the next leg of its journey.",
      accent: "#7c3aed",
    },
    "Out for Delivery": {
      subject: `Out for Delivery — ${trackingCode}`,
      heading: "Your shipment is out for delivery today",
      detail:
        "Your package is with a delivery courier and on its way to the destination address. Expect delivery today!",
      accent: "#ea580c",
    },
    Delivered: {
      subject: `Delivered — ${trackingCode}`,
      heading: "Your shipment has been delivered",
      detail:
        "Your package was successfully delivered. Thank you for choosing GOxpress Way.",
      accent: "#16a34a",
    },
    Failed: {
      subject: `Delivery Attempt Failed — ${trackingCode}`,
      heading: "Delivery was unsuccessful",
      detail:
        "We were unable to complete delivery. Our courier will try again or please contact us to arrange a suitable time.",
      accent: "#dc2626",
    },
    Returned: {
      subject: `Shipment Returned — ${trackingCode}`,
      heading: "Your shipment is being returned",
      detail:
        "Your package is on its way back to the sender. Contact us if you'd like to arrange re-delivery.",
      accent: "#be123c",
    },
  };

  const cfg: Config = STATUS_CONFIG[status] ?? {
    subject: `Shipment Update — ${trackingCode}`,
    heading: `Status update: ${status}`,
    detail:
      "There has been an update to your shipment. Check the tracking page for the latest information.",
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

function buildEmailHtml({
  bodyHtml,
  trackingCode,
  publicUrl,
  subject,
}: {
  bodyHtml: string;
  trackingCode: string;
  publicUrl: string;
  subject: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">GOxpress Way</span>
              </div>
              <p style="margin:5px 0 0;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:0.5px;text-transform:uppercase;">
                Global Courier &amp; Logistics
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;">
              ${bodyHtml}
              <!-- Track button -->
              <div style="margin:28px 0 0;">
                <a href="${publicUrl}"
                   style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;
                          padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">
                  Track Your Shipment &rarr;
                </a>
              </div>
              <!-- Code block -->
              <div style="margin:24px 0 0;padding:16px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                <p style="margin:0;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Tracking Number</p>
                <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:19px;font-weight:700;color:#1e293b;letter-spacing:1px;">
                  ${trackingCode}
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.65;">
                You're receiving this email because you have an active shipment with GOxpress Way.<br>
                &copy; ${new Date().getFullYear()} GOxpress Way &middot; All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
    const opts = {
      estimatedDeliveryDate: args.estimatedDeliveryDate,
      senderCity: args.senderCity,
      receiverCity: args.receiverCity,
    };
    const from = "GOxpress Way <noreply@goxpressway.com>";

    // Build both emails
    const senderContent = getStatusEmailContent(
      args.status,
      args.senderName,
      args.trackingCode,
      opts
    );
    const receiverContent = getStatusEmailContent(
      args.status,
      args.receiverName,
      args.trackingCode,
      opts
    );

    const [senderResult, receiverResult] = await Promise.allSettled([
      resend.emails.send({
        from,
        to: [args.senderEmail],
        subject: senderContent.subject,
        html: buildEmailHtml({
          bodyHtml: senderContent.bodyHtml,
          trackingCode: args.trackingCode,
          publicUrl,
          subject: senderContent.subject,
        }),
      }),
      resend.emails.send({
        from,
        to: [args.receiverEmail],
        subject: receiverContent.subject,
        html: buildEmailHtml({
          bodyHtml: receiverContent.bodyHtml,
          trackingCode: args.trackingCode,
          publicUrl,
          subject: receiverContent.subject,
        }),
      }),
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

    await resend.emails.send({
      from: "GOxpress Way Website <noreply@goxpressway.com>",
      to: ["support@goxpressway.com"],
      replyTo: args.email,
      subject: `[Contact] ${args.subject}`,
      html: `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;color:#1e293b;padding:32px;max-width:600px">
  <h2 style="margin:0 0 16px">New Contact Form Submission</h2>
  <table style="border-collapse:collapse;width:100%">
    <tr><td style="padding:8px;font-weight:600;width:100px;color:#64748b">Name</td><td style="padding:8px">${args.name}</td></tr>
    <tr><td style="padding:8px;font-weight:600;color:#64748b">Email</td><td style="padding:8px"><a href="mailto:${args.email}">${args.email}</a></td></tr>
    <tr><td style="padding:8px;font-weight:600;color:#64748b">Subject</td><td style="padding:8px">${args.subject}</td></tr>
    <tr><td style="padding:8px;font-weight:600;color:#64748b;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${args.message}</td></tr>
  </table>
</body>
</html>`,
    });
  },
});
