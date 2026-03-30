import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Workout Template — Coach Luki",
  description:
    "Download a free 4-week workout template built by Coach Luki. The same programming used with 1-on-1 coaching clients in Berlin.",
  openGraph: {
    title: "Free Workout Template — Coach Luki",
    description:
      "Download a free 4-week workout template. The same programming used with 1-on-1 coaching clients in Berlin.",
  },
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
