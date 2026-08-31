import { DataFigure } from "@/data/data-figures";
import { DataCard } from "./DataCard";

export function DataGallery({ figures }: { figures: DataFigure[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-flow-row-dense lg:gap-5">
      {figures.map((figure, i) => (
        <DataCard key={figure.id} figure={figure} index={i} />
      ))}
    </div>
  );
}
