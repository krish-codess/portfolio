import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme/ThemeProvider";
import { FocusProvider } from "@/lib/focus/FocusContext";
import { AudioReactivityProvider, AudioReactivityBridge } from "@/lib/audio/AudioReactivityContext";
import { SITE } from "@/data/site-config";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krishgohel.dev"),
  title: "KRISH GOHEL — DATA × CODE × DESIGN × MUSIC",
  description: SITE.metaDescription,
  openGraph: {
    title: "KRISH GOHEL",
    description: SITE.metaDescription,
    type: "website",
    siteName: "KRISH GOHEL",
  },
  twitter: {
    card: "summary_large_image",
    title: "KRISH GOHEL",
    description: SITE.metaDescription,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${grotesk.variable} ${plexMono.variable} antialiased`}>
        <ThemeProvider>
          <FocusProvider>
            <AudioReactivityProvider>
              <AudioReactivityBridge />
              {children}
            </AudioReactivityProvider>
          </FocusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
