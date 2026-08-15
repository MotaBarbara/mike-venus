import type { Metadata } from "next";
import { Unbounded, Inter, Space_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Artist Name",
    template: "%s — Artist Name",
  },
  description:
    "Official site of Artist Name — hip-hop/R&B producer, songwriter, vocalist.",
  icons: {
    icon: "/favicon-96x96.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
