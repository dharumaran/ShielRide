import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import { PwaRegister } from "@/components/PwaRegister";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "ShieldRide — Income protection for Q-commerce riders",
  description:
    "Parametric income protection for Zepto and Blinkit partners. Your income. Protected. Automatically.",
  applicationName: "ShieldRide",
  appleWebApp: {
    capable: true,
    title: "ShieldRide",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Onboard" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/disruptions", label: "Triggers" },
  { href: "/claims", label: "Claims" },
  { href: "/policy", label: "Policy" },
  { href: "/chat", label: "Chat" },
  { href: "/admin", label: "Admin" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          "min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100"
        )}
      >
        <ThemeProvider>
          <PwaRegister />
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <Link
                href="/"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                ShieldRide
              </Link>
              <div className="flex items-center gap-2">
                <nav className="hidden flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 md:flex">
                  {nav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {n.label}
                    </Link>
                  ))}
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-8">
            {children}
          </main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
