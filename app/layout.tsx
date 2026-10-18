import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-context";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#e040a0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev"),
  title: {
    default: "Codevas — Belajar Coding Interaktif & Gamifikasi Pemula",
    template: "%s — Codevas",
  },
  description:
    "Platform belajar coding interaktif dan gamifikasi web development nomor 1 di Indonesia. Kuasai HTML, CSS Flexbox, Grid, dan Frontend dari dasar langsung di browser secara visual dan gratis!",
  keywords: [
    "belajar coding",
    "belajar coding pemula",
    "belajar coding bahasa indonesia",
    "belajar css flexbox",
    "html architecture",
    "css grid tutorial",
    "interactive coding playground",
    "gamifikasi belajar programming",
    "kursus frontend developer gratis",
    "codevas",
  ],
  authors: [{ name: "Codevas Team", url: "https://codevas.dev" }],
  creator: "Codevas",
  publisher: "Codevas",
  category: "Education",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "Codevas",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Codevas",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://codevas.dev",
    siteName: "Codevas",
    title: "Codevas — Belajar Coding Interaktif & Gamifikasi Pemula",
    description:
      "Platform belajar coding interaktif dan gamifikasi web development nomor 1 di Indonesia. Kuasai HTML, CSS Flexbox, Grid, dan Frontend langsung di browser secara visual dan gratis!",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Codevas — Interactive Coding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codevas — Belajar Coding Interaktif & Gamifikasi Pemula",
    description:
      "Platform belajar coding interaktif dan gamifikasi web development nomor 1 di Indonesia. Kuasai HTML, CSS Flexbox, Grid, dan Frontend langsung di browser secara visual dan gratis!",
    images: ["/icons/icon-512.png"],
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
};

const jsonLdOrgAndWebsite = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://codevas.dev/#organization",
      "name": "Codevas",
      "url": "https://codevas.dev",
      "logo": "https://codevas.dev/icons/icon-512.png",
      "description":
        "Platform belajar coding interaktif dan gamifikasi web development pemula di Indonesia.",
      "sameAs": ["https://github.com/herinta/codevas-learning"],
    },
    {
      "@type": "WebSite",
      "@id": "https://codevas.dev/#website",
      "url": "https://codevas.dev",
      "name": "Codevas",
      "publisher": {
        "@id": "https://codevas.dev/#organization",
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://codevas.dev/classes?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrgAndWebsite) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
        <AuthProvider>
          <PwaProvider>
            {children}
            <MobileBottomNav />
          </PwaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
