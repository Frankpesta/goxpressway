import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind GOxpress Way — founded in 2019 in London. Our mission, values, leadership team, and journey to 50+ countries.",
  openGraph: {
    title: "About GOxpress Way — Our Story & Mission",
    description:
      "From a London startup to a global logistics platform. Meet the team and values driving GOxpress Way.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
