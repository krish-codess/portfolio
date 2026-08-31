import { SOFTWARE_PROJECTS } from "@/data/software";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { SoftwareRow } from "@/components/software/SoftwareRow";

export function Software() {
  return (
    <section id="software" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="04" label="SOFTWARE / SYSTEMS" />
        <p className="mt-6 max-w-md font-meta text-[11px] text-muted-fg">
          $ system.list() — expand any entry for stack details
        </p>
      </Reveal>

      <div className="mt-6 border-t border-border">
        {SOFTWARE_PROJECTS.map((project) => (
          <SoftwareRow key={project.index} project={project} />
        ))}
      </div>
    </section>
  );
}
