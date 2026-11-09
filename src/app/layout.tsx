import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/release";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const description =
  "Every Next.js release since 2016 on one searchable page. Find the latest stable and canary versions and read release notes without leaving the list.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: every version, stable and canary`,
    template: `%s · ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_NAME,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col font-sans">
        <Providers>
          <a
            href="#main"
            className="sr-only rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
          >
            Skip to releases
          </a>
          <SiteHeader />
          <div id="main" className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
