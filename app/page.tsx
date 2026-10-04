"use client";

import { NAV_ITEMS } from "@/data/nav";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { SectionNav } from "@/components/chrome/SectionNav";
import { AppearanceControls } from "@/components/chrome/AppearanceControls";
import { SurpriseMe } from "@/components/SurpriseMe";
import { EasterEgg } from "@/components/EasterEgg";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { IdentityIntro } from "@/sections/IdentityIntro";
import { Work } from "@/sections/Work";
import { DataLab } from "@/sections/DataLab";
import { Music } from "@/sections/Music";
import { LabNotebook } from "@/sections/LabNotebook";
import { Archive } from "@/sections/Archive";
import { About } from "@/sections/About";
import { Codetober } from "@/sections/Codetober";
import { Contact } from "@/sections/Contact";

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function Home() {
  const { activeId, visitedCount } = useActiveSection(SECTION_IDS);

  return (
    <>
      <GrainOverlay />
      <CustomCursor />
      <SectionNav activeId={activeId} />
      <AppearanceControls />
      <SurpriseMe />
      <EasterEgg />

      <main data-cursor="...">
        <Hero />
        <IdentityIntro />
        <Work />
        <DataLab visitedCount={visitedCount} totalSections={SECTION_IDS.length} />
        <Music />
        <LabNotebook />
        <Archive />
        <About />
        <Codetober />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
