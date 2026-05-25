import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Resonara Publishers Pvt. Ltd. — Academic Publication Platform",
    template: "%s | Resonara Publishers",
  },
  description:
    "Resonara Publishers provides tools for manuscript submission, peer review, editorial workflows, and publication management.",
  keywords: ["academic publishing", "peer review", "manuscript submission", "journal management", "research"],
  authors: [{ name: "Resonara Publishers" }],
  openGraph: {
    type: "website",
    siteName: "Resonara Publishers",
    title: "Resonara Publishers — Academic Publication Platform",
    description: "Academic publication management platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonara Publishers — Academic Publication Platform",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
