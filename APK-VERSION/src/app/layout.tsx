import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from "@/components/service-worker-register";
import { CurrencyProvider } from "@/lib/currency-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SimpleAccounting",
  description: "Track your income, expenses, budgets, and savings goals with our comprehensive personal finance management app.",
  keywords: ["finance", "budgeting", "expenses", "savings", "accounting", "personal finance"],
  authors: [{ name: "SimpleAccounting Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SimpleAccounting",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "SimpleAccounting",
    description: "Comprehensive personal finance management app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SimpleAccounting",
    description: "Track your income, expenses, and financial goals",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SimpleAccounting",
    "application-name": "SimpleAccounting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-96.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CurrencyProvider>
          {children}
          <Toaster />
          <ServiceWorkerRegister />
        </CurrencyProvider>
      </body>
    </html>
  );
}
