import { SOCIALS } from "@/data/site-config";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <SectionLabel index="08" label="CONTACT" />
      </Reveal>

      <Reveal delay={0.05}>
        <h2
          className="mt-8 font-display uppercase leading-[0.85] tracking-tight"
          style={{ fontSize: "clamp(3.2rem, 13vw, 9rem)" }}
        >
          LET&apos;S
          <br />
          MAKE
          <br />
          SOMETHING.
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <ul className="mt-14 flex flex-col divide-y divide-border border-y border-border">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                data-cursor="OPEN ↗"
                className="group flex items-center justify-between py-5 font-display text-2xl uppercase tracking-tight transition-colors duration-300 hover:text-accent sm:text-3xl"
              >
                {social.label}
                <span className="font-meta text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
