import { PLAYLISTS } from "@/data/playlists";
import { Meta } from "@/components/typography/Meta";

export function PlaylistList() {
  return (
    <div className="paper-stack rounded-[var(--radius)] border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <h4 className="font-display text-sm uppercase tracking-tight">PLAYLISTS</h4>
        <Meta>PLACEHOLDER -- LINK PENDING</Meta>
      </div>
      {PLAYLISTS.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0 sm:px-5">
          <div className="flex items-center gap-4">
            <span className="font-meta text-[11px] text-muted-fg">{p.index}</span>
            <div>
              <div className="font-display text-base uppercase leading-none">{p.title}</div>
              <div className="mt-1 font-meta text-[9px] uppercase tracking-wide text-muted-fg">{p.description}</div>
            </div>
          </div>
          {p.url ? (
            <a href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN ↗" className="font-meta text-[10px] text-accent">
              OPEN ↗
            </a>
          ) : (
            <span className="font-meta text-[9px] uppercase text-muted-fg">SOON</span>
          )}
        </div>
      ))}
    </div>
  );
}
