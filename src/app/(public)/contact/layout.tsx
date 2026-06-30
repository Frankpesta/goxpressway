import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GOxpress Way. Our support team is available 24/7 via email, phone, or this contact form. Offices in London, New York, and Dubai.",
  openGraph: {
    title: "Contact GOxpress Way",
    description:
      "Reach our logistics experts any time. We respond within 2 hours.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
