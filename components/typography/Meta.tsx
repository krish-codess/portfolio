import { cx } from "@/lib/utils";

export function Meta({
  children,
  className,
  dim = true,
}: {
  children: React.ReactNode;
  className?: string;
  dim?: boolean;
}) {
  return (
    <span className={cx("font-meta text-[11px] uppercase tracking-widest", dim && "text-muted-fg", className)}>
      {children}
    </span>
  );
}

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-meta text-[11px] text-accent">{index}</span>
      <span className="h-px w-8 bg-border" />
      <Meta>{label}</Meta>
    </div>
  );
}
