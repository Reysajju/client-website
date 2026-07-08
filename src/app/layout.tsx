import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Dancing Queen — A Bedtime Story by Mémère",
  description:
    "A whimsical bedtime picture book about a tiny winged fairy who dances in children's hair and guards their dreams. Written by Mémère for George and Myles — and for every child who believes in tiny wonders.",
  keywords: [
    "The Dancing Queen",
    "Mémère",
    "bedtime story",
    "children's book",
    "picture book",
    "fairy tale",
    "bedtime ritual",
    "whimsical fantasy",
  ],
  authors: [{ name: "Mémère" }],
  openGraph: {
    title: "The Dancing Queen — A Bedtime Story by Mémère",
    description:
      "A whimsical bedtime picture book about a tiny winged fairy who dances in children's hair and guards their dreams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}