import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Lazeez Gourmet",
  description:
    "Explore our full menu of authentic Middle Eastern dishes - from traditional hummus and shawarma to grilled meats and sweet desserts.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
