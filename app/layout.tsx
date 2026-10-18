import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-context";
import { PwaProvider } from "@/components/pwa/pwa-provider";
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
  title: "Codevas — Belajar Coding Jadi Semenyenangkan Bermain Game",
  description:
    "Interactive UI Learning Engine untuk pemula. Buka browser, manipulasi template kode secara real-time, dan taklukkan quest coding seru berhadiah XP!",
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
    title: "Codevas — Belajar Coding Jadi Semenyenangkan Bermain Game",
    description:
      "Interactive UI Learning Engine untuk pemula. Buka browser, manipulasi template kode secara real-time, dan taklukkan quest coding seru berhadiah XP!",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Codevas Logo Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codevas — Belajar Coding Jadi Semenyenangkan Bermain Game",
    description:
      "Interactive UI Learning Engine untuk pemula. Buka browser, manipulasi template kode secara real-time, dan taklukkan quest coding seru berhadiah XP!",
    images: ["/icons/icon-512.png"],
  },
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
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
        <AuthProvider>
          <PwaProvider>{children}</PwaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
