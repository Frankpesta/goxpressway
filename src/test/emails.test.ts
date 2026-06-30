import { describe, it, expect } from "vitest";
import { getStatusEmailContent } from "../../convex/emails";

const CODE = "GOX-2026-839201";
const NAME = "Alice Smith";
const OPTS = { senderCity: "London", receiverCity: "New York", estimatedDeliveryDate: "2026-07-05" };

describe("getStatusEmailContent — subject lines", () => {
  it("Created", () => {
    const { subject } = getStatusEmailContent("Created", NAME, CODE);
    expect(subject).toBe(`Shipment Created — ${CODE}`);
  });

  it("Pending Pickup", () => {
    const { subject } = getStatusEmailContent("Pending Pickup", NAME, CODE);
    expect(subject).toBe(`Pending Pickup — ${CODE}`);
  });

  it("Picked Up", () => {
    const { subject } = getStatusEmailContent("Picked Up", NAME, CODE);
    expect(subject).toBe(`Shipment Picked Up — ${CODE}`);
  });

  it("In Transit", () => {
    const { subject } = getStatusEmailContent("In Transit", NAME, CODE);
    expect(subject).toBe(`In Transit — ${CODE}`);
  });

  it("At Facility", () => {
    const { subject } = getStatusEmailContent("At Facility", NAME, CODE);
    expect(subject).toBe(`Arrived at Facility — ${CODE}`);
  });

  it("Out for Delivery", () => {
    const { subject } = getStatusEmailContent("Out for Delivery", NAME, CODE);
    expect(subject).toBe(`Out for Delivery — ${CODE}`);
  });

  it("Delivered", () => {
    const { subject } = getStatusEmailContent("Delivered", NAME, CODE);
    expect(subject).toBe(`Delivered — ${CODE}`);
  });

  it("Failed", () => {
    const { subject } = getStatusEmailContent("Failed", NAME, CODE);
    expect(subject).toBe(`Delivery Attempt Failed — ${CODE}`);
  });

  it("Returned", () => {
    const { subject } = getStatusEmailContent("Returned", NAME, CODE);
    expect(subject).toBe(`Shipment Returned — ${CODE}`);
  });

  it("unknown status falls back gracefully", () => {
    const { subject } = getStatusEmailContent("CustomStatus", NAME, CODE);
    expect(subject).toBe(`Shipment Update — ${CODE}`);
  });
});

describe("getStatusEmailContent — heading", () => {
  it("Created heading is correct", () => {
    const { heading } = getStatusEmailContent("Created", NAME, CODE);
    expect(heading).toBe("Your shipment has been created");
  });

  it("Delivered heading is correct", () => {
    const { heading } = getStatusEmailContent("Delivered", NAME, CODE);
    expect(heading).toBe("Your shipment has been delivered");
  });

  it("unknown status heading mentions the status", () => {
    const { heading } = getStatusEmailContent("WeirdStatus", NAME, CODE);
    expect(heading).toContain("WeirdStatus");
  });
});

describe("getStatusEmailContent — bodyHtml", () => {
  it("includes recipient name in greeting", () => {
    const { bodyHtml } = getStatusEmailContent("Created", "Bob Jones", CODE);
    expect(bodyHtml).toContain("Bob Jones");
  });

  it("includes route cities when provided", () => {
    const { bodyHtml } = getStatusEmailContent("In Transit", NAME, CODE, OPTS);
    expect(bodyHtml).toContain("London");
    expect(bodyHtml).toContain("New York");
  });

  it("includes estimated delivery date when provided", () => {
    const { bodyHtml } = getStatusEmailContent("In Transit", NAME, CODE, OPTS);
    expect(bodyHtml).toContain("2026-07-05");
  });

  it("omits route line when cities not provided", () => {
    const { bodyHtml } = getStatusEmailContent("Created", NAME, CODE);
    expect(bodyHtml).not.toContain("&rarr;");
  });

  it("omits delivery line when estimatedDeliveryDate not provided", () => {
    const { bodyHtml } = getStatusEmailContent("Created", NAME, CODE);
    expect(bodyHtml).not.toContain("Estimated delivery:");
  });
});

describe("getStatusEmailContent — trigger conditions", () => {
  const statuses = [
    "Created",
    "Pending Pickup",
    "Picked Up",
    "In Transit",
    "At Facility",
    "Out for Delivery",
    "Delivered",
    "Failed",
    "Returned",
  ];

  it.each(statuses)("produces a non-empty subject for '%s'", (status) => {
    const { subject } = getStatusEmailContent(status, NAME, CODE);
    expect(subject.length).toBeGreaterThan(0);
    expect(subject).toContain(CODE);
  });

  it.each(statuses)("produces non-empty bodyHtml for '%s'", (status) => {
    const { bodyHtml } = getStatusEmailContent(status, NAME, CODE, OPTS);
    expect(bodyHtml.length).toBeGreaterThan(50);
  });
});
