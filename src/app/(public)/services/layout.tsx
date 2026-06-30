import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Services",
  description:
    "Express, Standard, Freight, and International shipping services from GOxpress Way. Real-time tracking, full insurance, and delivery to 50+ countries.",
  openGraph: {
    title: "Shipping Services — GOxpress Way",
    description:
      "From 1-day express to worldwide freight — compare all GOxpress Way shipping services.",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
