import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Manrope, Fraunces, Anton, Unbounded } from "next/font/google";
import "./globals.css";
import { AppearanceProvider, APPEARANCE_INIT_SCRIPT } from "@/lib/theme/AppearanceProvider";
import { FocusProvider } from "@/lib/focus/FocusContext";
import { RhythmReactivityProvider, RhythmReactivityBridge } from "@/lib/rhythm/RhythmReactivityContext";
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

// SWISS's typeface -- a neutral, rational grotesk. Deliberately not the same family as
// Editorial's grotesk: no shared type DNA between the two.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// ARCHIVE's typeface -- a serif built for a research notebook / personal dossier, not a
// software product.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// EDITORIAL's hero typeface -- massive, condensed, ultra-heavy. Used directly by the hero,
// independent of the mode's own --font-display.
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  weight: ["400"],
});

// KINETIC's typeface -- geometric, expressive, built to carry motion and unusual tracking.
const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
  weight: ["400", "500", "700", "900"],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${grotesk.variable} ${plexMono.variable} ${manrope.variable} ${fraunces.variable} ${anton.variable} ${unbounded.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AppearanceProvider>
          <FocusProvider>
            <RhythmReactivityProvider>
              <RhythmReactivityBridge />
              {children}
            </RhythmReactivityProvider>
          </FocusProvider>
        </AppearanceProvider>
      </body>
    </html>
  );
}
