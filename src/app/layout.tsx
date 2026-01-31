import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AIHireLaw - AI Hiring Compliance Made Simple",
    template: "%s | AIHireLaw",
  },
  description: "Navigate AI hiring laws with confidence. Compliance tools, audit checklists, and legal guidance for Colorado, Illinois, NYC, and beyond.",
  keywords: ["AI hiring law", "AI hiring compliance", "Colorado AI Act", "Illinois AIPA", "NYC Local Law 144", "automated employment decisions", "AEDT compliance"],
  metadataBase: new URL("https://aihirelaw.com"),
  openGraph: {
    title: "AIHireLaw - AI Hiring Compliance Made Simple",
    description: "Navigate AI hiring laws with confidence. Compliance tools and legal guidance for employers using AI in hiring.",
    url: "https://aihirelaw.com",
    siteName: "AIHireLaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIHireLaw - AI Hiring Compliance Made Simple",
    description: "Navigate AI hiring laws with confidence. Compliance tools and legal guidance for employers using AI in hiring.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
