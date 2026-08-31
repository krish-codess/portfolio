"use client";

import { NAV_ITEMS } from "@/data/nav";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { SectionNav } from "@/components/chrome/SectionNav";
import { ThemeSwitcher } from "@/components/chrome/ThemeSwitcher";
import { EasterEgg } from "@/components/EasterEgg";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { ChooseYourFighter } from "@/sections/ChooseYourFighter";
import { IdentityIntro } from "@/sections/IdentityIntro";
import { Work } from "@/sections/Work";
import { DataLab } from "@/sections/DataLab";
import { Software } from "@/sections/Software";
import { Design } from "@/sections/Design";
import { Music } from "@/sections/Music";
import { LabNotebook } from "@/sections/LabNotebook";
import { Archive } from "@/sections/Archive";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function Home() {
  const { activeId, visitedCount } = useActiveSection(SECTION_IDS);

  return (
    <>
      <GrainOverlay />
      <CustomCursor />
      <SectionNav activeId={activeId} />
      <ThemeSwitcher />
      <EasterEgg />

      <main data-cursor="...">
        <Hero />
        <ChooseYourFighter />
        <IdentityIntro />
        <Work />
        <DataLab visitedCount={visitedCount} totalSections={SECTION_IDS.length} />
        <Software />
        <Design />
        <Music />
        <LabNotebook />
        <Archive />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
