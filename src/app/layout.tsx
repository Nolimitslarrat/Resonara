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
    default: "NexScholar — Academic Publication Platform",
    template: "%s | NexScholar",
  },
  description:
    "NexScholar is an enterprise-grade academic publication management platform. Submit manuscripts, manage peer review, and publish world-class research.",
  keywords: ["academic publishing", "peer review", "manuscript submission", "journal management", "research"],
  authors: [{ name: "NexScholar" }],
  openGraph: {
    type: "website",
    siteName: "NexScholar",
    title: "NexScholar — Academic Publication Platform",
    description: "Enterprise-grade academic publication management platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexScholar — Academic Publication Platform",
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
