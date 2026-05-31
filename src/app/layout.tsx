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
  metadataBase: new URL("https://resonarapublishers.com"),
  title: {
    default: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
    template: "%s | Resonara Publishers Pvt. Ltd.",
  },
  description:
    "Resonara Publishers Pvt. Ltd.is a leading academic publishing platform offering peer-reviewed journals, manuscript submission, editorial workflow management, and open-access research publication.",
  keywords: [
    "Resonara Publishers Pvt. Ltd.",
    "academic publishing",
    "peer review",
    "manuscript submission",
    "open access journals",
    "scholarly articles",
    "research publication",
    "journal management",
    "scientific publishing India",
    "academic journals online",
  ],
  authors: [{ name: "Resonara Publishers Pvt. Ltd.", url: "https://resonarapublishers.com" }],
  creator: "Resonara Publishers Pvt. Ltd.",
  publisher: "Resonara Publishers Pvt. Ltd.",
  category: "Academic Publishing",
  alternates: {
    canonical: "https://resonarapublishers.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resonarapublishers.com",
    siteName: "Resonara Publishers Pvt. Ltd.",
    title: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
    description:
      "Resonara Publishers Pvt. Ltd.— Empowering researchers with fast, transparent, and rigorous peer-reviewed publication services.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resonara Publishers Pvt. Ltd.— Academic Publishing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
    description:
      "Submit, review, and publish world-class research with Resonara Publishers Pvt. Ltd..",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification token here once you get it
    // google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://resonarapublishers.com/#organization",
  name: "Resonara Publishers Pvt. Ltd.",
  alternateName: "Resonara Publishers Pvt. Ltd.",
  url: "https://resonarapublishers.com",
  logo: {
    "@type": "ImageObject",
    url: "https://resonarapublishers.com/logo.png",
    width: 400,
    height: 100,
  },
  description:
    "Resonara Publishers Pvt. Ltd.is a peer-reviewed academic publishing platform providing manuscript submission, editorial workflow, and  journal publication services.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit No 603-604, 6th Floor, Bhutani Alphathums, Nepz Post Office",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201305",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: "9818499209",
    email: "Info@resonarapublishers.com",
    url: "https://resonarapublishers.com/contact",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://resonarapublishers.com/#website",
  url: "https://resonarapublishers.com",
  name: "Resonara Publishers Pvt. Ltd.",
  description:
    "Peer-reviewed academic publishing — journals, manuscript submission, and editorial management.",
  publisher: {
    "@id": "https://resonarapublishers.com/#organization",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://resonarapublishers.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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
