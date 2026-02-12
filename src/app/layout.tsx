import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lazeez Gourmet | Authentic Middle Eastern Cuisine in Maldives",
  description:
    "Lazeez Gourmet brings the tastiest culinary treasures from the kitchens of the Middle East to the Maldives. Traditional cooking techniques, natural ingredients, unforgettable flavours.",
  keywords: [
    "Lazeez Gourmet",
    "Middle Eastern food",
    "Maldives restaurant",
    "Palestinian cuisine",
    "Halal food Male",
    "Shawarma Maldives",
  ],
  openGraph: {
    title: "Lazeez Gourmet | Authentic Middle Eastern Cuisine",
    description:
      "Traditional Middle Eastern cuisine in the heart of Maldives",
    url: "https://lazeez.mv",
    siteName: "Lazeez Gourmet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
